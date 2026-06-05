'use client';

import { useMemo, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';

import { branchDirectory } from '@/lib/branch-directory';
import { useAuthStore } from '@/lib/stores/auth-store';

type LoginState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; message: string };

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

  const login = useAuthStore((s) => s.login);

  const canSubmit = useMemo(() => identifier.trim().length > 0 && password.trim().length > 0, [identifier, password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      const msg = 'Identitas dan kata sandi wajib diisi.';
      setState({ status: 'error', message: msg });
      toast.error(msg);
      return;
    }

    setState({ status: 'loading' });

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, branchCode })
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        const msg = payload.error?.message ?? 'Autentikasi gagal.';
        setState({ status: 'error', message: msg });
        toast.error(msg);

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          if (retryAfter) {
            toast.error(`Silakan coba lagi dalam ${retryAfter} detik.`);
          }
        }
        return;
      }

      const { user, branch, session } = payload.data;

      login(
        {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          branchId: session.branchId,
          branchName: branch.name,
          branchCode: branch.code,
          roleCodes: session.roleCodes,
          permissions: session.permissions
        },
        session.sessionId
      );

      const msg = `Masuk berhasil. Selamat datang, ${user.fullName}!`;
      setState({ status: 'success', message: msg });
      toast.success(msg);
    } catch {
      const msg = 'Gagal menghubungi server autentikasi.';
      setState({ status: 'error', message: msg });
      toast.error(msg);
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
