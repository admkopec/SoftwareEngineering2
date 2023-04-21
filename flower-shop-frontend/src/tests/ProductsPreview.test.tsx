import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductsPreview from '../components/ProductsPreview';
import {renderWithRouter} from "../utils/renderWithRouter";
import {homePageRoute, signUpPageRoute} from "../pages/Router";

// TODO: Need to implement Mock Server for API calls
describe('<ProductsPreview />', () => {

    test('renders title text', () => {
      renderWithRouter(<ProductsPreview tag='Classic Bouquets'/>, {route: homePageRoute.children.at(1)?.path});
      const textElement = screen.getByText('Classic Bouquets');
      expect(textElement).toBeInTheDocument();
    });

    test('renders a list with items', () => {
      renderWithRouter(<ProductsPreview tag='Flower'/>, {route: homePageRoute.children.at(1)?.path});
      const listElement = screen.getAllByRole('list');
      expect(listElement[0]).toBeInTheDocument();
      const listItemsArray = screen.getAllByRole('listitem');
      expect(listItemsArray.length).toBeGreaterThanOrEqual(1);
    });
});