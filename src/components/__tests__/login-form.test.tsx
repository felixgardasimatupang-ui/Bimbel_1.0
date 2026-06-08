// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { LoginForm } from '@/components/login-form';

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('LoginForm', () => {
  it('renders form title', () => {
    render(<LoginForm />);
    expect(screen.getByText('Masuk ke Bimbel One Platform')).toBeInTheDocument();
  });

  it('renders identifier input with default value', () => {
    render(<LoginForm />);
    const input = screen.getByPlaceholderText('Email atau nomor telepon') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('admin@bimbel.one');
  });

  it('renders password input', () => {
    render(<LoginForm />);
    const input = screen.getByPlaceholderText('Kata sandi akun') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('password');
  });

  it('renders branch select with options', () => {
    render(<LoginForm />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.options.length).toBeGreaterThanOrEqual(4);
  });

  it('renders submit button', () => {
    render(<LoginForm />);
    const button = screen.getByRole('button', { name: /masuk/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders demo credentials section', () => {
    render(<LoginForm />);
    expect(screen.getByText('Akun uji untuk evaluasi')).toBeInTheDocument();
    expect(screen.getByText('admin@bimbel.one')).toBeInTheDocument();
    expect(screen.getByText('finance@bimbel.one')).toBeInTheDocument();
    expect(screen.getByText('ayu@bimbel.one')).toBeInTheDocument();
  });

  it('shows loading state on submit', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(<LoginForm />);
    const button = screen.getByRole('button', { name: /masuk/i });
    fireEvent.click(button);

    expect(await screen.findByText('Memproses...')).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ success: false, error: { message: 'Kredensial tidak valid.' } }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    );

    render(<LoginForm />);
    const button = screen.getByRole('button', { name: /masuk/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Kredensial tidak valid.')).toBeInTheDocument();
    });
  });
});
