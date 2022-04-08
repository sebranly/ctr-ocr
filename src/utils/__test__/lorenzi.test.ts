import { Result } from '../../types';
import { createLorenziFFA } from '../lorenzi';

test('createLorenziFFA', () => {
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

  expect(createLorenziFFA(races)).toStrictEqual(['Title', '', 'a 10|4|3', 'b 9|5|2', 'c 8|3|0']);
});
