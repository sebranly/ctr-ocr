import { Result, Validation } from '../../types';
import { getIncorrectRaces, validatePoints, validateTeams, validateTimes, validateUsernames } from '../validation';

const correctResponse: Validation = {
  correct: true,
  errMsg: ''
};

test('getIncorrectRaces', () => {
  const correctRaces: Result[][] = [
    [
      { username: 'a', position: 1, points: 10 },
      { username: 'b', position: 2, points: 8 }
    ],
    [
      { username: 'b', position: 1, points: 10 },
      { username: 'a', position: 2, points: 8 }
    ]
  ];

  expect(getIncorrectRaces(correctRaces)).toStrictEqual([]);

  const incorrectRacesPoints: Result[][] = [
    [
      { username: 'a', position: 1, points: 7 },
      { username: 'b', position: 2, points: 8 }
    ],
    [
      { username: 'b', position: 1, points: 10 },
      { username: 'a', position: 2, points: 8 }
    ]
  ];

  expect(getIncorrectRaces(incorrectRacesPoints)).toStrictEqual([1]);

  const incorrectRacesUsernames: Result[][] = [
    [
      { username: 'a', position: 1, points: 10 },
      { username: 'b', position: 2, points: 8 }
    ],
    [
      { username: 'b', position: 1, points: 10 },
      { username: 'b', position: 2, points: 8 }
    ]
  ];

  expect(getIncorrectRaces(incorrectRacesUsernames)).toStrictEqual([2]);

  const incorrectRacesAll: Result[][] = [
    [
      { username: 'a', position: 1, points: 10 },
      { username: 'a', position: 2, points: 11 }
    ],
    [
      { username: 'b', position: 1, points: 10 },
      { username: 'b', position: 2, points: 11 }
    ]
  ];

  expect(getIncorrectRaces(incorrectRacesAll)).toStrictEqual([1, 2]);
});

test('validatePoints', () => {
  const incorrectResponse: Validation = {
    correct: false,
    errMsg: 'From best to worst player, points should be decreasing (equal values are permitted)'
  };

  expect(validatePoints([42])).toStrictEqual(correctResponse);
  expect(validatePoints([42, 1])).toStrictEqual(correctResponse);
  expect(validatePoints([42, 42, 42, 42])).toStrictEqual(correctResponse);
  expect(validatePoints([42, 41, 40, 39])).toStrictEqual(correctResponse);
  expect(validatePoints([42, 41, 41, 39])).toStrictEqual(correctResponse);
  expect(validatePoints([10, 0])).toStrictEqual(correctResponse);
  expect(validatePoints([1, 2, 3])).toStrictEqual(incorrectResponse);
  expect(validatePoints([1, 42])).toStrictEqual(incorrectResponse);
});

test('validateUsernames', () => {
  const missingUsernameResponse = {
    correct: false,
    errMsg: 'At least one username is missing'
  };

  const duplicatedUsernameResponse = {
    correct: false,
    errMsg: 'At least one username is duplicated'
  };

  expect(validateUsernames([])).toStrictEqual(correctResponse);
  expect(validateUsernames([''])).toStrictEqual(missingUsernameResponse);
  expect(validateUsernames(['', 'bonjour'])).toStrictEqual(missingUsernameResponse);
  expect(validateUsernames(['', ''])).toStrictEqual(missingUsernameResponse);
  expect(validateUsernames(['bonjour', 'bonjour'])).toStrictEqual(duplicatedUsernameResponse);
  expect(validateUsernames(['bonjour', 'bonsoir', 'bonjour'])).toStrictEqual(duplicatedUsernameResponse);
  expect(validateUsernames(['bonjour', 'bonsoir'])).toStrictEqual(correctResponse);
});

test('validateTeams', () => {
  expect(validateTeams(['a', 'b'], ['t1', 't2'], { a: 't1', b: 't2' })).toStrictEqual(correctResponse);
  expect(validateTeams(['a', 'b', 'c'], ['t1', 't2'], { c: 't1' })).toStrictEqual({
    correct: false,
    isWarning: true,
    errMsg: 'The following players have no assigned team: a, b'
  });

  expect(validateTeams(['a', 'b', 'c'], ['t1', 't2'], { a: 't3', b: 't4', c: 't1' })).toStrictEqual({
    correct: false,
    errMsg: 'The following players have an invalid team: a, b'
  });

  expect(validateTeams(['a', 'b'], ['t1', 't2'], { a: 't1', b: 't1' })).toStrictEqual({
    correct: false,
    errMsg: 'You cannot have all players under the same team'
  });
});

test('validateTimes', () => {
  expect(validateTimes(['Bonjour'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions have incorrect formatted times: 1'
  });

  expect(validateTimes(['12:73:10'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions have incorrect formatted times: 1'
  });

  expect(validateTimes(['--:--:--'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:40'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:40', '--:--:--'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:40', '12:03:50'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:40', '--:--:--', '12:03:50'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions finished after somebody that did not finish: 3'
  });

  expect(validateTimes(['--:--:--', '12:03:40'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions finished after somebody that did not finish: 2'
  });

  expect(validateTimes(['--:--:--', '12:03:40', '12:03:50'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions finished after somebody that did not finish: 2, 3'
  });

  expect(validateTimes(['12:03:40', '12:03:50', '--:--:--'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:50', '12:03:40', '--:--:--'])).toStrictEqual({
    correct: false,
    errMsg: 'From position 1 to position 2, times are not in chronological order'
  });

  expect(validateTimes(['12:03:40', '12:33:40', '--:--:--'])).toStrictEqual(correctResponse);

  expect(validateTimes(['12:03:40', '12:33:41', '--:--:--'])).toStrictEqual({
    correct: false,
    errMsg: 'There are more than 30 seconds separating players'
  });

  const correctTimes = ['3:11:36', '3:12:59', '3:19:66', '3:20:83', '3:25:20', '3:29:61', '3:32:65', '3:36:95'];

  expect(validateTimes(correctTimes)).toStrictEqual(correctResponse);
});
