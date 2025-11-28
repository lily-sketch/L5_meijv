import { Step, VariableState } from '../types';

export const createStep = (
  lineIndex: number, 
  description: string, 
  variables: VariableState, 
  highlights: number[] = [],
  output: string = ""
): Step => ({
  lineIndex,
  description,
  variables: { ...variables }, // Clone to prevent reference mutation
  highlights,
  output
});

export const parseInput = (input: string): number[] => {
  return input.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
};
