import * as React from 'react';
import { render } from '@testing-library/react';

import { UsersInputs } from '../UsersInputs';

test('UsersInputs', () => {
  const createComponent = () => (
    <UsersInputs
      isDisabledUI={false}
      playersBis={['player1', 'player2', 'player3']}
      setPlayersBis={() => {}}
      suggestions={['someone', 'else']}
    />
  );

  const { container } = render(createComponent());
  expect(container.childNodes).toMatchSnapshot();
});
