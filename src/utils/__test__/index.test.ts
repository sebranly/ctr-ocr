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
  getCloserString,
  getParams,
  numberRange,
  positionIsValid,
  validateTimes,
  validateUsernames
} from '../index';

const correctResponse: Validation = {
  correct: true,
  errMsg: ''
};

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
