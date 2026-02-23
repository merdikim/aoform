import crypto from 'crypto';

export function getStringHash(sourceText: string): string {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(sourceText);
  return hashSum.digest('hex');
}
