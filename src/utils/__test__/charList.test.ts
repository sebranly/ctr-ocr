import {
  getCharListPosition,
  getCharListDigits,
  getCharListTime,
  getCharListUsername,
  getCharListFromUsernames
} from '../charList';

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

test('getCharListFromUsernames', () => {
  expect(getCharListFromUsernames([], [], false)).toBe('');
  expect(getCharListFromUsernames([], [], true)).toBe('');
  expect(getCharListFromUsernames([], ['bonsoir'], false)).toBe('');
  expect(getCharListFromUsernames([], ['bonsoir'], true)).toBe('binors');
  expect(getCharListFromUsernames(['bonjour'], ['bonsoir'], false)).toBe('bjnoru');
  expect(getCharListFromUsernames(['bonjour'], ['bonsoir'], true)).toBe('bijnorsu');

  const results = getCharListFromUsernames(
    ['Schaox', 'Dent2reKin', 'WadaDim-PatroL', 'ZouGui28', 'Squall5701', 'Kyo-Bomba', 'RoddyLTV', 'Gozbe_'],
    ['bonsoir'],
    true
  );

  expect(results).toBe('_01-2578BDGKLPRSTVWZabcdehilmnoqrstuxyz');
});
