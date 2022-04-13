import levenshtein from 'fast-levenshtein';

const cleanString = (str: string) => str.replaceAll('\n', '').replaceAll(' ', '');

const getClosestString = (str: string, list: string[]) => {
  const listSafe = list.filter((s: string) => !!s);
  let min = Infinity;
  let name = str;

  listSafe.forEach((s: string) => {
    const lev = getEditDistance(str, s);

    if (lev < min) {
      min = lev;
      name = s;
    }
  });

  return name;
};

const getEditDistance = (str1: string, str2: string) => {
  const newStr1 = str1 || '';
  const newStr2 = str2 || '';

  return levenshtein.get(newStr1, newStr2);
};

const charRange = (startChar: string, stopChar: string) => {
  const startInt = startChar.charCodeAt(0);
  const stopInt = stopChar.charCodeAt(0);
  const result = [];

  for (let i = startInt; i <= stopInt; i += 1) {
    result.push(String.fromCharCode(i));
  }

  return result;
};

const sortAlphanumeric = (strA: string, strB: string) => {
  const regexAlpha = /[^a-zA-Z]/g;
  const regexNumeric = /[^0-9]/g;

  var newA = strA.replace(regexAlpha, '');
  var newB = strB.replace(regexAlpha, '');

  if (newA === newB) {
    var aN = parseInt(strA.replace(regexNumeric, ''), 10);
    var bN = parseInt(strB.replace(regexNumeric, ''), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  }

  return newA > newB ? 1 : -1;
};

const sortCaseInsensitive = (a: string, b: string) => {
  if (!a || !b) return 1;
  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();

  if (lowerA === lowerB) return 0;

  return lowerA > lowerB ? 1 : -1;
};

export { charRange, cleanString, getClosestString, getEditDistance, sortAlphanumeric, sortCaseInsensitive };
