import fs from 'fs';
import { pack } from '../lua/packLua.js';
import { RESET_MODULES_LUA } from './constants.js';
import type { ProcessConfig, ProcessDirectory } from '../../types.js';

declare const prerunScript: string;

function buildDirectoryCode(directory: ProcessDirectory): string {
  return `
package.preload["aoform.directory"] = function () return {
  ${Object.keys(directory).map((key) => `["${key}"] = "${directory[key]}"`).join(',\n')}
} end
  `.trim();
}

export function buildLuaCode(processInfo: ProcessConfig, directory: ProcessDirectory): string {
  const filePath = processInfo.file;
  const prerunFilePath = processInfo.prerun || '';

  const mainScript = processInfo.pack ? pack(filePath) : fs.readFileSync(filePath, 'utf8');
  const prerunScript = prerunFilePath ? fs.readFileSync(prerunFilePath, 'utf8') : '';
  const resetModulesCode = processInfo.resetModules === false ? '' : RESET_MODULES_LUA;
  const directoryCode = processInfo.directory === true ? buildDirectoryCode(directory) : '';

  return `${resetModulesCode}\n${directoryCode}\n${prerunScript}\n${mainScript}`;
}
