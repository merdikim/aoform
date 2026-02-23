import { scheduler } from '../../constants.js';
import type { DeployState, ProcessConfig, ProcessDirectory, Tag } from '../../types.js';

function mapTags(tags: Tag[] | undefined, directory: ProcessDirectory): Tag[] {
  return (tags || []).map((tag) => {
    if (!directory[tag.value]) return tag;
    return { ...tag, value: directory[tag.value] };
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function spawnProcess(
  ao: any,
  processInfo: ProcessConfig,
  state: DeployState,
  directory: ProcessDirectory
): Promise<string> {
  const name = processInfo.name;
  const tags = mapTags(processInfo.tags, directory);

  if (state[name]?.processId) {
    const existingProcessId = state[name].processId;
    console.log(`Using existing process ID '${existingProcessId}' for process '${name}'.`);
    return existingProcessId;
  }

  console.log('Spawning process...', {
    module: processInfo.module,
    scheduler: processInfo.scheduler,
    tags,
  });

  let spawnAttempts = 0;
  const maxSpawnAttempts = 5;
  const spawnDelay = 30000; // 30 seconds

  while (spawnAttempts < maxSpawnAttempts) {
    try {
      const processId = await ao.spawn({
        module: processInfo.module,
        scheduler, //: processInfo.scheduler,
        tags,
      });
      console.log('Spawned process:', processId);
      return processId;
    } catch (err) {
      spawnAttempts += 1;
      console.log('err', err);
      console.log(`Failed to spawn process '${name}'. Attempt ${spawnAttempts}/${maxSpawnAttempts}`);

      if (spawnAttempts === maxSpawnAttempts) {
        throw new Error(`Failed to spawn process '${name}' after ${maxSpawnAttempts} attempts.`);
      }

      console.log(`Retrying in ${spawnDelay / 1000} seconds...`);
      await sleep(spawnDelay);
    }
  }

  throw new Error(`Failed to spawn process '${name}'.`);
}
