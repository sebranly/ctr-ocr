import { LorenziTeam, Result } from '../../types';
import {
  createLorenzi,
  createLorenziFFA,
  createLorenziIntro,
  createLorenziPlayersPoints,
  createLorenziTeams,
  getInitialLorenziTeams
} from '../lorenzi';

const lorenziTeams2: LorenziTeam[] = [
  { name: 'First team', color: '#aaaaaa' },
  { name: 'Second team', color: '#bbbbbb' }
];
const lorenziTeams4: LorenziTeam[] = [
  ...lorenziTeams2,
  { name: 'Third team', color: '#cccccc' },
  { name: 'Fourth team', color: '#dddddd' }
];

const races: Result[][] = [
  [
    { username: 'a', position: 1, points: 10 },
    { username: 'b', position: 2, points: 9 },
    { username: 'c', position: 3, points: 8 }
  ],
  [
    { username: 'b', position: 1, points: 5 },
    { username: 'a', position: 2, points: 4 },
    { username: 'c', position: 3, points: 3 }
  ],
  [
    { username: 'a', position: 1, points: 3 },
    { username: 'b', position: 2, points: 2 }
  ]
];

const race8P: Result[][] = [
  [
    { username: 'a', position: 1, points: 20 },
    { username: 'b', position: 2, points: 19 },
    { username: 'c', position: 3, points: 18 },
    { username: 'd', position: 4, points: 17 },
    { username: 'e', position: 5, points: 16 },
    { username: 'f', position: 6, points: 15 },
    { username: 'g', position: 7, points: 14 },
    { username: 'h', position: 8, points: 13 }
  ],
  [
    { username: 'h', position: 1, points: 12 },
    { username: 'g', position: 2, points: 11 },
    { username: 'f', position: 3, points: 10 },
    { username: 'e', position: 4, points: 9 },
    { username: 'd', position: 5, points: 8 },
    { username: 'c', position: 6, points: 7 },
    { username: 'b', position: 7, points: 6 },
    { username: 'a', position: 8, points: 5 }
  ]
];

const wrongRace8P: Result[][] = [
  [
    { username: 'a', position: 1, points: 20 },
    { username: 'a', position: 2, points: 19 },
    { username: 'a', position: 3, points: 18 },
    { username: 'a', position: 4, points: 17 },
    { username: 'a', position: 5, points: 16 },
    { username: 'a', position: 6, points: 15 },
    { username: 'a', position: 7, points: 14 },
    { username: 'a', position: 8, points: 13 }
  ]
];

const playerTeams4v4 = {
  a: 'Team 1',
  b: 'Team 1',
  c: 'Team 2',
  d: 'Team 2',
  e: 'Team 2',
  f: 'Team 2',
  g: 'Team 1',
  h: 'Team 1'
};

const playerTeamsDuo = {
  a: 'Team 1',
  b: 'Team 3',
  c: 'Team 2',
  d: 'Team 4',
  e: 'Team 2',
  f: 'Team 3',
  g: 'Team 4',
  h: 'Team 1'
};

test('getInitialLorenziTeams', () => {
  expect(getInitialLorenziTeams(0)).toStrictEqual([]);
  expect(getInitialLorenziTeams(1)).toStrictEqual([{ name: 'Team 1', color: '#33CCFF' }]);
  expect(getInitialLorenziTeams(8)).toStrictEqual([
    { name: 'Team 1', color: '#33CCFF' },
    { name: 'Team 2', color: '#FF4040' },
    { name: 'Team 3', color: '#008000' },
    { name: 'Team 4', color: '#FFA500' },
    { name: 'Team 5', color: '#6A0DAD' },
    { name: 'Team 6', color: '#964B00' },
    { name: 'Team 7', color: '#808080' },
    { name: 'Team 8', color: '#FFFFFF' }
  ]);
});

test('createLorenzi', () => {
  let results: string[];

  results = createLorenzi(
    races,
    { a: 'Team 1', b: 'Team 1', c: 'Team 2' },
    2,
    3,
    ['Team 1', 'Team 2'],
    true,
    lorenziTeams2
  );
  const [title, date, emptyLine, ...rest] = results;

  expect(title).toBe('#title Title');
  expect(date.startsWith('#date 20')).toBe(true);
  expect(emptyLine).toBe('');
  expect(rest).toStrictEqual(['a 10|4|3', 'b 9|5|2', 'c 8|3|0']);

  results = createLorenzi(races, {}, 3, 3, [], false, []);
  const [titleBis, dateBis, emptyLineBis, ...restBis] = results;

  expect(titleBis).toBe('#title Title');
  expect(dateBis.startsWith('#date 20')).toBe(true);
  expect(emptyLineBis).toBe('');
  expect(restBis).toStrictEqual(['a 10|4|3', 'b 9|5|2', 'c 8|3|0']);

  results = createLorenzi(race8P, playerTeams4v4, 2, 8, ['Team 1', 'Team 2'], false, lorenziTeams2);
  const [titleQuatuor, dateQuatuor, emptyLineQuatuor, ...restQuatuor] = results;

  expect(titleQuatuor).toBe('#title Title');
  expect(dateQuatuor.startsWith('#date 20')).toBe(true);
  expect(emptyLineQuatuor).toBe('');
  expect(restQuatuor).toStrictEqual([
    'First team #aaaaaa',
    'a 20|5',
    'b 19|6',
    'g 14|11',
    'h 13|12',
    '',
    'Second team #bbbbbb',
    'c 18|7',
    'd 17|8',
    'e 16|9',
    'f 15|10',
    ''
  ]);

  results = createLorenzi(race8P, playerTeamsDuo, 4, 8, ['Team 1', 'Team 2', 'Team 3', 'Team 4'], false, lorenziTeams4);
  const [titleDuo, dateDuo, emptyLineDuo, ...restDuo] = results;

  expect(titleDuo).toBe('#title Title');
  expect(dateDuo.startsWith('#date 20')).toBe(true);
  expect(emptyLineDuo).toBe('');
  expect(restDuo).toStrictEqual([
    'First team #aaaaaa',
    'a 20|5',
    'h 13|12',
    '',
    'Second team #bbbbbb',
    'c 18|7',
    'e 16|9',
    '',
    'Third team #cccccc',
    'b 19|6',
    'f 15|10',
    '',
    'Fourth team #dddddd',
    'd 17|8',
    'g 14|11',
    ''
  ]);
});

test('createLorenziTeams', () => {
  let results = createLorenziTeams(race8P, playerTeams4v4, ['Team 1', 'Team 2'], lorenziTeams2);
  const [titleQuatuor, dateQuatuor, emptyLineQuatuor, ...restQuatuor] = results;

  expect(titleQuatuor).toBe('#title Title');
  expect(dateQuatuor.startsWith('#date 20')).toBe(true);
  expect(emptyLineQuatuor).toBe('');
  expect(restQuatuor).toStrictEqual([
    'First team #aaaaaa',
    'a 20|5',
    'b 19|6',
    'g 14|11',
    'h 13|12',
    '',
    'Second team #bbbbbb',
    'c 18|7',
    'd 17|8',
    'e 16|9',
    'f 15|10',
    ''
  ]);

  results = createLorenziTeams(race8P, playerTeamsDuo, ['Team 1', 'Team 2', 'Team 3', 'Team 4'], lorenziTeams4);
  const [titleDuo, dateDuo, emptyLineDuo, ...restDuo] = results;

  expect(titleDuo).toBe('#title Title');
  expect(dateDuo.startsWith('#date 20')).toBe(true);
  expect(emptyLineDuo).toBe('');
  expect(restDuo).toStrictEqual([
    'First team #aaaaaa',
    'a 20|5',
    'h 13|12',
    '',
    'Second team #bbbbbb',
    'c 18|7',
    'e 16|9',
    '',
    'Third team #cccccc',
    'b 19|6',
    'f 15|10',
    '',
    'Fourth team #dddddd',
    'd 17|8',
    'g 14|11',
    ''
  ]);

  // Unit test against join error due to any typing
  results = createLorenziTeams(wrongRace8P, playerTeamsDuo, ['Team 1', 'Team 2', 'Team 3', 'Team 4'], lorenziTeams4);
  expect(results).toHaveLength(19);
});

test('createLorenziFFA', () => {
  const results = createLorenziFFA(races);
  const [title, date, emptyLine, ...rest] = results;

  expect(title).toBe('#title Title');
  expect(date.startsWith('#date 20')).toBe(true);
  expect(emptyLine).toBe('');
  expect(rest).toStrictEqual(['a 10|4|3', 'b 9|5|2', 'c 8|3|0']);
});

test('createLorenziPlayersPoints', () => {
  expect(createLorenziPlayersPoints(races)).toStrictEqual({
    a: [10, 4, 3],
    b: [9, 5, 2],
    c: [8, 3, 0]
  });
});

test('createLorenziIntro', () => {
  const results = createLorenziIntro();
  expect(results).toHaveLength(2);
  expect(results[0]).toBe('#title Title');
  expect(results[1].startsWith('#date 20')).toBe(true);
});
