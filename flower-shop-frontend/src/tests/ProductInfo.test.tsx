import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderWithRouter from '../utils/renderWithRouter';
import { productInfoSubPageRoute } from '../pages/Router';
import ProductInfo from '../components/ProductInfo';
import * as Flowers from '../mocks/products-flowers.json';

describe('<ProductInfo />', () => {
  test('renders breadcrumbs', () => {
    renderWithRouter(<ProductInfo />, {
      route: productInfoSubPageRoute.path.replace(":productID", Flowers[0].id) });
    const homeText = screen.getByText('Home');
    const productsText = screen.getByText('Products');
    expect(homeText).toBeInTheDocument();
    expect(productsText).toBeInTheDocument();
  });

  test('renders image component', () => {
    renderWithRouter(<ProductInfo />, { route: productInfoSubPageRoute.path.replace(":productID", Flowers[0].id) });
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
  });

  test('renders button components', () => {
    renderWithRouter(<ProductInfo />, { route: productInfoSubPageRoute.path.replace(":productID", Flowers[0].id) });
    const buttonElements = screen.getAllByRole('button');
    // if user is not admin, expect 2 buttons
    expect(buttonElements).toHaveLength(2);
    buttonElements.forEach((btnEl) => {
      expect(btnEl).toBeInTheDocument();
    });
  });

  test('renders details and overview subsections', () => {
    renderWithRouter(<ProductInfo />, { route: productInfoSubPageRoute.path.replace(":productID", Flowers[0].id) });
    const detailsText = screen.getByRole('details-headline');
    const overviewText = screen.getByRole('overview-headline');
    expect(detailsText).toBeInTheDocument();
    expect(detailsText).toHaveTextContent('Details');
    expect(overviewText).toBeInTheDocument();
    expect(overviewText).toHaveTextContent('Overview');
  });
});
