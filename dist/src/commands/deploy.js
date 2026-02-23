import { deployProcesses } from '../core/deploy/index.js';
export const deployCommand = async (options) => {
    try {
        await deployProcesses({ file: options.file, url: options.url, scheduler: options.scheduler });
        process.exit(0);
    }
    catch (err) {
        console.error('Error deploying processes:', err);
        process.exit(1);
    }
};
//# sourceMappingURL=deploy.js.map