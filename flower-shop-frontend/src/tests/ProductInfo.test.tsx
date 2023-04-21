import {screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {renderWithRouter} from "../utils/renderWithRouter";
import {homePageRoute} from "../pages/Router";
import ProductInfo from "../components/ProductInfo";

describe('<ProductInfo />', () => {

  test('renders breadcrumbs', () => {
    renderWithRouter(<ProductInfo />, {route: homePageRoute.children[2].path});
    const homeText = screen.getByText('Home');
    const productsText = screen.getByText('Products');
    expect(homeText).toBeInTheDocument();
    expect(productsText).toBeInTheDocument();
  });

  test('renders image component', () => {
    renderWithRouter(<ProductInfo />, {route: homePageRoute.children[2].path});
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
  });

  test('renders button components', () => {
    renderWithRouter(<ProductInfo />, {route: homePageRoute.children[2].path});
    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements).toHaveLength(4);
    buttonElements.forEach((btnEl) => {
      expect(btnEl).toBeInTheDocument();
    });
  });

  test('renders details and overview subsections', () => {
    renderWithRouter(<ProductInfo />, {route: homePageRoute.children[2].path});
    const detailsText = screen.getByTestId('details');
    const overviewText = screen.getByTestId('overview');
    expect(detailsText).toBeInTheDocument();
    expect(detailsText).toHaveTextContent('Details');
    expect(overviewText).toBeInTheDocument();
    expect(overviewText).toHaveTextContent('Overview');
  });

});