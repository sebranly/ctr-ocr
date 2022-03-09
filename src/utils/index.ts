import levenshtein from 'fast-levenshtein';

const cleanString = (str: string) => str.replace(/\n/g, '').replace(/ /g, '');

const getCloserString = (str: string, list: string[]) => {
  let min = Infinity;
  let name = str;

  list.forEach((s: string) => {
    const lev = levenshtein.get(str, s);

    if (lev < min) {
      min = lev;
      name = s;
    }
  });

  return name;
};

const numberRange = (min: number, max: number) => {
  const numbers = [];
  for (let i = min; i <= max; i += 1) numbers.push(i);
  return numbers;
};

const applyRatio = (ratio: number, nb: number) => Math.round(ratio * nb);

const charRange = (startChar: string, stopChar: string) => {
  const startInt = startChar.charCodeAt(0);
  const stopInt = stopChar.charCodeAt(0);
  const result = [];

  for (let i = startInt; i <= stopInt; i += 1) {
    result.push(String.fromCharCode(i));
  }

  return result;
};

export { applyRatio, charRange, cleanString, getCloserString, numberRange };
