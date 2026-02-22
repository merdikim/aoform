import { deployProcesses } from '../core/deploy/index.js';
import type { OptionValues } from 'commander';

export const deployCommand = async (options: OptionValues) => {

  try {
    await deployProcesses({file:options.file as string | undefined, url:options.url as string | undefined, scheduler:options.scheduler as string | undefined});
    process.exit(0);
  } catch (err) {
    console.error('Error deploying processes:', err);
    process.exit(1);
  }
};
