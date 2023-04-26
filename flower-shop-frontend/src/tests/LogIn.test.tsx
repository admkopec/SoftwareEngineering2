import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import LogIn from '../components/LogIn';
import { routes } from '../pages/Router';

const memoryRouter = createMemoryRouter(routes, {
  initialEntries: ['/', '/login'],
  initialIndex: 1
});

describe('<LogIn />', () => {
  test('contains all input fields', () => {
    render(<RouterProvider router={memoryRouter} />);
    const passwordElement: HTMLInputElement[] = screen.getAllByLabelText('Password', { exact: false });
    const usernameElement: HTMLInputElement[] = screen.getAllByLabelText('Username', { exact: false });
    expect(passwordElement).toHaveLength(1);
    expect(passwordElement[0]).toBeInTheDocument();
    expect(usernameElement).toHaveLength(1);
    expect(usernameElement[0]).toBeInTheDocument();
  });

  test('has input fields which allow for user input', () => {
    render(<RouterProvider router={memoryRouter} />);
    const inputElements: HTMLInputElement[] = screen.getAllByRole('textbox');
    console.log(inputElements);
    inputElements.forEach((element) => {
      fireEvent.change(element, { target: { value: 'sample text' } });
      expect(element.value).toBe('sample text');
    });
  });

  test('contains a button with "Log In" text', () => {
    render(<RouterProvider router={memoryRouter} />);
    const buttonElement = screen.getAllByRole('button');
    expect(buttonElement).toHaveLength(1);
    expect(buttonElement[0]).toHaveTextContent('Log In');
  });

  test('contains "Log In" heading', () => {
    render(<RouterProvider router={memoryRouter} />);
    const headerElement = screen.getAllByRole('heading');
    expect(headerElement).toHaveLength(1);
    expect(headerElement[0]).toHaveTextContent('Log In');
  });

  test('contains link element with text annotation', () => {
    render(<RouterProvider router={memoryRouter} />);
    const linkElement = screen.getAllByRole('link');
    expect(linkElement).toHaveLength(1);
    expect(linkElement[0]).toHaveTextContent("Don't have an account? Sign Up");
  });
});
