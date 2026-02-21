import { createProgram } from './createProgram.js';

export async function run(argv = process.argv) {
  try {
    await createProgram().parseAsync(argv);
  } catch (err) {
    console.error('CLI execution failed:', err);
    process.exitCode = 1;
  }
}
