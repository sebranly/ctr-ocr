import { CTR_MAX_PLAYERS } from '../constants';
import { createArraySameValue } from './array';

const getPointsScheme = (nbPlayers: number, nbTeams: number, isRanked: boolean, isDoubleRush: boolean) => {
  const pointsScheme: number[] = [];
  const isFFA = nbTeams === nbPlayers;

  /**
   * Technically speaking, that could be a 1v3 for instance
   * But score presets are a suggestion anyway
   */
  const isDuo = nbTeams === nbPlayers / 2;
  const isTrio = nbTeams === nbPlayers / 3;
  const isQuatuor = nbTeams === nbPlayers / 4;

  if (isDoubleRush) pointsScheme.push(...[14, 12, 11, 9, 4, 3, 2, 1]);
  else if (isRanked) {
    if (isFFA) {
      switch (nbPlayers) {
        case 0:
          pointsScheme.push(...([] as number[]));
          break;
        case 1:
          pointsScheme.push(...[0]);
          break;
        case 2:
          pointsScheme.push(...[3, 1]);
          break;
        case 3:
          pointsScheme.push(...[4, 2, 1]);
          break;
        case 4:
          pointsScheme.push(...[5, 3, 2, 1]);
          break;
        case 5:
          pointsScheme.push(...[6, 5, 3, 2, 1]);
          break;
        case 6:
          pointsScheme.push(...[7, 6, 5, 3, 2, 1]);
          break;
        case 7:
          pointsScheme.push(...[8, 7, 6, 4, 3, 2, 1]);
          break;
        case 8:
          pointsScheme.push(...[9, 8, 7, 5, 4, 3, 2, 1]);
          break;
      }
    } else if (isDuo) {
      if (nbPlayers === 8) pointsScheme.push(...[8, 7, 6, 5, 4, 3, 2, 1]);
      else if (nbPlayers === 6) pointsScheme.push(...[6, 5, 4, 3, 2, 1]);
      else if (nbPlayers === 4) pointsScheme.push(...[4, 3, 2, 1]);
    } else if (isTrio && nbPlayers === 6) {
      pointsScheme.push(...[6, 5, 4, 3, 2, 1]);
    } else if (isQuatuor && nbPlayers === 8) {
      pointsScheme.push(...[10, 8, 6, 5, 4, 3, 2, 1]);
    } else {
      pointsScheme.push(...[9, 8, 7, 5, 4, 3, 2, 1]);
    }
  } else if (isFFA) {
    pointsScheme.push(...[10, 8, 7, 5, 4, 3, 2, 1]);
  } else {
    if (nbPlayers === 4) pointsScheme.push(...[5, 3, 2, 1]);
    else pointsScheme.push(...[10, 8, 6, 5, 4, 3, 2, 1]);
  }

  const slicedPointsScheme = pointsScheme.slice(0, nbPlayers);
  const lengthDiff = CTR_MAX_PLAYERS - slicedPointsScheme.length;
  if (lengthDiff < 0) return slicedPointsScheme;
  else if (lengthDiff === 0) return slicedPointsScheme;
  else {
    const remaining = createArraySameValue(lengthDiff, 0) as number[];
    return [...slicedPointsScheme, ...remaining];
  }
};

export { getPointsScheme };
