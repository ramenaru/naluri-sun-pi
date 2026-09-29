import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function mockFetch(response: () => Promise<Response>) {
  vi.stubGlobal('fetch', vi.fn(response));
}

const jsonResponse = (body: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status }));

describe('App', () => {
  it('shows pi and the circumference', async () => {
    mockFetch(() => jsonResponse({ pi: '3.14', decimals: 2, updatedAt: '2026-01-01' }));
    render(<App />);

    expect(await screen.findByText('Pi known to 2 decimal places')).toBeTruthy();
    expect(screen.getByText('4,368,996.00 km')).toBeTruthy();
  });

  it('shows an error when the server is down', async () => {
    mockFetch(() => Promise.reject(new Error('network down')));
    render(<App />);

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Cannot reach the server');
  });

  it('shows an error when the server returns 500', async () => {
    mockFetch(() => jsonResponse({ error: 'oops' }, 500));
    render(<App />);

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('server returned 500');
  });
});
