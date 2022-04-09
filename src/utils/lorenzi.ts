import { Result } from '../types';
import { formatDate } from './date';

const createLorenzi = (
  races: Result[][],
  playerTeams: Record<string, string>,
  nbTeams: number,
  nbPlayers: number,
  includeCpuPlayers: boolean
) => {
  // Presence of CPUs currently means there is no team
  const isFFA = includeCpuPlayers || nbTeams === nbPlayers;

  if (isFFA) return createLorenziFFA(races);

  return '';
};

const createLorenziPlayersPoints = (races: Result[][]) => {
  const playersPoints: Record<string, number[]> = {};

  races.forEach((race: Result[]) => {
    race.forEach((result: Result) => {
      const { username } = result;

      if (!Object.keys(playersPoints).includes(username)) {
        playersPoints[username] = [];
      }
    });
  });

  races.forEach((race: Result[]) => {
    Object.keys(playersPoints).forEach((username: string) => {
      const relevantResult = race.find((result: Result) => result.username === username);

      const points = relevantResult?.points ?? 0;

      playersPoints[username].push(points);
    });
  });

  return playersPoints;
};

const createLorenziIntro = () => {
  return ['#title Title', `#date ${formatDate(Date.now())}`];
};

const createLorenziFFA = (races: Result[][]) => {
  const playersPoints = createLorenziPlayersPoints(races);

  const playersLines: string[] = [];

  Object.keys(playersPoints).forEach((username: string) => {
    const playerPoints = playersPoints[username];

    const line = `${username} ${playerPoints.join('|')}`;

    playersLines.push(line);
  });

  return [...createLorenziIntro(), '', ...playersLines];
};

export { createLorenzi, createLorenziFFA, createLorenziIntro, createLorenziPlayersPoints };
