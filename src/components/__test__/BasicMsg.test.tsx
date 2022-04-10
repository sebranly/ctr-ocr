import * as React from 'react';
import { render } from '@testing-library/react';

import { BasicMsg } from '../BasicMsg';

test('BasicMsg', () => {
  const createComponent = () => <BasicMsg msg="bonjour" />;

  const { container } = render(createComponent());
  expect(container.childNodes).toMatchSnapshot();
});
