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

/**
 * Simply called edit distance as it's a custom version of Levenshtein distance
 * We keep the score of 1 for addition and deletion
 * But we attribute a score between 0 and 1 (e.g. 0.5) for substitution,
 * based on the similarity of pattern of the two characters
 */
const getEditDistance = (str1: string, str2: string) => {
  const newStr1 = str1 || '';
  const newStr2 = str2 || '';

  if (newStr1 === '') return newStr2.length;
  if (newStr2 === '') return newStr1.length;

  const distance: number[][] = [];

  for (let i = 0; i <= newStr1.length; i++) {
    const distanceLine: number[] = [];

    for (let j = 0; j <= newStr2.length; j++) {
      distanceLine.push(0);
    }

    distance.push(distanceLine);
  }

  for (let i = 1; i <= newStr1.length; i++) {
    distance[i][0] = i;
  }

  for (let j = 1; j <= newStr2.length; j++) {
    distance[0][j] = j;
  }

  for (let j = 1; j <= newStr2.length; j++) {
    for (let i = 1; i <= newStr1.length; i++) {
      const isSameCharacter = newStr1[i - 1] === newStr2[j - 1];

      const substitutionCost = isSameCharacter ? 0 : 1;

      distance[i][j] = Math.min(
        distance[i - 1][j] + 1,
        distance[i][j - 1] + 1,
        distance[i - 1][j - 1] + substitutionCost
      );
    }
  }

  return distance[newStr1.length][newStr2.length];
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
