import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
function loadPackageVersion() {
    let currentDir = path.dirname(fileURLToPath(import.meta.url));
    while (true) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            try {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                if (typeof packageJson.version === 'string' && packageJson.version.length > 0) {
                    return packageJson.version;
                }
            }
            catch {
                // Ignore malformed JSON and continue searching upward.
            }
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            break;
        }
        currentDir = parentDir;
    }
    return '0.0.0';
}
export const version = loadPackageVersion();
export const default_hb_url = "https://push.forward.computer/";
export const scheduler = "n_XZJhUnmldNFo4dhajoPZWhBXuJk-OcQr5JQ49c4Zo";
export const default_scheduler = "n_XZJhUnmldNFo4dhajoPZWhBXuJk-OcQr5JQ49c4Zo";
export const authority = "n_XZJhUnmldNFo4dhajoPZWhBXuJk-OcQr5JQ49c4Zo";
//# sourceMappingURL=constants.js.map