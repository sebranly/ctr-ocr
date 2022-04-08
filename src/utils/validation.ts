import { uniq } from 'lodash';
import { convertToMs } from './index';
import { CTR_MAX_TIME_DIFF_SEC, TIME_DNF } from '../constants';
import { Result, Validation } from '../types';
import { REGEX_TIME } from './regEx';
import { isEqual } from './array';

const getIncorrectRaces = (resultsOcr: Result[][]) => {
  const validationPoints = resultsOcr.map((race: Result[]) => validatePoints(race.map((race) => race.points)));
  const validationUsernames = resultsOcr.map((race: Result[]) => validateUsernames(race.map((race) => race.username)));

  const incorrectRaces: number[] = [];

  validationPoints.forEach((validation: Validation, index: number) => {
    if (!validation.correct) incorrectRaces.push(index + 1);
  });

  validationUsernames.forEach((validation: Validation, index: number) => {
    if (!validation.correct && !incorrectRaces.includes(index + 1)) incorrectRaces.push(index + 1);
  });

  return incorrectRaces.sort();
};

const validatePoints = (points: number[]) => {
  const validation: Validation = {
    correct: false,
    errMsg: ''
  };

  const copyPoints = [...points];

  const sortedPoints = copyPoints.sort((a: number, b: number) => {
    return b - a;
  });

  if (isEqual(sortedPoints, points)) {
    validation.correct = true;

    return validation;
  }

  validation.errMsg = 'Points should decrease from first to last place (ties are possible)';

  return validation;
};

const validateTeams = (players: string[], teams: string[], playerTeams: Record<string, string>) => {
  const validation: Validation = {
    correct: false,
    errMsg: ''
  };

  const missingTeamForPlayers: string[] = [];
  const incorrectTeamForPlayers: string[] = [];
  const seenTeams: string[] = [];

  players.forEach((player: string) => {
    const team = playerTeams[player];
    if (!team) {
      missingTeamForPlayers.push(player);
    }

    if (!teams.includes(team)) {
      incorrectTeamForPlayers.push(player);
    }

    if (teams.includes(team)) {
      seenTeams.push(team);
    }
  });

  if (missingTeamForPlayers.length > 0) {
    validation.errMsg = `The following players have no assigned team: ${missingTeamForPlayers.join(', ')}`;
    validation.isWarning = true;

    return validation;
  }

  if (incorrectTeamForPlayers.length > 0) {
    validation.errMsg = `The following players have an invalid team: ${incorrectTeamForPlayers.join(', ')}`;

    return validation;
  }

  if (uniq(seenTeams).length === 1) {
    validation.errMsg = 'You cannot have all players under the same team';

    return validation;
  }

  validation.correct = true;
  return validation;
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

  if (!isEqual(finishedTimesMs, sortedTimesMs)) {
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

export { getIncorrectRaces, validatePoints, validateTeams, validateTimes, validateUsernames };
