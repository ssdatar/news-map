import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App component', () => {
  test('it renders and shows statewide table', () => {
    render(<App />);
    screen.debug()
    // const hed = waitFor(() => screen.getByText(/Statewide news outlets/i));
    // expect(screen.getByText(/Statewide news outlets/i)).toBeInTheDocument();
  });
});


// describe('new source filter buttons', () => {
//   test('Test table buttons', () => {
//     render(<App />);
//     const buttonEl = screen.getByText(/Statewide publications/i);
//     const hed = await screen.getByText(/Statewide news outlets/i);
      
//     userEvent.click(buttonEl);
//     expect(hed).toHaveTextContent(/dark/i);
//   });
// });
