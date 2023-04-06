import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SplitButton from '../components/SplitButton';
import { authButtons } from '../pages/HomePage';
import { RouterProvider } from 'react-router-dom';
import router from '../pages/Router';

describe('<SplitButton />', () => {

    test('SplitButton renders two related buttons', () => {
        render(<RouterProvider router={router} />);
        const btn1Element = screen.getByTitle('split button');
        expect(btn1Element).toBeInTheDocument();
        const btn2Element = screen.getByTitle('action auth button');
        expect(btn2Element).toBeInTheDocument();
    });

    test('SplitButton has buttons with \'Log In\' and \'Sign Up\'', () => {
        render(<RouterProvider router={router} />);
        const logInElement = screen.getByText('Log In');
        fireEvent.click(logInElement);
        expect(logInElement).toBeInTheDocument();
        const signUpElement = screen.getByText('Sign Up');
        expect(signUpElement).toBeInTheDocument();
    });    
});
