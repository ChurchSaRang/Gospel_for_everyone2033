import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_SESSION_COOKIE, hashPassword, signAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = String(body.email || '').trim().toLowerCase();
        const password = String(body.password || '');

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        const admin = await prisma.adminUser.findUnique({
            where: { email },
        });

        if (!admin || admin.passwordHash !== hashPassword(password)) {
            return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
        }

        const session = signAdminSession({
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
            maxAge: 60 * 60 * 8,
        });

        return response;
    } catch (error) {
        return NextResponse.json({ message: 'Login failed.', error: String(error) }, { status: 500 });
    }
}
