import { buildLuaCode } from './luaCode.js';
import { getStringHash } from './hash.js';
import type { DeployState, ProcessConfig, ProcessDirectory } from '../../types.js';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function deploySource(
  ao: any,
  processInfo: ProcessConfig,
  state: DeployState,
  directory: ProcessDirectory
): Promise<void> {
  const name = processInfo.name;
  const processId = directory[name];
  if (!processId) {
    throw new Error(`No process ID found for '${name}'.`);
  }

  const luaCode = buildLuaCode(processInfo, directory);
  const currentHash = getStringHash(luaCode);

  if (state[name]?.hash === currentHash) {
    console.log(`Process '${name}' is up-to-date.`);
    return;
  }

  let attempts = 0;
  const maxAttempts = 5;
  const delay = 30000;

  console.log('Sending code...');
  while (attempts < maxAttempts) {
    try {
      const messageId = await ao.message({
        process: processId,
        data: luaCode,
        tags: [{ name: 'Action', value: 'Eval' }],
      });

      const result = await ao.result({
        process: processId,
        message: messageId,
      });

      if (result.Error) {
        throw new Error(`Error on 'eval' action: ${JSON.stringify(result.Error)}`);
      }

      console.log(`Successfully sent 'Eval' action for process '${name}'.`)
      console.log(`view result on Lunar Explorer: https://lunar.ar.io/#/explorer/${processId}`);

      state[name] = { processId, hash: currentHash };
      return;
    } catch (err) {
      attempts += 1;
      console.error('error', err);
      console.log(`Failed to send 'eval' action for process '${name}'. Attempt ${attempts}/${maxAttempts}`);

      if (attempts === maxAttempts) {
        throw new Error(`Failed to send 'eval' action for process '${name}' after ${maxAttempts} attempts.`);
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await sleep(delay);
    }
  }
}
