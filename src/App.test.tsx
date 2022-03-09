import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test.skip('renders text', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/CTR OCR/i);
  expect(linkElement).toBeInTheDocument();
});
