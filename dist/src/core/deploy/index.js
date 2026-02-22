import dotenv from 'dotenv';
import { connect, createDataItemSigner } from '@permaweb/aoconnect';
import { loadProcesses, loadState, saveState } from './io.js';
import { spawnProcess } from './spawnProcess.js';
import { deploySource } from './deploySource.js';
import { default_hb_url, default_scheduler, version } from '../../constants.js';
dotenv.config();
export async function deployProcesses({ file, url, scheduler }) {
    console.log(`aoform v${version}`);
    if (!process.env.WALLET_JSON) {
        throw new Error('Missing WALLET_JSON environment variable. Please provide wallet JSON in WALLET_JSON.');
    }
    const wallet = JSON.parse(process.env.WALLET_JSON);
    const signer = createDataItemSigner(wallet);
    const processes = loadProcesses(file);
    const state = loadState(file);
    const ao = connect({
        MODE: "mainnet",
        SCHEDULER: scheduler || default_scheduler,
        URL: url || default_hb_url,
        signer
    });
    const directory = {};
    for (const processInfo of processes) {
        directory[processInfo.name] = await spawnProcess(ao, processInfo, state, directory);
    }
    for (const processInfo of processes) {
        await deploySource(ao, processInfo, state, directory);
    }
    saveState(file, state);
}
//# sourceMappingURL=index.js.map