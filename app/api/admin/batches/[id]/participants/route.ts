import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizeAdminApi } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

const participantCountSchema = z.object({
    participantCount: z.number().int().min(0),
}).strict();

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> },
) {
    const authorization = await authorizeAdminApi(['BATCH_COORDINATOR']);
    if (authorization.response) return authorization.response;

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: 'A valid JSON request body is required.' }, { status: 400 });
    }

    const parsedBody = participantCountSchema.safeParse(body);
    if (!parsedBody.success) {
        return NextResponse.json({ message: 'Participant count must be a non-negative whole number.' }, { status: 400 });
    }

    const { id } = await context.params;
    try {
        const batch = await prisma.batch.findUnique({
            where: { id },
            select: { id: true, capacity: true },
        });
        if (!batch) {
            return NextResponse.json({ message: 'Cohort not found.' }, { status: 404 });
        }

        if (parsedBody.data.participantCount > batch.capacity) {
            return NextResponse.json({ message: `Participant count cannot exceed the cohort capacity of ${batch.capacity}.` }, { status: 400 });
        }

        const updatedBatch = await prisma.batch.update({
            where: { id },
            data: { participantCount: parsedBody.data.participantCount },
            select: { id: true, participantCount: true },
        });

        return NextResponse.json({ message: 'Participant count saved.', data: updatedBatch });
    } catch (error) {
        return NextResponse.json({ message: 'Could not save participant count.', error: String(error) }, { status: 500 });
    }
}
