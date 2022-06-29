import { PSM_SINGLE_CHAR, PSM_SINGLE_LINE, TIME_DNF } from '../../constants';
import { Category } from '../../types';
import { getCharListPosition, getCharListTime } from '../charList';
import {
  convertToMs,
  formatCpuPlayers,
  getColorPlayer,
  getColorHexadecimalTeam,
  getPositionString,
  getOptionsTeams,
  getParams,
  getPlayers,
  getReferencePlayers,
  getTeamNames,
  isHumanPlayer,
  positionIsValid
} from '../index';

test('getPositionString', () => {
  expect(getPositionString(-1)).toBe('-1');
  expect(getPositionString(0)).toBe('0');
  expect(getPositionString(1)).toBe('1st');
  expect(getPositionString(2)).toBe('2nd');
  expect(getPositionString(3)).toBe('3rd');
  expect(getPositionString(4)).toBe('4th');
  expect(getPositionString(5)).toBe('5th');
  expect(getPositionString(6)).toBe('6th');
  expect(getPositionString(7)).toBe('7th');
  expect(getPositionString(8)).toBe('8th');
  expect(getPositionString(9)).toBe('9th');
  expect(getPositionString(10)).toBe('10th');
  expect(getPositionString(11)).toBe('11th');
  expect(getPositionString(12)).toBe('12th');
  expect(getPositionString(13)).toBe('13th');
  expect(getPositionString(14)).toBe('14th');
  expect(getPositionString(15)).toBe('15th');
  expect(getPositionString(16)).toBe('16th');
  expect(getPositionString(17)).toBe('17th');
  expect(getPositionString(18)).toBe('18th');
  expect(getPositionString(19)).toBe('19th');
  expect(getPositionString(20)).toBe('20th');
  expect(getPositionString(21)).toBe('21st');
  expect(getPositionString(22)).toBe('22nd');
  expect(getPositionString(23)).toBe('23rd');
  expect(getPositionString(24)).toBe('24th');
});

test('getTeamNames', () => {
  expect(getTeamNames(0)).toStrictEqual([]);
  expect(getTeamNames(1)).toStrictEqual(['Team 1']);
  expect(getTeamNames(4)).toStrictEqual(['Team 1', 'Team 2', 'Team 3', 'Team 4']);
});

test('getColorHexadecimalTeam', () => {
  expect(getColorHexadecimalTeam(0)).toBe('#33CCFF');
  expect(getColorHexadecimalTeam(1)).toBe('#FF4040');
  expect(getColorHexadecimalTeam(2)).toBe('#008000');
  expect(getColorHexadecimalTeam(3)).toBe('#FFA500');
  expect(getColorHexadecimalTeam(4)).toBe('#6A0DAD');
  expect(getColorHexadecimalTeam(5)).toBe('#964B00');
  expect(getColorHexadecimalTeam(6)).toBe('#808080');
  expect(getColorHexadecimalTeam(7)).toBe('#FFFFFF');
  expect(getColorHexadecimalTeam(8)).toBe('#FFFFFF');
});

test('getColorPlayer', () => {
  const sevenTeams = ['t1', 't2', 't3', 't4', 't5', 't6', 't7'];

  expect(getColorPlayer('a', sevenTeams, { a: 't1' })).toBe('blue');
  expect(getColorPlayer('a', sevenTeams, { a: 't2' })).toBe('red');
  expect(getColorPlayer('a', sevenTeams, { a: 't3' })).toBe('green');
  expect(getColorPlayer('a', sevenTeams, { a: 't4' })).toBe('orange');
  expect(getColorPlayer('a', sevenTeams, { a: 't5' })).toBe('purple');
  expect(getColorPlayer('a', sevenTeams, { a: 't6' })).toBe('brown');
  expect(getColorPlayer('a', sevenTeams, { a: 't7' })).toBe('grey');
  expect(getColorPlayer('a', sevenTeams, { a: 't8' })).toBe('black');
  expect(getColorPlayer('a', [], { a: 't1' })).toBe('black');
  expect(getColorPlayer('', [], { a: 't1' })).toBe('black');
  expect(getColorPlayer('', sevenTeams, { a: 't1' })).toBe('black');
});

test('getOptionsTeams', () => {
  expect(getOptionsTeams(0)).toStrictEqual([0]);
  expect(getOptionsTeams(1)).toStrictEqual([1]);
  expect(getOptionsTeams(2)).toStrictEqual([2]);
  expect(getOptionsTeams(3)).toStrictEqual([3, 2]);
  expect(getOptionsTeams(4)).toStrictEqual([4, 2, 3]);
  expect(getOptionsTeams(5)).toStrictEqual([5, 2, 3, 4]);
  expect(getOptionsTeams(6)).toStrictEqual([6, 2, 3, 4, 5]);
  expect(getOptionsTeams(7)).toStrictEqual([7, 2, 3, 4, 5, 6]);
  expect(getOptionsTeams(8)).toStrictEqual([8, 2, 3, 4, 5, 6, 7]);
});

test('isHumanPlayer', () => {
  expect(isHumanPlayer('bonjour', '')).toBe(false);
  expect(isHumanPlayer('bonjour', 'bonjour')).toBe(true);
  expect(isHumanPlayer('bonjour', 'bonsoir')).toBe(false);
  expect(isHumanPlayer('bonjour', 'bonsoir\nbonjour')).toBe(true);
});

test('formatCpuPlayers', () => {
  expect(formatCpuPlayers([])).toBe('');
  expect(formatCpuPlayers(['', ''])).toBe('');
  expect(formatCpuPlayers(['bonjour', ''])).toBe('bonjour');
  expect(formatCpuPlayers(['bonjour', 'bonsoir'])).toBe('bonjour\nbonsoir');
  expect(formatCpuPlayers(['bonsoir', 'bonjour'])).toBe('bonjour\nbonsoir');
});

test('getPlayers', () => {
  expect(getPlayers('')).toStrictEqual([]);
  expect(getPlayers('some\n')).toStrictEqual(['some']);
  expect(getPlayers('some\nelse')).toStrictEqual(['some', 'else']);
  expect(getPlayers('some\n\n\nelse\n\n')).toStrictEqual(['some', 'else']);
});

test('getReferencePlayers', () => {
  expect(getReferencePlayers('', '', false)).toStrictEqual([]);
  expect(getReferencePlayers('', '', true)).toStrictEqual([]);
  expect(getReferencePlayers('', 'and\nelse', false)).toStrictEqual([]);
  expect(getReferencePlayers('', 'and\nelse', true)).toStrictEqual([]);
  expect(getReferencePlayers('some\nthing', 'and\nelse', false)).toStrictEqual(['some', 'thing']);
  expect(getReferencePlayers('some\nthing', 'and\nelse', true)).toStrictEqual(['some', 'thing', 'and', 'else']);
  expect(getReferencePlayers('some\nthing', '', false)).toStrictEqual(['some', 'thing']);
  expect(getReferencePlayers('some\nthing', '', true)).toStrictEqual(['some', 'thing']);
  expect(getReferencePlayers('some\nthing\n\nthen', 'and\n\nelse\n', true)).toStrictEqual([
    'some',
    'thing',
    'then',
    'and',
    'else'
  ]);
});

test('convertToMs', () => {
  expect(convertToMs('Bonjour')).toBe(0);
  expect(convertToMs(TIME_DNF)).toBe(0);
  expect(convertToMs('0:00:01')).toBe(10);
  expect(convertToMs('0:00:10')).toBe(100);
  expect(convertToMs('0:00:19')).toBe(190);
  expect(convertToMs('0:01:19')).toBe(1190);
  expect(convertToMs('0:18:19')).toBe(18190);
  expect(convertToMs('1:18:19')).toBe(78190);
  expect(convertToMs('10:18:19')).toBe(618190);
});

test('getParams', () => {
  const { Position, Time, Username } = Category;

  expect(getParams(Position, [], [], false)).toStrictEqual({
    tessedit_char_whitelist: getCharListPosition(),
    tessedit_pageseg_mode: PSM_SINGLE_CHAR
  });

  expect(getParams(Username, ['bonjour'], ['bonsoir'], true)).toStrictEqual({
    tessedit_char_whitelist: 'bijnorsu',
    tessedit_pageseg_mode: PSM_SINGLE_LINE
  });

  expect(getParams(Time, [], [], false)).toStrictEqual({
    tessedit_char_whitelist: getCharListTime(),
    tessedit_pageseg_mode: PSM_SINGLE_LINE
  });
});

test('positionIsValid', () => {
  expect(positionIsValid('one', 2)).toBe(false);
  expect(positionIsValid('0', 2)).toBe(false);
  expect(positionIsValid('3', 2)).toBe(false);
  expect(positionIsValid('2a', 2)).toBe(false);
  expect(positionIsValid('a2', 2)).toBe(false);

  expect(positionIsValid('1', 2)).toBe(true);
  expect(positionIsValid('2', 2)).toBe(true);
});
