import { isEqual } from '../array';

test('isEqual', () => {
  expect(isEqual([], [])).toBe(true);
  expect(isEqual([1], [1])).toBe(true);
  expect(isEqual(['bonjour'], ['bonjour'])).toBe(true);
  expect(isEqual(['bonjour', 'bonsoir', 'rebonsoir'], ['bonjour', 'bonsoir', 'rebonsoir'])).toBe(true);
  expect(isEqual(['bonjour'], [1])).toBe(false);
  expect(isEqual([1, 2], [2, 1])).toBe(false);
  expect(isEqual(['bonjour'], ['bonjour', 'bonsoir'])).toBe(false);
});
