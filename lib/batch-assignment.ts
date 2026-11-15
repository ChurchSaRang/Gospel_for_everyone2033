export type BatchWithCapacity = {
    id: string;
    code: string;
    name: string;
    capacity: number;
    assignmentNumber: number;
    isOpen: boolean;
};

export function findBatchForApplication(
    batches: BatchWithCapacity[],
    preferredBatch?: string | null,
) {
    const ordered = [...batches].sort((left, right) => left.assignmentNumber - right.assignmentNumber);
    const byPreference = preferredBatch
        ? ordered.filter((batch) => batch.code === preferredBatch || batch.name === preferredBatch)
        : [];

    const candidates = byPreference.length > 0 ? byPreference : ordered;
    return candidates.find((batch) => batch.isOpen && batch.assignmentNumber < batch.capacity) ?? null;
}
