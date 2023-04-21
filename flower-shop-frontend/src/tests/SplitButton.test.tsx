import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import {homePageRoute, routes} from '../pages/Router';
import {renderWithRouter} from "../utils/renderWithRouter";
import SplitButton from "../components/SplitButton";
import {authButtons} from "../components/Header";

describe('<SplitButton />', () => {
    test('SplitButton renders two related buttons', () => {
        renderWithRouter(<SplitButton options={authButtons} sx={{}}/>, {route: homePageRoute.path})
        const btn1Element = screen.getByTitle('split button');
        expect(btn1Element).toBeInTheDocument();
        const btn2Element = screen.getByTitle('action auth button');
        expect(btn2Element).toBeInTheDocument();
    });
});
