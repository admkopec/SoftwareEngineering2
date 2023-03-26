import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Home from '../pages/Home';

describe('<App />', () => {
  test('App renders learn react link', () => {
    render(<Home />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
});

