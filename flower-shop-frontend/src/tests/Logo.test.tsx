import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logo from '../components/Logo';

describe('<Logo />', () => {

    test('Logo renders Flower Shop text', () => {
      render(<Logo />);

      const linkElement = screen.getByText('Flower Shop');
      expect(linkElement).toBeInTheDocument();
    });

    test('Logo renders an icon', () => {
        render(<Logo />);
        const linkElement = screen.getByTitle('flower-icon');
        expect(linkElement).toBeInTheDocument();
      });      
});
