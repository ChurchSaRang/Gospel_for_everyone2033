import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_SESSION_COOKIE = 'gte_admin_session';

export function hashPassword(value: string) {
    return crypto.createHash('sha256').update(value.trim()).digest('hex');
}

export function signAdminSession(payload: Record<string, string>) {
    const secret = process.env.NEXTAUTH_SECRET || 'dev-secret-change-me';
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
    return `${encoded}.${signature}`;
}

export function verifyAdminSession(rawValue?: string) {
    if (!rawValue) return null;

    const [encoded, signature] = rawValue.split('.');
    if (!encoded || !signature) return null;

    const secret = process.env.NEXTAUTH_SECRET || 'dev-secret-change-me';
    const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        try {
            const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Record<string, string>;
            if (payload.email && payload.role) {
                return payload;
            }
        } catch {
            return null;
        }
    }

    return null;
}

export async function requireAdminSession() {
    const cookieStore = await cookies();
    const session = verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

    if (!session) {
        redirect('/admin/login');
    }

    return session;
}
