import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

function getStateFileName(customFilePath) {
  if (!customFilePath) return 'state.yaml';
  return `state-${customFilePath}`;
}

export function loadProcesses(customFilePath) {
  const processesYamlPath = path.join(process.cwd(), customFilePath || 'processes.yaml');

  try {
    const processesYaml = fs.readFileSync(processesYamlPath, 'utf8');
    const processes = yaml.load(processesYaml) || [];
    if (!Array.isArray(processes)) {
      throw new Error(`Expected an array in ${processesYamlPath}`);
    }
    return processes;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    console.warn(`${path.basename(processesYamlPath)} file not found. No processes will be deployed or updated.`);
    return [];
  }
}

export function loadState(customFilePath) {
  const stateFile = getStateFileName(customFilePath);
  const stateYamlPath = path.join(process.cwd(), stateFile);

  try {
    const stateYaml = fs.readFileSync(stateYamlPath, 'utf8');
    return yaml.load(stateYaml) || {};
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {};
    }
    throw err;
  }
}

export function saveState(customFilePath, state) {
  const stateFile = getStateFileName(customFilePath);
  const stateYamlPath = path.join(process.cwd(), stateFile);
  const updatedState = yaml.dump(state);
  fs.writeFileSync(stateYamlPath, updatedState, 'utf8');
}
