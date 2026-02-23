export type Tag = {
  name: string;
  value: string;
}

export type ProcessConfig = {
  name: string;
  file: string;
  pack?: boolean;
  prerun?: string;
  resetModules?: boolean;
  directory?: boolean;
  module?: string;
  scheduler?: string;
  tags?: Tag[];
}

export type ProcessState= {
  processId: string;
  hash: string;
}

export type DeployState = Record<string, ProcessState>;
export type ProcessDirectory = Record<string, string>;
