import { charRange, cleanString, getCloserString, sortAlphanumeric, sortCaseInsensitive } from '../string';

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