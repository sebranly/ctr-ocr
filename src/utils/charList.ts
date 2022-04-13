import { uniq } from 'lodash';
import { CTR_MAX_PLAYERS } from '../constants';
import { numberRange } from './number';
import { charRange, sortAlphanumeric } from './string';

const getCharListPosition = () => numberRange(1, CTR_MAX_PLAYERS).join('');
const getCharListDigits = () => numberRange(0, 9).join('');
const getCharListTime = () => `${getCharListDigits()}:-`;

/**
 * @deprecated Use getCharListFromUsernames instead
 */
const getCharListUsername = () => {
  const charListUppercaseLetters = charRange('A', 'Z').join('');
  const charListLowercaseLetters = charRange('a', 'z').join('');
  const charListLetters = `${charListLowercaseLetters}${charListUppercaseLetters}`;

  return `${charListLetters}${getCharListDigits()}:-_. `;
};

const getCharListFromUsernames = (players: string[], cpuPlayers: string[], includeCpuPlayers: boolean) => {
  const allLetters: string[] = [];
  players.forEach((player: string) => {
    allLetters.push(...player.split(''));
  });

  if (includeCpuPlayers) {
    cpuPlayers.forEach((player: string) => {
      allLetters.push(...player.split(''));
    });
  }

  const newAllLetters = uniq(allLetters).sort(sortAlphanumeric);

  return newAllLetters.join('');
};

export { getCharListPosition, getCharListDigits, getCharListTime, getCharListUsername, getCharListFromUsernames };
