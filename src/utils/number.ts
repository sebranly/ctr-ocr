const numberRange = (min: number, max: number) => {
  const numbers = [];
  for (let i = min; i <= max; i += 1) numbers.push(i);
  return numbers;
};

const applyRatio = (ratio: number, nb: number) => Math.floor(ratio * nb);

export { applyRatio, numberRange };
