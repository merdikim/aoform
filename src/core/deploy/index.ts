import dotenv from 'dotenv';
import { connect, createDataItemSigner } from '@permaweb/aoconnect';
import { loadProcesses, loadState, saveState } from './io.js';
import { spawnProcess } from './spawnProcess.js';
import { deploySource } from './deploySource.js';
import { default_hb_url, default_scheduler } from '../../constants.js';
import type { ProcessDirectory } from '../../types.js';

dotenv.config();

export async function deployProcesses({file, url, scheduler, walletJson}: {file?: string, url?: string, scheduler?: string, walletJson?: string}) {

  const resolvedWalletJson = walletJson ?? process.env.WALLET_JSON;

  if (!resolvedWalletJson) {
    throw new Error('Missing WALLET_JSON environment variable. Please provide wallet JSON via WALLET_JSON env var, specify --wallet-path flag, or create a wallet.json file at the root of your project.');
  }

  const wallet = JSON.parse(resolvedWalletJson) as unknown;
  const signer = createDataItemSigner(wallet as any);

  const processes = loadProcesses(file);
  const state = loadState(file);

  const ao = connect(
    { 
      MODE: "mainnet", 
      SCHEDULER:scheduler || default_scheduler,
      URL: url || default_hb_url, 
      signer 
    }
  );

  const directory: ProcessDirectory = {};

  for (const processInfo of processes) {
    directory[processInfo.name] = await spawnProcess(ao, processInfo, state, directory);
  }

  for (const processInfo of processes) {
    await deploySource(ao, processInfo, state, directory);
  }

  saveState(file, state);
}
