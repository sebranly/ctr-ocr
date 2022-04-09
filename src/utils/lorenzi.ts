import { getColorHexadecimalTeam } from '.';
import { SEPARATOR_PLAYERS_LORENZI } from '../constants';
import { Result } from '../types';
import { formatDate } from './date';

const createLorenzi = (
  races: Result[][],
  playerTeams: Record<string, string>,
  nbTeams: number,
  nbPlayers: number,
  teams: string[],
  includeCpuPlayers: boolean
) => {
  // Presence of CPUs currently means there is no team
  const isFFA = includeCpuPlayers || nbTeams === nbPlayers;

  if (isFFA) return createLorenziFFA(races);

  return createLorenziTeams(races, playerTeams, teams);
};

const createLorenziTeams = (races: Result[][], playerTeams: Record<string, string>, teams: string[]) => {
  const playersPoints = createLorenziPlayersPoints(races);

  const teamPlayersLines: string[] = [];

  teams.forEach((team: string, indexTeam: number) => {
    const teamLine = `${team} ${getColorHexadecimalTeam(indexTeam)}`;
    teamPlayersLines.push(teamLine);

    Object.keys(playerTeams).forEach((player: string) => {
      if (playerTeams[player] === team) {
        const pointsLine = playersPoints[player];

        const line = `${player} ${pointsLine.join(SEPARATOR_PLAYERS_LORENZI)}`;

        teamPlayersLines.push(line);
      }
    });

    teamPlayersLines.push('');
  });

  return [...createLorenziIntro(), '', ...teamPlayersLines];
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

    const line = `${username} ${playerPoints.join(SEPARATOR_PLAYERS_LORENZI)}`;

    playersLines.push(line);
  });

  return [...createLorenziIntro(), '', ...playersLines];
};

export { createLorenzi, createLorenziFFA, createLorenziTeams, createLorenziIntro, createLorenziPlayersPoints };
