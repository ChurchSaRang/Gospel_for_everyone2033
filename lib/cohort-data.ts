import { prisma } from '@/lib/prisma';
import { upcomingBatches } from '@/lib/site-data';

export async function getPublicCohorts() {
    const batches = await prisma.batch.findMany({
        where: { code: { in: upcomingBatches.map((batch) => batch.code) } },
        select: { code: true, participantCount: true },
    });
    const participantCounts = new Map(batches.map((batch) => [batch.code, batch.participantCount]));

    return upcomingBatches.map((batch) => ({
        ...batch,
        participantCount: participantCounts.get(batch.code) ?? 0,
    }));
}
