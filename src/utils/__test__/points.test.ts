import { getPointsScheme } from '../points';

test('getPointsScheme', () => {
  expect(getPointsScheme(8, 8, false, false)).toStrictEqual([10, 8, 7, 5, 4, 3, 2, 1]);
});
