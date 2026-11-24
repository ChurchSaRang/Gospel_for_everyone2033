import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const ADMIN_SESSION_COOKIE = 'gte_admin_session';
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

const adminRoles = [
    'SUPER_ADMIN',
    'APPLICATION_REVIEWER',
    'FINANCE_OFFICER',
    'BATCH_COORDINATOR',
    'CONTENT_MANAGER',
] as const;

export type AdminRole = typeof adminRoles[number];

export type AdminSession = {
    id: string;
    email: string;
    role: AdminRole;
    name: string;
    exp: number;
};

function getSessionSecret() {
    const secret = process.env.NEXTAUTH_SECRET?.trim();
    if (!secret || secret.length < 32 || secret === 'replace-with-a-secure-random-secret') {
        throw new Error('NEXTAUTH_SECRET must be set to a unique random value of at least 32 characters.');
    }

    return secret;
}

export function hashPassword(value: string) {
    if (value.length < 6) {
        throw new Error('Administrator passwords must be at least 6 characters long.');
    }

    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(value, salt, 64);
    return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(value: string, storedHash: string) {
    const [algorithm, saltHex, hashHex] = storedHash.split('$');
    if (algorithm !== 'scrypt' || !saltHex || !hashHex || !/^[a-f\d]{32}$/i.test(saltHex) || !/^[a-f\d]{128}$/i.test(hashHex)) {
        return false;
    }

    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(value, salt, expected.length);
    return crypto.timingSafeEqual(actual, expected);
}

export function signAdminSession(payload: Omit<AdminSession, 'exp'>) {
    const session = {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
    };
    const encoded = Buffer.from(JSON.stringify(session)).toString('base64url');
    const signature = crypto.createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
    return `${encoded}.${signature}`;
}

export function verifyAdminSession(rawValue?: string): AdminSession | null {
    if (!rawValue) return null;

    const parts = rawValue.split('.');
    if (parts.length !== 2) return null;
    const [encoded, signature] = parts;
    if (!encoded || !signature || !/^[A-Za-z\d_-]+$/.test(signature)) return null;

    const expected = crypto.createHmac('sha256', getSessionSecret()).update(encoded).digest();
    const received = Buffer.from(signature, 'base64url');
    if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;

    try {
        const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Partial<AdminSession>;
        if (
            typeof payload.id !== 'string'
            || typeof payload.email !== 'string'
            || typeof payload.name !== 'string'
            || typeof payload.role !== 'string'
            || !adminRoles.includes(payload.role as AdminRole)
            || typeof payload.exp !== 'number'
            || payload.exp <= Math.floor(Date.now() / 1000)
        ) {
            return null;
        }

        return payload as AdminSession;
    } catch {
        return null;
    }
}

export async function getCurrentAdminSession() {
    const cookieStore = await cookies();
    const session = verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
    if (!session) return null;

    const admin = await prisma.adminUser.findUnique({
        where: { id: session.id },
        select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!admin?.isActive || admin.email !== session.email || admin.role !== session.role) return null;
    return { ...session, name: admin.name };
}

export async function authorizeAdminApi(allowedRoles?: readonly AdminRole[]) {
    const session = await getCurrentAdminSession();
    if (!session) {
        return {
            session: null,
            response: NextResponse.json({ message: 'Administrator authentication is required.' }, { status: 401 }),
        };
    }

    if (allowedRoles && !allowedRoles.includes(session.role) && session.role !== 'SUPER_ADMIN') {
        return {
            session: null,
            response: NextResponse.json({ message: 'You do not have permission to perform this action.' }, { status: 403 }),
        };
    }

    return { session, response: null };
}

export async function requireAdminSession() {
    const session = await getCurrentAdminSession();

    if (!session) {
        redirect('/admin/login');
    }

    return session;
}
