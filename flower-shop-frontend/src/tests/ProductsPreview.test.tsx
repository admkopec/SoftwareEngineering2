import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductsPreview from '../components/ProductsPreview';

describe('<Products Preview />', () => {

    test('renders title text', () => {
      render(<ProductsPreview />);
      const textElement = screen.getByText('Classic Bouquets');
      expect(textElement).toBeInTheDocument();
    });

    test('renders a list with items', () => {
      render(<ProductsPreview />);
      const listElement = screen.getAllByRole('list');
      expect(listElement[0]).toBeInTheDocument();
      const listItemsArray = screen.getAllByRole('listitem');
      expect(listItemsArray.length).toBeGreaterThanOrEqual(1);
    });      
});