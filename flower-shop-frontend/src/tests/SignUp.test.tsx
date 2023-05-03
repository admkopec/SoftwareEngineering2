import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { signUpPageRoute } from '../pages/Router';
import renderWithRouter from '../utils/renderWithRouter';
import SignUp from '../components/SignUp';

describe('<SignUp />', () => {
  test('contains all input fields', () => {
    renderWithRouter(<SignUp />, { route: signUpPageRoute.path });
    const passwordElements: HTMLInputElement[] = screen.getAllByLabelText('Password', { exact: false });
    const inputElements: HTMLInputElement[] = screen.getAllByRole('textbox');
    expect(passwordElements).toHaveLength(2);
    passwordElements.forEach((el) => {
      expect(el).toBeInTheDocument();
    });
    expect(inputElements).toHaveLength(3);
    inputElements.forEach((el) => {
      expect(el).toBeInTheDocument();
    });
  });

  test('contains the checkbox', () => {
    renderWithRouter(<SignUp />, { route: signUpPageRoute.path });
    const checkboxElement: HTMLInputElement[] = screen.getAllByRole('checkbox');
    expect(checkboxElement).toHaveLength(1);
    expect(checkboxElement[0]).toBeInTheDocument();
    expect(checkboxElement[0]).toHaveAccessibleName(
      'I would like to partake in the Newsletter programme, that is receive discount information, updates and suggestions via email.'
    );
  });

  test('contains a button with "Log In" text', () => {
    renderWithRouter(<SignUp />, { route: signUpPageRoute.path });
    const buttonElement = screen.getAllByRole('button');
    expect(buttonElement).toHaveLength(1);
    expect(buttonElement[0]).toHaveTextContent('Sign Up');
  });

  test('contains link element with text annotation', () => {
    renderWithRouter(<SignUp />, { route: signUpPageRoute.path });
    const linkElement = screen.getAllByRole('link');
    expect(linkElement).toHaveLength(1);
    expect(linkElement[0]).toHaveTextContent('Already have an account? Log In');
  });
});
