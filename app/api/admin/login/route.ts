import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_SECONDS, signAdminSession, verifyPassword } from '@/lib/admin-auth';

const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1).max(256),
}).strict();

export async function POST(request: Request) {
    try {
        const parsed = loginSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        const admin = await prisma.adminUser.findUnique({
            where: { email: parsed.data.email.toLowerCase() },
        });

        if (!admin?.isActive || !verifyPassword(parsed.data.password, admin.passwordHash)) {
            return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
        }

        const session = signAdminSession({
            id: admin.id,
            email: admin.email,
            role: admin.role,
            name: admin.name,
        });

        const response = NextResponse.json({
            message: 'Login successful.',
            user: {
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        });

        response.cookies.set(ADMIN_SESSION_COOKIE, session, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: ADMIN_SESSION_SECONDS,
        });

        return response;
    } catch (error) {
        console.error('Administrator login failed:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ message: 'Login service is unavailable.' }, { status: 500 });
    }
}
