import crypto from 'crypto';
export function getStringHash(sourceText) {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(sourceText);
    return hashSum.digest('hex');
}
//# sourceMappingURL=hash.js.map