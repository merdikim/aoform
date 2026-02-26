import { Command } from 'commander';
import type { OptionValues } from 'commander';

export function createProgram() {
  const program = new Command();

  program
    .name('aoform')
    .description('A tool for managing AO processes ⚙️')

  program
    .command('init')
    .description('Initialize a new processes.yaml file')
    .option('-n, --name <name>', 'Create <name>.yaml (default: processes.yaml)')
    .action(async (options: OptionValues) => {
      const { initCommand } = await import('../commands/init.js');
      await initCommand(options);
    });

  program
    .command('deploy')
    .description('Deploy or update processes')
    .option('-f, --file <path>', 'Specify a custom processes.yaml file')
    .option('-u, --url <url>', 'Specify a HyperBEAM node URL')
    .option('-s, --scheduler <scheduler>', 'Specify a scheduler')
    .option('--wallet-path <path>', 'Specify a custom path to the wallet file')
    .action(async (options: OptionValues) => {
      const { deployCommand } = await import('../commands/deploy.js');
      await deployCommand(options);
    });

  return program;
}
