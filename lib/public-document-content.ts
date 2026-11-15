import { readFile } from 'node:fs/promises';
import path from 'node:path';
import mammoth from 'mammoth';

export async function readPublicDocumentText(fileName: string) {
    const filePath = path.join(process.cwd(), 'public', 'public docs', fileName);
    const buffer = await readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
}
