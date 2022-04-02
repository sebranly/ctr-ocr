import levenshtein from 'fast-levenshtein';
import {
  CHARLIST_POSITION,
  CHARLIST_TIME,
  CHARLIST_USERNAME,
  CTR_MAX_PLAYERS,
  CTR_MAX_TIME_DIFF_SEC,
  LOG_CONSOLE,
  MIME_JPEG,
  MIME_PNG,
  PSM_SINGLE_CHAR,
  PSM_SINGLE_LINE,
  SEPARATOR_PLAYERS,
  TIME_DNF
} from '../constants';
import { Category, Coord, Validation } from '../types';
import { REGEX_TIME } from './regEx';
import { uniq } from 'lodash';

const getMimeType = (extension: string) => {
  if (!extension) return MIME_JPEG;

  const isPng = extension.toLowerCase() === 'png';

  return isPng ? MIME_PNG : MIME_JPEG;
};

const formatCpuPlayers = (cpuPlayers: string[]) => {
  if (!cpuPlayers || cpuPlayers.length === 0) return '';

  return cpuPlayers
    .filter((s: string) => !!s)
    .sort()
    .join(SEPARATOR_PLAYERS);
};

const getPlayers = (players: string) => {
  if (!players) return [];

  return players.split(SEPARATOR_PLAYERS).filter((s: string) => !!s);
};

const isHumanPlayer = (player: string, humanPlayers: string) => {
  if (!humanPlayers) return false;

  const humanPlayersSplit = getPlayers(humanPlayers);

  return humanPlayersSplit.includes(player);
};

const getReferencePlayers = (humanPlayers: string, cpuPlayers: string, includeCpuPlayers: boolean) => {
  if (!humanPlayers) return [];

  const humanPlayersSplit = getPlayers(humanPlayers);

  if (!includeCpuPlayers || !cpuPlayers) return humanPlayersSplit;

  const cpuPlayersSplit = getPlayers(cpuPlayers);

  return [...humanPlayersSplit, ...cpuPlayersSplit];
};

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

  const milliseconds = centiseconds * 10 + seconds * 1_000 + minutes * 60 * 1_000;

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

// TODO: for All, index is actually the number of players
const getExtract = (info: any, index = 0, category: Category) => {
  const { width, height } = info;
  const left = applyRatio(0.64, width);
  const top = applyRatio(0.265, height);
  const widthCrop = applyRatio(0.27, width);
  const heightCrop = applyRatio(0.425, height);

  if (category === Category.All) {
    const ratioHeight = index / CTR_MAX_PLAYERS;
    const extract: Coord = {
      height: applyRatio(ratioHeight, heightCrop),
      left,
      top,
      width: widthCrop
    };

    return extract;
  }

  const ratioTime = 0.73;
  const ratioEnd = 0.03;
  const ratioLeftOffsetName = 0.27;
  const ratioEndPosition = 0.1;
  const antiRatioTime = 1 - ratioTime - ratioEnd;

  const rectangle = {
    top: applyRatio(index / 8, heightCrop),
    height: applyRatio(1 / 8, heightCrop)
  };

  const topExt = top + rectangle.top;
  const heightExt = rectangle.height;

  if (category === Category.Position) {
    const extract: Coord = {
      height: heightExt,
      left: left,
      top: topExt,
      width: applyRatio(ratioEndPosition, widthCrop)
    };

    return extract;
  }

  const leftExtTime = left + applyRatio(ratioTime, widthCrop);
  const widthExtTime = applyRatio(antiRatioTime, widthCrop);

  const leftExtName = left + applyRatio(ratioLeftOffsetName, widthCrop);
  const widthExtName = applyRatio(1 - antiRatioTime - ratioLeftOffsetName - ratioEnd, widthCrop);

  const isTime = category === Category.Time;
  const leftExt = isTime ? leftExtTime : leftExtName;
  const widthExt = isTime ? widthExtTime : widthExtName;

  const extract: Coord = {
    height: heightExt,
    left: leftExt,
    top: topExt,
    width: widthExt
  };

  return extract;
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

const validateUsernames = (usernames: string[]) => {
  const validation: Validation = {
    correct: false,
    errMsg: ''
  };

  const empty = usernames.some((str: string) => !str);
  if (empty) {
    validation.errMsg = 'At least one username is missing';

    return validation;
  }

  const uniqueUsernames = uniq(usernames);
  if (uniqueUsernames.length !== usernames.length) {
    validation.errMsg = 'At least one username is duplicated';

    return validation;
  }

  validation.correct = true;
  return validation;
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
    if (diffTime > CTR_MAX_TIME_DIFF_SEC * 1_000) {
      validation.errMsg = `There are more than ${CTR_MAX_TIME_DIFF_SEC} seconds separating players`;

      return validation;
    }
  }

  validation.correct = true;
  return validation;
};

const logTime = (label: string, end = false) => {
  if (!LOG_CONSOLE) return;

  if (end) {
    console.timeEnd(label);
  } else {
    console.time(label);
  }
};

const logError = (err: any) => {
  if (!LOG_CONSOLE) return;

  console.log(err);
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

const getFilenameWithoutExtension = (filename: string) => {
  if (!filename) return '';

  const splits = filename.split('.');

  return splits[0];
};

const sortImagesByFilename = (images: any[]) => {
  if (images.length === 0) return [];
  if (images.length === 1) return images;

  const sortedImages = images.sort((imageA: any, imageB: any) => {
    const { name: nameA } = imageA;
    const { name: nameB } = imageB;

    const newNameA = getFilenameWithoutExtension(nameA);
    const newNameB = getFilenameWithoutExtension(nameB);

    return sortAlphanumeric(newNameA, newNameB);
  });

  return sortedImages;
};

export {
  applyRatio,
  charRange,
  cleanString,
  convertToMs,
  formatCpuPlayers,
  getFilenameWithoutExtension,
  getMimeType,
  getPlayers,
  getReferencePlayers,
  getCloserString,
  getExtract,
  getParams,
  isHumanPlayer,
  logError,
  logTime,
  numberRange,
  positionIsValid,
  sortAlphanumeric,
  sortImagesByFilename,
  validateTimes,
  validateUsernames
};
