import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logo from '../components/Logo';
import {renderWithRouter} from "../utils/renderWithRouter";
import ProductsPreview from "../components/ProductsPreview";
import {homePageRoute} from "../pages/Router";

describe('<Logo />', () => {

    test('Logo renders Flower Shop text', () => {
      renderWithRouter(<Logo />, {route: homePageRoute.path});
      const linkElement = screen.getByText('Flower Shop');
      expect(linkElement).toBeInTheDocument();
    });

    test('Logo renders an icon', () => {
        renderWithRouter(<Logo />, {route: homePageRoute.path});
        const linkElement = screen.getByTitle('flower-icon');
        expect(linkElement).toBeInTheDocument();
      });      
});
