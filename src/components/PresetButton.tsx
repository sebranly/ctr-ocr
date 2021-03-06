import * as React from 'react';
import { CTR_MAX_PLAYERS } from '../constants';
import { Sign } from '../types';
import { createArraySameValue, isEqual } from '../utils/array';
import { getAbsolutePointsScheme } from '../utils/points';

export interface PresetButtonProps {
  className?: string;
  name: string;
  isDisabledUI: boolean;
  pointsScheme: number[];
  nbPlayers: number;
  nbTeams: number;
  isRanked: boolean;
  isDoubleRush: boolean;
  setSignPointsScheme: React.Dispatch<React.SetStateAction<Sign[]>>;
  setAbsolutePointsScheme: React.Dispatch<React.SetStateAction<number[]>>;
}

const PresetButton: React.FC<PresetButtonProps> = (props) => {
  const {
    className,
    isDisabledUI,
    isDoubleRush,
    isRanked,
    name,
    nbPlayers,
    nbTeams,
    pointsScheme,
    setAbsolutePointsScheme,
    setSignPointsScheme
  } = props;

  const newAbsolutePointsScheme = getAbsolutePointsScheme(nbPlayers, nbTeams, isRanked, isDoubleRush);
  const isSamePreset = isEqual(pointsScheme.slice(0, nbPlayers), newAbsolutePointsScheme.slice(0, nbPlayers));

  return (
    <button
      className={className}
      onClick={() => {
        setSignPointsScheme(createArraySameValue(CTR_MAX_PLAYERS, Sign.Positive));
        setAbsolutePointsScheme(newAbsolutePointsScheme);
      }}
      disabled={isDisabledUI || isSamePreset}
    >
      {name}
    </button>
  );
};

export { PresetButton };
