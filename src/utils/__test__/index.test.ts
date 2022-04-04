import {
  CHARLIST_POSITION,
  CHARLIST_TIME,
  CHARLIST_USERNAME,
  PSM_SINGLE_CHAR,
  PSM_SINGLE_LINE,
  TIME_DNF
} from '../../constants';
import { Category, Validation } from '../../types';
import {
  applyRatio,
  charRange,
  cleanString,
  convertToMs,
  formatCpuPlayers,
  getCloserString,
  getColorPlayer,
  getPositionString,
  getExtract,
  getFilenameWithoutExtension,
  getMimeType,
  getOptionsTeams,
  getParams,
  getPlayers,
  getReferencePlayers,
  getTeamNames,
  isHumanPlayer,
  numberRange,
  positionIsValid,
  sortAlphanumeric,
  sortCaseInsensitive,
  sortImagesByFilename,
  validateTeams,
  validateTimes,
  validateUsernames
} from '../index';

const correctResponse: Validation = {
  correct: true,
  errMsg: ''
};

test('sortAlphanumeric', () => {
  expect(sortAlphanumeric('a', 'a')).toBe(-1);
  expect(sortAlphanumeric('a', 'b')).toBe(-1);
  expect(sortAlphanumeric('b', 'a')).toBe(1);
  expect(sortAlphanumeric('1', '0')).toBe(1);
  expect(sortAlphanumeric('0', '0')).toBe(0);
  expect(sortAlphanumeric('0', '1')).toBe(-1);
  expect(sortAlphanumeric('1', '10')).toBe(-1);
  expect(sortAlphanumeric('10', '1')).toBe(1);
  expect(sortAlphanumeric('IMG1', 'IMG10')).toBe(-1);
  expect(sortAlphanumeric('IMG01', 'IMG10')).toBe(-1);
  expect(sortAlphanumeric('IMG10', 'IMG1')).toBe(1);
  expect(sortAlphanumeric('IMG10', 'IMG01')).toBe(1);
});

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

test('sortCaseInsensitive', () => {
  expect(sortCaseInsensitive('', '')).toBe(1);
  expect(sortCaseInsensitive('a', '')).toBe(1);
  expect(sortCaseInsensitive('', 'a')).toBe(1);
  expect(sortCaseInsensitive('a', 'a')).toBe(0);
  expect(sortCaseInsensitive('a', 'A')).toBe(0);
  expect(sortCaseInsensitive('A', 'a')).toBe(0);
  expect(sortCaseInsensitive('A', 'A')).toBe(0);
  expect(sortCaseInsensitive('A', 'b')).toBe(-1);
  expect(sortCaseInsensitive('a', 'b')).toBe(-1);
  expect(sortCaseInsensitive('a', 'B')).toBe(-1);
  expect(sortCaseInsensitive('A', 'B')).toBe(-1);
  expect(sortCaseInsensitive('b', 'A')).toBe(1);
  expect(sortCaseInsensitive('b', 'a')).toBe(1);
  expect(sortCaseInsensitive('B', 'a')).toBe(1);
  expect(sortCaseInsensitive('B', 'A')).toBe(1);
  expect(sortCaseInsensitive('Bonjour', 'Au revoir')).toBe(1);
  expect(sortCaseInsensitive('B', 'Au revoir')).toBe(1);
  expect(sortCaseInsensitive('Bonjour', 'A')).toBe(1);
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

test('getFilenameWithoutExtension', () => {
  expect(getFilenameWithoutExtension('')).toBe('');
  expect(getFilenameWithoutExtension('name')).toBe('name');
  expect(getFilenameWithoutExtension('name.JPG')).toBe('name');
  expect(getFilenameWithoutExtension('name.JPEG')).toBe('name');
  expect(getFilenameWithoutExtension('name.PNG')).toBe('name');
  expect(getFilenameWithoutExtension('name.PNG.JPG')).toBe('name');
});

test('sortImagesByFilename', () => {
  const image1 = { name: 'IMG1.JPG' };
  const image2 = { name: 'IMG02.JPEG' };
  const image3 = { name: 'IMG000003.PNG' };
  const image4 = { name: 'IMG4.PNG' };
  const image5 = { name: 'IMG5.JPG' };
  const image6 = { name: 'IMG6' };
  const image7 = { name: 'IMG7.JPG' };
  const image8 = { name: 'IMG08.JPG' };
  const image9 = { name: 'IMG9.JPG' };
  const image10 = { name: 'IMG10.JPG' };
  const image11 = { name: 'IMG0011.JPG' };
  const image12 = { name: 'IMG12.JPG' };

  const notSortedImages = [
    image2,
    image11,
    image1,
    image3,
    image4,
    image6,
    image5,
    image7,
    image8,
    image9,
    image12,
    image10
  ];

  const sortedImages = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image11,
    image12
  ];

  expect(sortImagesByFilename([])).toStrictEqual([]);
  expect(sortImagesByFilename([{ name: 'any.JPG' }])).toStrictEqual([{ name: 'any.JPG' }]);
  expect(sortImagesByFilename(notSortedImages)).toStrictEqual(sortedImages);
});

test('getMimeType', () => {
  expect(getMimeType('')).toBe('image/jpeg');
  expect(getMimeType('jpeg')).toBe('image/jpeg');
  expect(getMimeType('JPEG')).toBe('image/jpeg');
  expect(getMimeType('jpg')).toBe('image/jpeg');
  expect(getMimeType('JPG')).toBe('image/jpeg');
  expect(getMimeType('png')).toBe('image/png');
  expect(getMimeType('PNG')).toBe('image/png');
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

test('validateUsernames', () => {
  const missingUsernameResponse = {
    correct: false,
    errMsg: 'At least one username is missing'
  };

  const duplicatedUsernameResponse = {
    correct: false,
    errMsg: 'At least one username is duplicated'
  };

  expect(validateUsernames([])).toStrictEqual(correctResponse);
  expect(validateUsernames([''])).toStrictEqual(missingUsernameResponse);
  expect(validateUsernames(['', 'bonjour'])).toStrictEqual(missingUsernameResponse);
  expect(validateUsernames(['', ''])).toStrictEqual(missingUsernameResponse);
  expect(validateUsernames(['bonjour', 'bonjour'])).toStrictEqual(duplicatedUsernameResponse);
  expect(validateUsernames(['bonjour', 'bonsoir', 'bonjour'])).toStrictEqual(duplicatedUsernameResponse);
  expect(validateUsernames(['bonjour', 'bonsoir'])).toStrictEqual(correctResponse);
});

test('validateTeams', () => {
  expect(validateTeams(['a', 'b'], ['t1', 't2'], { a: 't1', b: 't2' })).toStrictEqual(correctResponse);
  expect(validateTeams(['a', 'b', 'c'], ['t1', 't2'], { c: 't1' })).toStrictEqual({
    correct: false,
    isWarning: true,
    errMsg: 'The following players have no assigned team: a, b'
  });

  expect(validateTeams(['a', 'b', 'c'], ['t1', 't2'], { a: 't3', b: 't4', c: 't1' })).toStrictEqual({
    correct: false,
    errMsg: 'The following players have an invalid team: a, b'
  });

  expect(validateTeams(['a', 'b'], ['t1', 't2'], { a: 't1', b: 't1' })).toStrictEqual({
    correct: false,
    errMsg: 'You cannot have all players under the same team'
  });
});

test('validateTimes', () => {
  expect(validateTimes(['Bonjour'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions have incorrect formatted times: 1'
  });

  expect(validateTimes(['12:73:10'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions have incorrect formatted times: 1'
  });

  expect(validateTimes(['--:--:--'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:40'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:40', '--:--:--'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:40', '12:03:50'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:40', '--:--:--', '12:03:50'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions finished after somebody that did not finish: 3'
  });

  expect(validateTimes(['--:--:--', '12:03:40'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions finished after somebody that did not finish: 2'
  });

  expect(validateTimes(['--:--:--', '12:03:40', '12:03:50'])).toStrictEqual({
    correct: false,
    errMsg: 'The following positions finished after somebody that did not finish: 2, 3'
  });

  expect(validateTimes(['12:03:40', '12:03:50', '--:--:--'])).toStrictEqual(correctResponse);
  expect(validateTimes(['12:03:50', '12:03:40', '--:--:--'])).toStrictEqual({
    correct: false,
    errMsg: 'From position 1 to position 2, times are not in chronological order'
  });

  expect(validateTimes(['12:03:40', '12:33:40', '--:--:--'])).toStrictEqual(correctResponse);

  expect(validateTimes(['12:03:40', '12:33:41', '--:--:--'])).toStrictEqual({
    correct: false,
    errMsg: 'There are more than 30 seconds separating players'
  });

  const correctTimes = ['3:11:36', '3:12:59', '3:19:66', '3:20:83', '3:25:20', '3:29:61', '3:32:65', '3:36:95'];

  expect(validateTimes(correctTimes)).toStrictEqual(correctResponse);
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

test('cleanString', () => {
  expect(cleanString('')).toBe('');
  expect(cleanString('Bonjour')).toBe('Bonjour');
  expect(cleanString('ZouGui28')).toBe('ZouGui28');
  expect(cleanString('        Z        ouG ui28   ')).toBe('ZouGui28');
  expect(
    cleanString(`        Z        ouG ui  
  
  28

  `)
  ).toBe('ZouGui28');
});

test('getCloserString', () => {
  const list = ['bonjour', 'bonsoir', 'bon jour'];
  expect(getCloserString('Bonjour', [])).toBe('Bonjour');
  expect(getCloserString('Bonjour', list)).toBe('bonjour');
  expect(getCloserString('B0njouR', list)).toBe('bonjour');
  expect(getCloserString('Bojour', list)).toBe('bonjour');
  expect(getCloserString('Bon jour', list)).toBe('bon jour');
  expect(getCloserString('           Bon jou         r', list)).toBe('bon jour');
});

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

test('getExtract', () => {
  const info = { width: 4052, height: 2564 };
  const commonHeight = 136;
  const commonTop0 = 679;
  const commonTop1 = 815;
  const positionWidth = 109;
  const usernameWidth = 503;
  const timeWidth = 262;
  const expectedFullCrop = {
    height: 1089,
    left: 2593,
    top: 679,
    width: 1094
  };

  const expectedHalfCrop = {
    height: 544,
    left: 2593,
    top: 679,
    width: 1094
  };

  expect(getExtract(info, 8, Category.All)).toStrictEqual(expectedFullCrop);
  expect(getExtract(info, 4, Category.All)).toStrictEqual(expectedHalfCrop);

  expect(getExtract(info, 0, Category.Position)).toStrictEqual({
    height: commonHeight,
    left: 2593,
    top: commonTop0,
    width: positionWidth
  });

  expect(getExtract(info, 1, Category.Position)).toStrictEqual({
    height: commonHeight,
    left: 2593,
    top: commonTop1,
    width: positionWidth
  });

  expect(getExtract(info, 0, Category.Username)).toStrictEqual({
    height: commonHeight,
    left: 2888,
    top: commonTop0,
    width: usernameWidth
  });

  expect(getExtract(info, 1, Category.Username)).toStrictEqual({
    height: commonHeight,
    left: 2888,
    top: commonTop1,
    width: usernameWidth
  });

  expect(getExtract(info, 0, Category.Time)).toStrictEqual({
    height: commonHeight,
    left: 3391,
    top: commonTop0,
    width: timeWidth
  });

  expect(getExtract(info, 1, Category.Time)).toStrictEqual({
    height: commonHeight,
    left: 3391,
    top: commonTop1,
    width: timeWidth
  });
});

test('getParams', () => {
  const { Position, Time, Username } = Category;

  expect(getParams(Position)).toStrictEqual({
    tessedit_char_whitelist: CHARLIST_POSITION,
    tessedit_pageseg_mode: PSM_SINGLE_CHAR
  });

  expect(getParams(Username)).toStrictEqual({
    tessedit_char_whitelist: CHARLIST_USERNAME,
    tessedit_pageseg_mode: PSM_SINGLE_LINE
  });

  expect(getParams(Time)).toStrictEqual({
    tessedit_char_whitelist: CHARLIST_TIME,
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

test('charRange', () => {
  expect(charRange('A', 'A')).toStrictEqual(['A']);
  expect(charRange('A', 'B')).toStrictEqual(['A', 'B']);
  expect(charRange('A', 'D')).toStrictEqual(['A', 'B', 'C', 'D']);
  expect(charRange('a', 'c')).toStrictEqual(['a', 'b', 'c']);
  expect(charRange('A', 'Z')).toStrictEqual([
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]);
});
