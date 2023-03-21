import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
// Importing the jest testing library
import '@testing-library/jest-dom'
import App from '../App';

afterEach(() => {
    cleanup(); // Resets the DOM after each test suite
})

describe('<App />', () => {
  test('App renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
})

