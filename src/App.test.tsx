import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </MemoryRouter>
  );

test('the landing page offers all three intro experiences', () => {
  renderAt('/');
  expect(screen.getByText('SELECT EXPERIENCE')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'VHS Tape intro' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Tube TV intro' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'DVD intro' })).toBeInTheDocument();
});

test('picking DVD plays the disc intro', () => {
  renderAt('/');
  fireEvent.click(screen.getByRole('button', { name: 'DVD intro' }));
  expect(screen.getByText('CLICK TO SKIP')).toBeInTheDocument();
});

test('/work skips the intro and opens the Work panel', () => {
  renderAt('/work');
  expect(screen.queryByText('SELECT EXPERIENCE')).not.toBeInTheDocument();
  expect(screen.getByRole('dialog', { name: 'WORK' })).toBeInTheDocument();
});
