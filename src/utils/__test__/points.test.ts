import { getAbsolutePointsScheme } from '../points';

test('getAbsolutePointsScheme', () => {
  expect(getAbsolutePointsScheme(8, 8, true, false)).toStrictEqual([9, 8, 7, 5, 4, 3, 2, 1]);
  expect(getAbsolutePointsScheme(7, 7, true, false)).toStrictEqual([8, 7, 6, 4, 3, 2, 1, 0]);
  expect(getAbsolutePointsScheme(6, 6, true, false)).toStrictEqual([7, 6, 5, 3, 2, 1, 0, 0]);
  expect(getAbsolutePointsScheme(5, 5, true, false)).toStrictEqual([6, 5, 3, 2, 1, 0, 0, 0]);
  expect(getAbsolutePointsScheme(4, 4, true, false)).toStrictEqual([5, 3, 2, 1, 0, 0, 0, 0]);
  expect(getAbsolutePointsScheme(3, 3, true, false)).toStrictEqual([4, 2, 1, 0, 0, 0, 0, 0]);
  expect(getAbsolutePointsScheme(2, 2, true, false)).toStrictEqual([3, 1, 0, 0, 0, 0, 0, 0]);
  expect(getAbsolutePointsScheme(1, 1, true, false)).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  expect(getAbsolutePointsScheme(0, 0, true, false)).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  expect(getAbsolutePointsScheme(8, 4, true, false)).toStrictEqual([8, 7, 6, 5, 4, 3, 2, 1]);
  expect(getAbsolutePointsScheme(6, 3, true, false)).toStrictEqual([6, 5, 4, 3, 2, 1, 0, 0]);
  expect(getAbsolutePointsScheme(4, 2, true, false)).toStrictEqual([4, 3, 2, 1, 0, 0, 0, 0]);
  expect(getAbsolutePointsScheme(6, 2, true, false)).toStrictEqual([6, 5, 4, 3, 2, 1, 0, 0]);
  expect(getAbsolutePointsScheme(7, 2, true, false)).toStrictEqual([9, 8, 7, 5, 4, 3, 2, 0]);
  expect(getAbsolutePointsScheme(8, 2, true, false)).toStrictEqual([10, 8, 6, 5, 4, 3, 2, 1]);

  expect(getAbsolutePointsScheme(8, 8, false, false)).toStrictEqual([10, 8, 7, 5, 4, 3, 2, 1]);
  expect(getAbsolutePointsScheme(5, 5, false, false)).toStrictEqual([10, 8, 7, 5, 4, 0, 0, 0]);
  expect(getAbsolutePointsScheme(4, 2, false, false)).toStrictEqual([5, 3, 2, 1, 0, 0, 0, 0]);
  expect(getAbsolutePointsScheme(8, 2, false, false)).toStrictEqual([10, 8, 6, 5, 4, 3, 2, 1]);
  expect(getAbsolutePointsScheme(6, 3, false, false)).toStrictEqual([10, 8, 6, 5, 4, 3, 0, 0]);

  expect(getAbsolutePointsScheme(8, 4, false, true)).toStrictEqual([14, 12, 11, 9, 4, 3, 2, 1]);
  expect(getAbsolutePointsScheme(4, 2, false, true)).toStrictEqual([14, 12, 11, 9, 0, 0, 0, 0]);
});
