/**
 * @format
 */

import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';

describe('App', () => {
  it('renders without crashing', async () => {
    await renderer.act(() => {
      renderer.create(<App />);
    });
  });
});
