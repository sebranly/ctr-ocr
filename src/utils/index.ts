import levenshtein from 'fast-levenshtein';
import {
  CHARLIST_POSITION,
  CHARLIST_TIME,
  CHARLIST_USERNAME,
  CTR_MAX_TIME_DIFF_SEC,
  PSM_SINGLE_CHAR,
  PSM_SINGLE_LINE,
  TIME_DNF
} from '../constants';
import { Category, Validation } from '../types';
import { REGEX_TIME } from './regEx';

const cleanString = (str: string) => str.replace(/\n/g, '').replace(/ /g, '');

const positionIsValid = (position: string, max: number) => {
  if (!position) return false;
  const pos = Number(position);
  const isValid = position.length === 1 && pos >= 1 && pos <= max;

  return isValid;
};

const convertToMs = (time: string) => {
  const timeIsValid = REGEX_TIME.test(time);
  if (!timeIsValid) return 0;

  const splits = time.split(':');
  if (splits.length < 3) return 0;
  const [minutesStr, secondsStr, centisecondsStr] = splits;

  const minutes = Number(minutesStr);
  const seconds = Number(secondsStr);
  const centiseconds = Number(centisecondsStr);

  const milliseconds = centiseconds * 10 + seconds * 1000 + minutes * 60 * 1000;

  return milliseconds;
};

const getCloserString = (str: string, list: string[]) => {
  const listSafe = list.filter((s: string) => !!s);
  let min = Infinity;
  let name = str;

  listSafe.forEach((s: string) => {
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

const validateTimes = (times: string[]) => {
  const positionNotTime: number[] = [];
  const validation: Validation = {
    correct: false,
    errMsg: ''
  };

  times.forEach((time: string, index: number) => {
    const timeIsValid = REGEX_TIME.test(time) || time === TIME_DNF;

    if (!timeIsValid) {
      positionNotTime.push(index + 1);
    }
  });

  if (positionNotTime.length > 0) {
    validation.errMsg = `The following positions have incorrect formatted times: ${positionNotTime.join(', ')}`;
    return validation;
  }

  const minIndexTimeDnf = times.indexOf(TIME_DNF);
  if (minIndexTimeDnf !== -1) {
    const positionAfterDnf = [];

    for (let i = minIndexTimeDnf + 1; i < times.length; i++) {
      if (times[i] !== TIME_DNF) {
        positionAfterDnf.push(i + 1);
      }
    }

    if (positionAfterDnf.length > 0) {
      validation.errMsg = `The following positions finished after somebody that did not finish: ${positionAfterDnf.join(
        ', '
      )}`;

      return validation;
    }
  }

  const finishedTimesLength = minIndexTimeDnf !== -1 ? minIndexTimeDnf : times.length;
  const finishedTimes = times.slice(0, finishedTimesLength);
  const finishedTimesMs = finishedTimes.map(convertToMs);
  const copyMs = [...finishedTimesMs];
  const sortedTimesMs = copyMs.sort((a: number, b: number) => {
    return a - b;
  });

  if (finishedTimesMs.toString() !== sortedTimesMs.toString()) {
    validation.errMsg = `From position 1 to position ${finishedTimesLength}, times are not in chronological order`;

    return validation;
  }

  if (sortedTimesMs.length > 1) {
    const maxTime = sortedTimesMs[sortedTimesMs.length - 1];
    const minTime = sortedTimesMs[0];

    const diffTime = maxTime - minTime;
    if (diffTime > CTR_MAX_TIME_DIFF_SEC * 1000) {
      validation.errMsg = `There are more than ${CTR_MAX_TIME_DIFF_SEC} seconds separating players`;

      return validation;
    }
  }

  validation.correct = true;
  return validation;
};

export {
  applyRatio,
  charRange,
  cleanString,
  convertToMs,
  getCloserString,
  getParams,
  numberRange,
  positionIsValid,
  validateTimes
};
