import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router-dom';
import { routes } from '../pages/Router';

const memoryRouter = createMemoryRouter(routes, {
    initialEntries: ["/", "/signup"],
    initialIndex: 1,
});

describe('<SignUp /> ', () => {
    test('contains all input fields', () => {
        render(<RouterProvider router={memoryRouter}></RouterProvider>);
        const passwordElement : HTMLInputElement[] = screen.getAllByLabelText('Password', {exact: false});
        const inputElements : HTMLInputElement[] = screen.getAllByRole('textbox');
        expect(passwordElement).toHaveLength(1);
        expect(passwordElement[0]).toBeInTheDocument();
        expect(inputElements).toHaveLength(4);
        inputElements.forEach((el)=>{
            expect(el).toBeInTheDocument();
        });
    });

    test('contains the checkbox', () => {
        render(<RouterProvider router={memoryRouter}></RouterProvider>);
        const checkboxElement : HTMLInputElement[] = screen.getAllByRole('checkbox');
        expect(checkboxElement).toHaveLength(1);
        expect(checkboxElement[0]).toBeInTheDocument();
        expect(checkboxElement[0]).toHaveAccessibleName('I would like to partake in the Newsletter programme, that is receive discount information, updates and suggestions via email.');
    });

    test('contains a button with "Log In" text', () => {
        render(<RouterProvider router={memoryRouter}></RouterProvider>);
        const buttonElement = screen.getAllByRole('button');
        expect(buttonElement).toHaveLength(1);
        expect(buttonElement[0]).toHaveTextContent('Sign Up');
    });

    test('contains link element with text annotation', () => {
        render(<RouterProvider router={memoryRouter}></RouterProvider>);
        const linkElement = screen.getAllByRole('link');
        expect(linkElement).toHaveLength(1);
        expect(linkElement[0]).toHaveTextContent('Already have an account? Log In');
    });

    // test('link correctly redirects to <LogIn />', async () => {
    //     render(<RouterProvider router={memoryRouter}></RouterProvider>);
    //     const linkElement = screen.getByRole('link');
    //     fireEvent.click(linkElement);
    //     const location = useLocation();
    //     expect(location.pathname).toBe('/login')
    // });
});
