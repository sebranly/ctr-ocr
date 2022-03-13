import { charRange, numberRange } from './utils';

export const CTR_MAX_PLAYERS = 8;
export const CHARLIST_UPPERCASE_LETTERS = charRange('A', 'Z').join('');
export const CHARLIST_LOWERCASE_LETTERS = charRange('a', 'z').join('');
export const CHARLIST_LETTERS = `${CHARLIST_LOWERCASE_LETTERS}${CHARLIST_UPPERCASE_LETTERS}`;
export const CHARLIST_DIGITS = numberRange(0, 9).join('');
export const CHARLIST_POSITION = numberRange(1, CTR_MAX_PLAYERS).join('');
export const CHARLIST_TIME = `${CHARLIST_DIGITS}:-`;
export const CHARLIST_USERNAME = `${CHARLIST_LETTERS}${CHARLIST_DIGITS}:-_. `;
export const MIME_JPEG = 'image/jpeg';
export const PSM_SINGLE_CHAR = '10';
export const PSM_SINGLE_LINE = '7';
export const SEPARATOR_PLAYERS = '\n';