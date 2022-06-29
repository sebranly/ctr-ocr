import { PSM_SINGLE_CHAR, PSM_SINGLE_LINE } from '../constants';
import { Category } from '../types';
import { REGEX_TIME } from './regEx';
import { uniq } from 'lodash';
import { getCharListFromUsernames, getCharListPosition, getCharListTime } from './charList';
import { numberRange } from './number';

const formatCpuPlayers = (cpuPlayers: string[]) => {
  if (!cpuPlayers || cpuPlayers.length === 0) return [];

  return cpuPlayers.filter((s: string) => !!s).sort();
};

const getPlayers = (players: string[]) => {
  if (players.length === 0) return [];

  return players.filter((s: string) => !!s);
};

const isHumanPlayer = (player: string, humanPlayers: string[]) => {
  const newHumanPlayers = getPlayers(humanPlayers);

  if (newHumanPlayers.length === 0) return false;

  return newHumanPlayers.includes(player);
};

const getReferencePlayers = (humanPlayers: string[], cpuPlayers: string[], includeCpuPlayers: boolean) => {
  const newHumanPlayers = getPlayers(humanPlayers);

  if (newHumanPlayers.length === 0) return [];

  if (!includeCpuPlayers) return newHumanPlayers;

  const newCpuPlayers = getPlayers(cpuPlayers);

  if (newCpuPlayers.length === 0) return newHumanPlayers;

  return [...newHumanPlayers, ...newCpuPlayers];
};

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

const getOptionsTeams = (nbPlayers: number) => {
  if ([0, 1, 2].includes(nbPlayers)) return [nbPlayers];

  const teams = uniq([nbPlayers, ...numberRange(2, nbPlayers - 1).sort((a, b) => a - b)]);

  return teams;
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

const getParams = (category: Category, players: string[], cpuPlayers: string[], includeCpuPlayers: boolean) => {
  const { Position, Time, Username } = Category;
  const charList = getCharListFromUsernames(players, cpuPlayers, includeCpuPlayers);

  switch (category) {
    case Position:
      return {
        tessedit_char_whitelist: getCharListPosition(),
        tessedit_pageseg_mode: PSM_SINGLE_CHAR as any
      };

    case Username:
      return {
        tessedit_char_whitelist: charList,
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

const getColorHexadecimalTeam = (teamIndex: number) => {
  switch (teamIndex) {
    case 0:
      return '#33CCFF';
    case 1:
      return '#FF4040';
    case 2:
      return '#008000';
    case 3:
      return '#FFA500';
    case 4:
      return '#6A0DAD';
    case 5:
      return '#964B00';
    case 6:
      return '#808080';
    default:
      // As it's used as a background, we use opposite of black here
      return '#FFFFFF';
  }
};

export {
  convertToMs,
  formatCpuPlayers,
  getOptionsTeams,
  getPlayers,
  getReferencePlayers,
  getTeamNames,
  getColorHexadecimalTeam,
  getColorPlayer,
  getPositionString,
  getParams,
  isHumanPlayer,
  positionIsValid
};
