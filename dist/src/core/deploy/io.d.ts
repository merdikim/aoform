import type { DeployState, ProcessConfig } from '../../types.js';
export declare function loadProcesses(customFilePath?: string): ProcessConfig[];
export declare function loadState(customFilePath?: string): DeployState;
export declare function saveState(customFilePath: string | undefined, state: DeployState): void;
//# sourceMappingURL=io.d.ts.map