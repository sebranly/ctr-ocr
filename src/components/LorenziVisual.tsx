import * as React from 'react';
import { LorenziTeam } from '../types';

export interface LorenziVisualProps {
  lorenziTeams: LorenziTeam[];
}

const LorenziVisual: React.FC<LorenziVisualProps> = (props) => {
  const { lorenziTeams } = props;

  const renderLorenziTeam = (team: LorenziTeam, index: number) => {
    const { name, color } = team;

    return (
      <div className="mb" key={index}>
        <input className="mr" value={name} />
        <input className="ml" type="color" value={color} />
      </div>
    );
  };

  return <div className="text-center mb2">{lorenziTeams.map(renderLorenziTeam)}</div>;
};

export { LorenziVisual };
