import levenshtein from 'fast-levenshtein';
import { CHARLIST_POSITION, CHARLIST_TIME, CHARLIST_USERNAME, PSM_SINGLE_CHAR, PSM_SINGLE_LINE } from '../constants';
import { Category } from '../types';

const cleanString = (str: string) => str.replace(/\n/g, '').replace(/ /g, '');

const positionIsValid = (position: string, max: number) => {
  if (!position) return false;
  const pos = Number(position);
  const isValid = position.length === 1 && pos >= 1 && pos <= max;

  return isValid;
};

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

const getParams = (category: Category) => {
  const { Position, Time, Username } = Category;

  switch (category) {
    case Position:
      return {
        tessedit_char_whitelist: CHARLIST_POSITION,
        tessedit_pageseg_mode: PSM_SINGLE_CHAR as any
      };

    case Username:
      return {
        tessedit_char_whitelist: CHARLIST_USERNAME,
        tessedit_pageseg_mode: PSM_SINGLE_LINE as any
      };

    case Time:
    default:
      return {
        tessedit_char_whitelist: CHARLIST_TIME,
        tessedit_pageseg_mode: PSM_SINGLE_LINE as any
      };
  }
};

const applyRatio = (ratio: number, nb: number) => Math.floor(ratio * nb);

const charRange = (startChar: string, stopChar: string) => {
  const startInt = startChar.charCodeAt(0);
  const stopInt = stopChar.charCodeAt(0);
  const result = [];

  for (let i = startInt; i <= stopInt; i += 1) {
    result.push(String.fromCharCode(i));
  }

  return result;
};

export { applyRatio, charRange, cleanString, getCloserString, getParams, numberRange, positionIsValid };
