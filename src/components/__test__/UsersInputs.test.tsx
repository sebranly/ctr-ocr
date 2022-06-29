import * as React from 'react';
import { render } from '@testing-library/react';

import { UsersInputs } from '../UsersInputs';

test('UsersInputs', () => {
  const createComponent = () => (
    <UsersInputs
      isDisabledUI={false}
      players={['player1', 'player2', 'player3']}
      setPlayers={() => {}}
      suggestions={['someone', 'else']}
    />
  );

  const { container } = render(createComponent());
  expect(container.childNodes).toMatchSnapshot();
});
