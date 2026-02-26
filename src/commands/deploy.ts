import { deployProcesses } from '../core/deploy/index.js';
import type { OptionValues } from 'commander';
import { readFile, access } from 'node:fs/promises';

export const deployCommand = async (options: OptionValues) => {

  try {
    const walletPath = options.walletPath as string | undefined;
    let walletJson: string | undefined;

    if (walletPath) {
      walletJson = await readFile(walletPath, 'utf-8');
    } else {
      try {
        await access('wallet.json');
        walletJson = await readFile('wallet.json', 'utf-8');
      } catch {
        // If wallet.json is missing, deploy core will use existing WALLET_JSON env or throw.
      }
    }

    await deployProcesses({
      file: options.file as string | undefined,
      url: options.url as string | undefined,
      scheduler: options.scheduler as string | undefined,
      walletJson
    });
    process.exit(0);
  } catch (err) {
    console.error('Error deploying processes:', err);
    process.exit(1);
  }
};
