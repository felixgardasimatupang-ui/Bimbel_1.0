'use client';

import { useMemo, useState, type FormEvent } from 'react';

import { branchDirectory } from '@/lib/branch-directory';

type LoginState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

const demoCredentials = [
  { label: 'admin@bimbel.one', password: 'Admin123!', branch: 'HQ-01' },
  { label: 'finance@bimbel.one', password: 'Finance123!', branch: 'HQ-01' },
  { label: 'ayu@bimbel.one', password: 'Tutor123!', branch: 'BDG-01' }
];

export function LoginForm() {
  const [identifier, setIdentifier] = useState('admin@bimbel.one');
  const [password, setPassword] = useState('Admin123!');
  const [branchCode, setBranchCode] = useState('HQ-01');
  const [state, setState] = useState<LoginState>({ status: 'idle' });

  const canSubmit = useMemo(() => identifier.trim().length > 0 && password.trim().length > 0, [identifier, password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setState({ status: 'error', message: 'Identitas dan kata sandi wajib diisi.' });
      return;
    }

    setState({ status: 'loading' });

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier,
          password,
          branchCode
        })
      });

      const payload = (await response.json()) as
        | { success: true; data: { user: { fullName: string }; branch: { name: string }; session: { sessionId: string } } }
        | { success: false; error?: { message?: string } };

      if (!response.ok || !payload.success) {
        setState({
          status: 'error',
          message: payload.success ? 'Autentikasi gagal.' : payload.error?.message ?? 'Autentikasi gagal.'
        });
        return;
      }

      setState({
        status: 'success',
        message: `Masuk berhasil untuk ${payload.data.user.fullName} di ${payload.data.branch.name}. Sesi ${payload.data.session.sessionId} dibuat.`
      });
    } catch {
      setState({
        status: 'error',
        message: 'Gagal menghubungi server autentikasi.'
      });
    }
  }

  return (
    <div className="loginGrid">
      <form className="authCard" onSubmit={handleSubmit}>
        <div className="authCardHeader">
          <div>
            <p className="eyebrow">Autentikasi</p>
            <h2 className="sectionTitle">Masuk ke Bimbel One Platform</h2>
            <p className="sectionLead">
              Form ini terhubung ke kontrak API `/api/v1/auth/login` dan tetap sederhana agar mudah dipahami.
            </p>
          </div>
        </div>

        <label className="field">
          <span>Identitas</span>
          <input
            type="text"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Email atau nomor telepon"
          />
        </label>

        <label className="field">
          <span>Kata sandi</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Kata sandi akun"
          />
        </label>

        <label className="field">
          <span>Cabang</span>
          <select value={branchCode} onChange={(event) => setBranchCode(event.target.value)}>
            {branchDirectory.map((branch) => (
              <option key={branch.code} value={branch.code}>
                {branch.code} - {branch.name}
              </option>
            ))}
          </select>
        </label>

        <button className="primaryButton authButton" type="submit" disabled={!canSubmit || state.status === 'loading'}>
          {state.status === 'loading' ? 'Memproses...' : 'Masuk'}
        </button>

        {state.status === 'success' ? <p className="notice noticeSuccess">{state.message}</p> : null}
        {state.status === 'error' ? <p className="notice noticeError">{state.message}</p> : null}
      </form>

      <aside className="authCard supportCard">
        <p className="eyebrow">Kredensial demo</p>
        <h3 className="panelTitle">Akun uji untuk evaluasi</h3>
        <ul className="credentialList">
          {demoCredentials.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              <span>Kata sandi: {item.password}</span>
              <span>Cabang: {item.branch}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
