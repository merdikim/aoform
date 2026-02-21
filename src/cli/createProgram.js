import { Command } from 'commander';
import { version} from '../constants.js'

export function createProgram() {
  const program = new Command();

  program
    .name('aoform')
    .description('A tool for managing AO processes')
    .version(version);

  program
    .command('init')
    .description('Initialize a new processes.yaml file')
    .option('-n, --name <name>', 'Create <name>.yaml (default: processes.yaml)')
    .action(async (options) => {
      const { initCommand } = await import('../commands/init.js');
      await initCommand(options);
    });

  program
    .command('deploy')
    .description('Deploy or update processes')
    .option('-f, --file <path>', 'Specify a custom processes.yaml file')
    .action(async (options) => {
      const { deployCommand } = await import('../commands/deploy.js');
      await deployCommand(options);
    });

  return program;
}
