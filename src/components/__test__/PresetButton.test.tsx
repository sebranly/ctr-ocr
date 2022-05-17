import * as React from 'react';
import { render } from '@testing-library/react';

import { PresetButton } from '../PresetButton';

test('PresetButton', () => {
  const createComponent = () => (
    <PresetButton
      isDisabledUI={false}
      name="Some preset"
      pointsScheme={[8, 7, 6, 5, 4, 3, 2, 1]}
      nbPlayers={8}
      nbTeams={2}
      isRanked={false}
      isDoubleRush={false}
      setSignPointsScheme={() => {}}
      setAbsolutePointsScheme={() => {}}
    />
  );

  const { container } = render(createComponent());
  expect(container.childNodes).toMatchSnapshot();
});
