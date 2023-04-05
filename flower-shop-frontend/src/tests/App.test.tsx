import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../pages/HomePage';

describe('<App />', () => {
  test('App renders learn react link', () => {
    render(<HomePage />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
});
