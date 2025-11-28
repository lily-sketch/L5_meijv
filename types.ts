export enum ProblemType {
  WATER = 'WATER',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  QUEUE = 'QUEUE',
  POKER = 'POKER',
  FIND_THREE = 'FIND_THREE',
}

export interface VariableState {
  [key: string]: string | number | boolean | number[] | null | undefined;
}

export interface Step {
  lineIndex: number; // 0-based index of the code line
  description: string;
  variables: VariableState;
  highlights?: number[]; // Indices of array elements to highlight in the visualizer
  output?: string; // What would be printed to console
}

export interface SimulationResult {
  steps: Step[];
  error?: string;
}

export interface ProblemConfig {
  id: ProblemType;
  title: string;
  description: string;
  defaultInput: string;
  codeTemplate: string;
}