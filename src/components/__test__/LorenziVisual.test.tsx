import * as React from 'react';
import { render } from '@testing-library/react';

import { LorenziVisual } from '../LorenziVisual';

test('LorenziVisual', () => {
  const createComponent = () => (
    <LorenziVisual
      lorenziTeams={[
        { name: 'Team 1', color: '#aaaaaa' },
        { name: 'Team 2', color: '#bbbbbb' }
      ]}
      setLorenziTeams={() => {}}
    />
  );

  const { container } = render(createComponent());
  expect(container.childNodes).toMatchSnapshot();
});
