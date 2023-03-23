import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from '../App';

describe('<App />', () => {
  test('App renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
});

