import { screen } from '@testing-library/react';
import render from '../utils/renderWithRouter';
import { orderPageRoute } from '../pages/Router';
import Basket from '../components/Basket';
import BasketList from '../components/BasketList';

describe('<Basket />', () => {
  test('renders proceed to checkout button', () => {
    render(<Basket />, { route: orderPageRoute.path });
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });
  test('renders a list that contains items', () => {
    render(<Basket />, { route: orderPageRoute.path });
    render(<BasketList dense={true}/>, { route: orderPageRoute.path });
    const listElement = screen.getByRole('basket-list');
    expect(listElement).toBeInTheDocument();
    // TODO: mock items in listElement
  });
});