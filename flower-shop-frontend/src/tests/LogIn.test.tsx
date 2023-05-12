import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { loginPageRoute } from '../pages/Router';
import renderWithRouter from '../utils/renderWithRouter';
import LogIn from '../components/LogIn';

describe('<LogIn />', () => {
  test('contains all input fields', () => {
    renderWithRouter(<LogIn />, { route: loginPageRoute.path });
    const passwordElement: HTMLInputElement[] = screen.getAllByLabelText('Password', { exact: false });
    const usernameElement: HTMLInputElement[] = screen.getAllByLabelText('Username', { exact: false });
    expect(passwordElement).toHaveLength(1);
    expect(passwordElement[0]).toBeInTheDocument();
    expect(usernameElement).toHaveLength(1);
    expect(usernameElement[0]).toBeInTheDocument();
  });

  test('has input fields which allow for user input', () => {
    renderWithRouter(<LogIn />, { route: loginPageRoute.path });
    const inputElements: HTMLInputElement[] = screen.getAllByRole('textbox');
    inputElements.forEach((element) => {
      fireEvent.change(element, { target: { value: 'sample text' } });
      expect(element.value).toBe('sample text');
    });
  });

  test('contains a button with "Log In" text', () => {
    renderWithRouter(<LogIn />, { route: loginPageRoute.path });
    const buttonElement = screen.getAllByRole('button');
    expect(buttonElement).toHaveLength(1);
    expect(buttonElement[0]).toHaveTextContent('Log In');
  });

  test('contains "Log In" heading', () => {
    renderWithRouter(<LogIn />, { route: loginPageRoute.path });
    const headerElement = screen.getAllByRole('heading');
    expect(headerElement).toHaveLength(1);
    expect(headerElement[0]).toHaveTextContent('Log In');
  });

  test('contains link element with text annotation', () => {
    renderWithRouter(<LogIn />, { route: loginPageRoute.path });
    const linkElement = screen.getAllByRole('link');
    expect(linkElement).toHaveLength(1);
    expect(linkElement[0]).toHaveTextContent("Don't have an account? Sign Up");
  });
});
