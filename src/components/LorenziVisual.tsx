import * as React from 'react';
import { LorenziTeam } from '../types';

export interface LorenziVisualProps {
  lorenziTeams: LorenziTeam[];
  setLorenziTeams: React.Dispatch<React.SetStateAction<LorenziTeam[]>>;
}

const LorenziVisual: React.FC<LorenziVisualProps> = (props) => {
  const { lorenziTeams, setLorenziTeams } = props;

  const onChangeProperty = (index: number, isName: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (lorenziTeams.length <= index) return;

    const { value } = e.currentTarget;
    const newLorenziTeams = [...lorenziTeams];

    if (isName) newLorenziTeams[index].name = value;
    else newLorenziTeams[index].color = value;

    setLorenziTeams(newLorenziTeams);
  };

  const renderLorenziTeam = (team: LorenziTeam, index: number) => {
    const { name, color } = team;

    return (
      <div className="mb" key={index}>
        <input className="mr" onChange={onChangeProperty(index, true)} value={name} />
        <input className="ml" onChange={onChangeProperty(index, false)} type="color" value={color} />
      </div>
    );
  };

  return <div className="text-center mb2">{lorenziTeams.map(renderLorenziTeam)}</div>;
};

export { LorenziVisual };
