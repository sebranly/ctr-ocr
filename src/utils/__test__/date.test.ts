import { formatDate } from '../date';

test('formatDate', () => {
  expect(formatDate(1649496818927)).toBe('2022-04-09');
  expect(formatDate(1669496818927)).toBe('2022-11-26');
});
