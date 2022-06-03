import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';
import { addData, processSheet, lookupRef, otherSheet } from './utils';

const fs = require('fs');

jest.mock('axios');

const d1 = JSON.parse(fs.readFileSync('public/mainstream.json', 'utf-8'));
const d2 = JSON.parse(fs.readFileSync('public/community.json', 'utf-8'));
const shp = JSON.parse(fs.readFileSync('public/map.json', 'utf-8'));

describe('App component', () => {
  afterAll(() => {
    cleanup();
    jest.clearAllMocks();
  });

  beforeAll(() => {
    axios.spread = jest.fn();

    axios.all = () => Promise.all([
      jest.fn()
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: d1
        })),
      jest.fn()
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: d2
        })),

      jest.fn()
        .mockImplementationOnce(() => Promise.resolve({
          status: 200,
          data: shp
        }))
    ])
    .then((...responses) => {
      console.log(responses);
    })

    // Spy on spread method so that we can wait for it to be called.
    jest.spyOn(axios, 'spread');
  });

  test('it fetches data from json', async () => {
    render(<App />);
    await waitFor(() => {
      expect(axios.spread).toHaveBeenCalledTimes(1);
      // console.log(responses)
      // need to add processing
    });
    // await waitFor(() => expect(response[0]).toEqual(processSheet(d1.data)));
  });
});


// // test('it builds the map', async () => {
// //   render(<App />); 

// //   // Hopefully runs onlyafter app renders.
// //     await waitFor(() => { 
// //       screen.debug(); //nope. nothing shows up but <body><div /></body>
// //       expect(screen.findByTestId('map')).toBeInTheDocument(); 
// //     });
// // })