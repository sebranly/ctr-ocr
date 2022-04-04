import { getCharListPosition, getCharListDigits, getCharListTime, getCharListUsername } from '../charList';

test('getCharListPosition', () => {
  expect(getCharListPosition()).toBe('12345678');
});

test('getCharListDigits', () => {
  expect(getCharListDigits()).toBe('0123456789');
});

test('getCharListTime', () => {
  expect(getCharListTime()).toBe('0123456789:-');
});

test('getCharListUsername', () => {
  expect(getCharListUsername()).toBe('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-_. ');
});
