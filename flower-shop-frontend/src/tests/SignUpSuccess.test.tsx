import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpSuccess from '../components/SignUpSuccess';

describe('<SignUpSuccess />', () => {
  test('contains proper text', () => {
    render(<SignUpSuccess />);
    const heading = screen.getAllByRole('heading');
    expect(heading).toHaveLength(2);
    expect(heading[0]).toHaveTextContent('You have been successfully signed up!');
    expect(heading[1]).toHaveTextContent('You may log in now.');
  });
});
