import levenshtein from 'fast-levenshtein';
import {
  CTR_MAX_PLAYERS,
  LOG_CONSOLE,
  MIME_JPEG,
  MIME_PNG,
  PSM_SINGLE_CHAR,
  PSM_SINGLE_LINE,
  SEPARATOR_PLAYERS
} from '../constants';
import { Category, Coord } from '../types';
import { REGEX_TIME } from './regEx';
import { uniq } from 'lodash';
import { getCharListPosition, getCharListTime, getCharListUsername } from './charList';

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

const cleanString = (str: string) => str.replaceAll('\n', '').replaceAll(' ', '');

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

const getOptionsTeams = (nbPlayers: number) => {
  if ([0, 1, 2].includes(nbPlayers)) return [nbPlayers];

  const teams = uniq([nbPlayers, ...numberRange(2, nbPlayers - 1).sort()]);

  return teams;
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

const getPositionString = (position: number) => {
  if (position < 1) return `${position}`;

  if ([11, 12, 13].includes(position)) return `${position}th`;

  const lastDigit = position % 10;

  if (lastDigit === 1) return `${position}st`;
  if (lastDigit === 2) return `${position}nd`;
  if (lastDigit === 3) return `${position}rd`;

  return `${position}th`;
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
        tessedit_char_whitelist: getCharListPosition(),
        tessedit_pageseg_mode: PSM_SINGLE_CHAR as any
      };

    case Username:
      return {
        tessedit_char_whitelist: getCharListUsername(),
        tessedit_pageseg_mode: PSM_SINGLE_LINE as any
      };

    case Time:
    default:
      return {
        tessedit_char_whitelist: getCharListTime(),
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

const getTeamNames = (nbTeams: number) => {
  if (nbTeams === 0) return [];

  return numberRange(1, nbTeams).map((n: number) => `Team ${n}`);
};

const getColorPlayer = (player: string, teams: string[], playerTeams: Record<string, string>) => {
  const playerTeam = playerTeams[player];

  if (!playerTeam) return 'black';

  const index = teams.indexOf(playerTeam);

  switch (index) {
    case 0:
      return 'blue';
    case 1:
      return 'red';
    case 2:
      return 'green';
    case 3:
      return 'orange';
    case 4:
      return 'purple';
    case 5:
      return 'brown';
    case 6:
      return 'grey';
    default:
      return 'black';
  }
};

const sortCaseInsensitive = (a: string, b: string) => {
  if (!a || !b) return 1;
  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();

  if (lowerA === lowerB) return 0;

  return lowerA > lowerB ? 1 : -1;
};

export {
  applyRatio,
  charRange,
  cleanString,
  convertToMs,
  formatCpuPlayers,
  getFilenameWithoutExtension,
  getMimeType,
  getOptionsTeams,
  getPlayers,
  getReferencePlayers,
  getTeamNames,
  getColorPlayer,
  getCloserString,
  getPositionString,
  getExtract,
  getParams,
  isHumanPlayer,
  logError,
  logTime,
  numberRange,
  positionIsValid,
  sortAlphanumeric,
  sortImagesByFilename,
  sortCaseInsensitive
};
