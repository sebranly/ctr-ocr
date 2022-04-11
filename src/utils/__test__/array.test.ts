import { createArraySameValue, isEqual } from '../array';

test('isEqual', () => {
  expect(isEqual([], [])).toBe(true);
  expect(isEqual([1], [1])).toBe(true);
  expect(isEqual(['bonjour'], ['bonjour'])).toBe(true);
  expect(isEqual(['bonjour', 'bonsoir', 'rebonsoir'], ['bonjour', 'bonsoir', 'rebonsoir'])).toBe(true);
  expect(isEqual(['bonjour'], [1])).toBe(false);
  expect(isEqual([1, 2], [2, 1])).toBe(false);
  expect(isEqual(['bonjour'], ['bonjour', 'bonsoir'])).toBe(false);
});

test('createArraySameValue', () => {
  expect(createArraySameValue(0, 'bonjour')).toStrictEqual([]);
  expect(createArraySameValue(1, 'bonjour')).toStrictEqual(['bonjour']);
  expect(createArraySameValue(3, 'bonjour')).toStrictEqual(['bonjour', 'bonjour', 'bonjour']);
  expect(createArraySameValue(3, 12)).toStrictEqual([12, 12, 12]);
});
