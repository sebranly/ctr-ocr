import { applyRatio, numberRange } from '../number';

test('numberRange', () => {
  expect(numberRange(0, 3)).toStrictEqual([0, 1, 2, 3]);
  expect(numberRange(1, 8)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});

test('applyRatio', () => {
  expect(applyRatio(1, 1)).toBe(1);
  expect(applyRatio(1.1, 1)).toBe(1);
  expect(applyRatio(1.49, 1)).toBe(1);
  expect(applyRatio(1.5, 1)).toBe(1);
  expect(applyRatio(1.7, 1)).toBe(1);
  expect(applyRatio(1.9, 1)).toBe(1);
  expect(applyRatio(2, 1)).toBe(2);
  expect(applyRatio(2.1, 1.5)).toBe(3);
  expect(applyRatio(2.1, 2)).toBe(4);
});
