import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpSuccess from '../components/SignUpSuccess';
import { renderWithRouter } from '../utils/renderWithRouter';
import { signUpSuccessPageRoute } from '../pages/Router';

describe('<SignUpSuccess />', () => {
  test('contains proper text', () => {
    renderWithRouter(<SignUpSuccess />, { route: signUpSuccessPageRoute.path });
    const heading = screen.getAllByRole('heading');
    expect(heading).toHaveLength(2);
    expect(heading[0]).toHaveTextContent('You have been successfully signed up!');
    expect(heading[1]).toHaveTextContent('You may start using the website now.');
  });
});
