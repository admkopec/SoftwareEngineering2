import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SplitButton from '../components/SplitButton';
import { authButtons } from '../components/Header';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { routes } from '../pages/Router';

const memoryRouter = createMemoryRouter(routes, {
    initialEntries: ['/'],
    initialIndex: 1
  });  

describe('<SplitButton />', () => {

    test('SplitButton renders two related buttons', () => {
        render(<RouterProvider router={memoryRouter} />);
        const btn1Element = screen.getByTitle('split button');
        expect(btn1Element).toBeInTheDocument();
        const btn2Element = screen.getByTitle('action auth button');
        expect(btn2Element).toBeInTheDocument();
    });
});
