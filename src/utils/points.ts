const getPointsScheme = (nbPlayers: number, nbTeams: number, isRanked: boolean, isDoubleRush: boolean) => {
  const isFFA = nbTeams === nbPlayers;

  /**
   * Technically speaking, that could be a 1v3 for instance
   * But score presets are a suggestion anyway
   */

  const isDuo = nbTeams === nbPlayers / 2;
  const isTrio = nbTeams === nbPlayers / 3;
  const isQuatuor = nbTeams === nbPlayers / 4;

  if (isDoubleRush) return [14, 12, 11, 9, 4, 3, 2, 1].slice(0, nbPlayers);

  if (isRanked) {
    if (isFFA) {
      switch (nbPlayers) {
        case 0:
          return [];
        case 1:
          return [0];
        case 2:
          return [3, 1];
        case 3:
          return [4, 2, 1];
        case 4:
          return [5, 3, 2, 1];
        case 5:
          return [6, 5, 3, 2, 1];
        case 6:
          return [7, 6, 5, 3, 2, 1];
        case 7:
          return [8, 7, 6, 4, 3, 2, 1];
        case 8:
          return [9, 8, 7, 5, 4, 3, 2, 1];
      }
    } else if (isDuo) {
      if (nbPlayers === 8) return [8, 7, 6, 5, 4, 3, 2, 1];
      if (nbPlayers === 6) return [6, 5, 4, 3, 2, 1];
      if (nbPlayers === 4) return [4, 3, 2, 1];
    } else if (isTrio && nbPlayers === 6) {
      return [6, 5, 4, 3, 2, 1];
    } else if (isQuatuor && nbPlayers === 8) {
      return [10, 8, 6, 5, 4, 3, 2, 1];
    }

    return [9, 8, 7, 5, 4, 3, 2, 1].slice(0, nbPlayers);
  }

  if (isFFA) {
    return [10, 8, 7, 5, 4, 3, 2, 1].slice(0, nbPlayers);
  } else {
    if (nbPlayers === 4) return [5, 3, 2, 1];

    return [10, 8, 6, 5, 4, 3, 2, 1].slice(0, nbPlayers);
  }
};

export { getPointsScheme };
