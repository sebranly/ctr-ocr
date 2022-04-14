import { numberRange } from './number';

const isEqual = (a1: (number | string)[], a2: (number | string)[]) => {
  if (a1.length !== a2.length) return false;
  return a1.every((v, i) => v === a2[i]);
};

const createArraySameValue = (length: number, value: any) => {
  if (length === 0) return [];
  if (length === 1) return [value];

  return numberRange(1, length).map((_v: number) => value);
};

export { createArraySameValue, isEqual };
