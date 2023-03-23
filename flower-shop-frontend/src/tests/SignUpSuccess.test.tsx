import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import SignUpSuccess from '../components/SignUpSuccess';

describe('<LogIn /> ', () => {
    test('contains all input fields', () => {
        render(<SignUpSuccess />);
        
    });
});