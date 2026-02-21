import { deployProcesses } from '../core/deploy/index.js';

export const deployCommand = async (options) => {

  try {
    await deployProcesses(options.file);
    process.exit(0);
  } catch (err) {
    console.error('Error deploying processes:', err);
    process.exit(1);
  }
};
