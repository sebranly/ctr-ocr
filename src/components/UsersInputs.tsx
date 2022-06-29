import * as React from 'react';

export interface UsersInputsProps {
  isDisabledUI: boolean;
  suggestions: string[];
  players: string[];
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
}

const UsersInputs: React.FC<UsersInputsProps> = (props) => {
  const { isDisabledUI, players, setPlayers, suggestions } = props;

  const onChangeInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (players.length <= index) return;

    const { value } = e.currentTarget;
    const newPlayers = [...players];

    newPlayers[index] = value;

    setPlayers(newPlayers);
  };

  const renderUserInput = (index: number) => {
    const datalistIdString = `human-player-suggestion-${index}`;
    return (
      <div key={index}>
        <input
          className="mb mt big-input"
          disabled={isDisabledUI}
          list={datalistIdString}
          onChange={onChangeInput(index)}
          value={players[index] || ''}
        />
        {renderDatalist(index)}
      </div>
    );
  };

  const renderDatalist = (datalistId: number) => {
    const datalistIdString = `human-player-suggestion-${datalistId}`;
    return (
      <datalist id={datalistIdString}>
        {suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    );
  };

  return <div>{players.map((_players, index) => renderUserInput(index))}</div>;
};

export { UsersInputs };
