import { CHARLIST_POSITION, CHARLIST_TIME, CHARLIST_USERNAME, PSM_SINGLE_CHAR, PSM_SINGLE_LINE } from '../../constants';
import { Category } from '../../types';
import { applyRatio, charRange, cleanString, getCloserString, getParams, numberRange, positionIsValid } from '../index';

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