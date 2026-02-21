import dotenv from 'dotenv';
import { connect, createDataItemSigner } from '@permaweb/aoconnect';
import { loadProcesses, loadState, saveState } from './io.js';
import { spawnProcess } from './spawnProcess.js';
import { deploySource } from './deploySource.js';
import { version } from '../../constants.js'

dotenv.config();

export async function deployProcesses(customFilePath) {
  console.log(`aoform v${version}`);

  if (!process.env.WALLET_JSON) {
    throw new Error('Missing WALLET_JSON environment variable. Please provide wallet JSON in WALLET_JSON.');
  }

  const wallet = JSON.parse(process.env.WALLET_JSON);
  const signer = createDataItemSigner(wallet);

  const processes = loadProcesses(customFilePath);
  const state = loadState(customFilePath);
  
  const ao = connect();

  const directory = {};
  for (const processInfo of processes) {
    directory[processInfo.name] = await spawnProcess(ao, processInfo, state, signer, directory);
  }

  for (const processInfo of processes) {
    await deploySource(ao, processInfo, state, signer, directory);
  }

  saveState(customFilePath, state);
}
