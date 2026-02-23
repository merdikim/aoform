import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import type { DeployState, ProcessConfig } from '../../types.js';

function getStateFileName(customFilePath?: string): string {
  if (!customFilePath) return 'state.yaml';
  return `state-${customFilePath}`;
}

export function loadProcesses(customFilePath?: string): ProcessConfig[] {
  const processesYamlPath = path.join(process.cwd(), customFilePath || 'processes.yaml');

  try {
    const processesYaml = fs.readFileSync(processesYamlPath, 'utf8');
    const processes = (yaml.load(processesYaml) || []) as unknown;
    if (!Array.isArray(processes)) {
      throw new Error(`Expected an array in ${processesYamlPath}`);
    }
    return processes as ProcessConfig[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err;
    }
    console.warn(`${path.basename(processesYamlPath)} file not found. No processes will be deployed or updated.`);
    return [];
  }
}

export function loadState(customFilePath?: string): DeployState {
  const stateFile = getStateFileName(customFilePath);
  const stateYamlPath = path.join(process.cwd(), stateFile);

  try {
    const stateYaml = fs.readFileSync(stateYamlPath, 'utf8');
    return (yaml.load(stateYaml) || {}) as DeployState;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }
    throw err;
  }
}

export function saveState(customFilePath: string | undefined, state: DeployState): void {
  const stateFile = getStateFileName(customFilePath);
  const stateYamlPath = path.join(process.cwd(), stateFile);
  const updatedState = yaml.dump(state);
  fs.writeFileSync(stateYamlPath, updatedState, 'utf8');
}
