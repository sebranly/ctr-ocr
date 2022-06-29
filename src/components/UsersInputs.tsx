import * as React from 'react';

export interface UsersInputsProps {
  suggestions: string[];
  playersBis: string[];
  setPlayersBis: React.Dispatch<React.SetStateAction<string[]>>;
}

const UsersInputs: React.FC<UsersInputsProps> = (props) => {
  // TODO: have it disabled
  // TODO: have tests
  const { playersBis, setPlayersBis, suggestions } = props;

  const onChangeInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (playersBis.length <= index) return;

    const { value } = e.currentTarget;
    const newPlayersBis = [...playersBis];

    newPlayersBis[index] = value;

    setPlayersBis(newPlayersBis);
  };

  const renderUserInput = (index: number) => {
    const datalistIdString = `human-player-suggestion-${index}`;
    return (
      <div key={index}>
        <input
          className="mb mt big-input"
          list={datalistIdString}
          onChange={onChangeInput(index)}
          value={playersBis[index] || ''}
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

  return <div>{playersBis.map((_playerBis, index) => renderUserInput(index))}</div>;
};

export { UsersInputs };
