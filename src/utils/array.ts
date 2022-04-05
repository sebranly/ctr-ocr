const isEqual = (a1: (number | string)[], a2: (number | string)[]) => {
  if (a1.length !== a2.length) return false;
  return a1.every((v, i) => v === a2[i]);
};

export { isEqual };
