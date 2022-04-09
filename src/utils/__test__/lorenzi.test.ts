import { Result } from '../../types';
import { createLorenzi, createLorenziFFA, createLorenziIntro, createLorenziPlayersPoints } from '../lorenzi';

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

test('createLorenzi', () => {
  let results: string[];

  results = createLorenzi(races, { a: 'Team 1', b: 'Team 1', c: 'Team 2' }, 2, 3, ['Team 1', 'Team 2'], true);
  const [title, date, emptyLine, ...rest] = results;

  expect(title).toBe('#title Title');
  expect(date.startsWith('#date 20')).toBe(true);
  expect(emptyLine).toBe('');
  expect(rest).toStrictEqual(['a 10|4|3', 'b 9|5|2', 'c 8|3|0']);

  results = createLorenzi(races, {}, 3, 3, [], false);
  const [titleBis, dateBis, emptyLineBis, ...restBis] = results;

  expect(titleBis).toBe('#title Title');
  expect(dateBis.startsWith('#date 20')).toBe(true);
  expect(emptyLineBis).toBe('');
  expect(restBis).toStrictEqual(['a 10|4|3', 'b 9|5|2', 'c 8|3|0']);
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
