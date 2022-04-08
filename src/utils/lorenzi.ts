import { Result } from '../types';

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

const createLorenziFFA = (races: Result[][]) => {
  const playersPoints: Record<string, number[]> = {};

  races.forEach((race: Result[]) => {
    race.forEach((result: Result) => {
      const { username } = result;

      if (!Object.keys(playersPoints).includes(username)) {
        playersPoints[username] = [];
      }
    });
  });

  const keyPlayers = Object.keys(playersPoints);

  races.forEach((race: Result[]) => {
    keyPlayers.forEach((username: string) => {
      const relevantResult = race.find((result: Result) => result.username === username);

      const points = relevantResult?.points ?? 0;

      playersPoints[username].push(points);
    });
  });

  const playersLines: string[] = [];

  keyPlayers.forEach((username: string) => {
    const playerPoints = playersPoints[username];

    const line = `${username} ${playerPoints.join('|')}`;

    playersLines.push(line);
  });

  return ['Title', '', ...playersLines];
};

export { createLorenzi, createLorenziFFA };
