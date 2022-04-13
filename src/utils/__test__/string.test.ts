import {
  charRange,
  charactersMatch,
  cleanString,
  getClosestString,
  getEditDistance,
  getSubstitutionCost,
  sortAlphanumeric,
  sortCaseInsensitive
} from '../string';

test('getSubstitutionCost', () => {
  expect(getSubstitutionCost('', '')).toBe(1);
  expect(getSubstitutionCost('', 'a')).toBe(1);
  expect(getSubstitutionCost('a', '')).toBe(1);
  expect(getSubstitutionCost('ab', 'ab')).toBe(1);
  expect(getSubstitutionCost('', 'ab')).toBe(1);
  expect(getSubstitutionCost('ab', '')).toBe(1);
  expect(getSubstitutionCost('a', 'A')).toBe(1);
  expect(getSubstitutionCost('A', 'a')).toBe(1);
  expect(getSubstitutionCost('B', 'a')).toBe(1);

  expect(getSubstitutionCost('a', 'a')).toBe(0);

  expect(getSubstitutionCost('B', '8')).toBe(0.5);
  expect(getSubstitutionCost('-', '_')).toBe(0.5);
  expect(getSubstitutionCost('Z', '2')).toBe(0.5);
  expect(getSubstitutionCost('O', '0')).toBe(0.5);
  expect(getSubstitutionCost('l', '1')).toBe(0.5);
  expect(getSubstitutionCost('S', '5')).toBe(0.5);

  expect(getSubstitutionCost('Z', '7')).toBe(0.75);
  expect(getSubstitutionCost('o', '0')).toBe(0.75);
  expect(getSubstitutionCost('o', 'O')).toBe(0.75);
  expect(getSubstitutionCost('D', 'P')).toBe(0.75);
  expect(getSubstitutionCost('B', 'R')).toBe(0.75);
  expect(getSubstitutionCost('e', 'c')).toBe(0.75);
  expect(getSubstitutionCost('c', 'o')).toBe(0.75);
});

test('charactersMatch', () => {
  expect(charactersMatch('a', 'a', ['a', 'a'])).toBe(true);
  expect(charactersMatch('A', 'a', ['A', 'a'])).toBe(true);
  expect(charactersMatch('A', 'a', ['a', 'A'])).toBe(true);
  expect(charactersMatch('A', 'A', ['A', 'a'])).toBe(true);
  expect(charactersMatch('A', 'A', ['a', 'A'])).toBe(true);

  expect(charactersMatch('A', 'A', ['a', 'a'])).toBe(false);
  expect(charactersMatch('b', 'B', ['a', 'A'])).toBe(false);
  expect(charactersMatch('a', 'B', ['a', 'A'])).toBe(false);
  expect(charactersMatch('A', 'B', ['a', 'A'])).toBe(false);
});

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
  expect(sortAlphanumeric('C-Horloge', 'D-Canyon')).toBe(-1);
  expect(sortAlphanumeric('D-Canyon', 'C-Horloge')).toBe(1);
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

test('getClosestString', () => {
  const list = ['bonjour', 'bonsoir', 'bon jour', 'bon joueur'];
  expect(getClosestString('Bonjour', [])).toBe('Bonjour');
  expect(getClosestString('Bonjour', list)).toBe('bonjour');
  expect(getClosestString('B0njouR', list)).toBe('bonjour');
  expect(getClosestString('Bojour', list)).toBe('bonjour');
  expect(getClosestString('Bon jour', list)).toBe('bon jour');
  expect(getClosestString('           Bon jou         r', list)).toBe('bon jour');
});

test('getEditDistance', () => {
  expect(getEditDistance('', '')).toBe(0);

  expect(getEditDistance('', 'bonjour')).toBe(7);
  expect(getEditDistance('bonjour', '')).toBe(7);

  expect(getEditDistance('bonjour', 'bonjour')).toBe(0);

  expect(getEditDistance('bOnjour', 'bonjour')).toBe(0.75);
  expect(getEditDistance('bonjour', 'bOnjour')).toBe(0.75);

  expect(getEditDistance('bonjour', 'BONJOUR')).toBe(6.5);
  expect(getEditDistance('BONJOUR', 'bonjour')).toBe(6.5);

  expect(getEditDistance('bonjour', 'bonsoir')).toBe(2);
  expect(getEditDistance('bonsoir', 'bonjour')).toBe(2);

  expect(getEditDistance('bonjour', 'ruojnob')).toBe(6);
  expect(getEditDistance('ruojnob', 'bonjour')).toBe(6);

  expect(getEditDistance('abc', 'abcdef')).toBe(3);
  expect(getEditDistance('abcdef', 'abc')).toBe(3);

  expect(getEditDistance('aazKy0_80mbsa', 'Kyo-Bomba')).toBe(6.5);
  expect(getEditDistance('Kyo-Bomba', 'aazKy0_80mbsa')).toBe(6.5);

  expect(getEditDistance('A sentence with several words', 'a sentENCE with one word')).toBe(12);
  expect(getEditDistance('a sentENCE with one word', 'A sentence with several words')).toBe(12);
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
