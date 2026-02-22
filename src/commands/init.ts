import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { OptionValues } from 'commander';

export const initCommand = async (options: OptionValues = {}) => {
  const name = (options.name as string | undefined)?.trim();
  const fileName = name
    ? (name.endsWith('.yaml') || name.endsWith('.yml') ? name : `${name}.yaml`)
    : 'processes.yaml';
  const configFilePath = path.join(process.cwd(), fileName);
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templatePath = path.resolve(__dirname, '../templates/processes.yaml');

  try {
    await fs.access(configFilePath);
    console.log(`${path.basename(configFilePath)} file already exists.`);
  } catch {
    const template = await fs.readFile(templatePath, 'utf-8');
    await fs.writeFile(configFilePath, template, 'utf-8');
    console.log(`${path.basename(configFilePath)} file created successfully.`);
  }
};
