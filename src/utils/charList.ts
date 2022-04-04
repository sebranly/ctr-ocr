import { CTR_MAX_PLAYERS } from '../constants';
import { charRange, numberRange } from './index';

const getCharListPosition = () => numberRange(1, CTR_MAX_PLAYERS).join('');
const getCharListDigits = () => numberRange(0, 9).join('');
const getCharListTime = () => `${getCharListDigits()}:-`;

const getCharListUsername = () => {
  const charListUppercaseLetters = charRange('A', 'Z').join('');
  const charListLowercaseLetters = charRange('a', 'z').join('');
  const charListLetters = `${charListLowercaseLetters}${charListUppercaseLetters}`;

  return `${charListLetters}${getCharListDigits()}:-_. `;
};

export { getCharListPosition, getCharListDigits, getCharListTime, getCharListUsername };
