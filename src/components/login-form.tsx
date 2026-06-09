'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

import { branchDirectory } from '@/lib/branch-directory';
import { useAuthStore } from '@/lib/stores/auth-store';

type LoginState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; message: string };

type MfaData = {
  challengeId: string;
  otpauth: string;
  currentCode: string;
  pendingUser: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  pendingBranch: {
    name: string;
    code: string;
  };
  pendingRoles: string[];
  pendingPermissions: string[];
};

const demoCredentials = [
  { label: 'admin@bimbel.one', password: 'Admin123!', branch: 'HQ-01', mfa: 'Ya (lihat secret di form)' },
  { label: 'finance@bimbel.one', password: 'Finance123!', branch: 'HQ-01', mfa: 'Ya (lihat secret di form)' },
  { label: 'ayu@bimbel.one', password: 'Tutor123!', branch: 'BDG-01', mfa: 'Tidak' }
];

export function LoginForm() {
  const [identifier, setIdentifier] = useState('admin@bimbel.one');
  const [password, setPassword] = useState('Admin123!');
  const [branchCode, setBranchCode] = useState('HQ-01');
  const [state, setState] = useState<LoginState>({ status: 'idle' });
  const [mfaData, setMfaData] = useState<MfaData | null>(null);
  const [mfaCode, setMfaCode] = useState('');

  const login = useAuthStore((s) => s.login);
  const canSubmit = identifier.trim().length > 0 && password.trim().length > 0;

  function getRedirectUrl(): string {
    if (typeof window === 'undefined') return '/';
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || '/';
  }

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

      if (payload.data.mfaRequired) {
        setMfaData({
          challengeId: payload.data.challengeId,
          otpauth: payload.data.otpauth,
          currentCode: payload.data.currentCode,
          pendingUser: payload.data.pendingUser,
          pendingBranch: payload.data.pendingBranch,
          pendingRoles: payload.data.pendingRoles,
          pendingPermissions: payload.data.pendingPermissions,
        });
        setMfaCode(payload.data.currentCode);
        setState({ status: 'idle' });
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

      toast.success(`Masuk berhasil. Selamat datang, ${user.fullName}!`);
      window.location.href = getRedirectUrl();
    } catch {
      const msg = 'Gagal terhubung. Periksa koneksi Anda.';
      setState({ status: 'error', message: msg });
      toast.error(msg);
    }
  }

  async function handleMfaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!mfaCode.trim()) {
      toast.error('Kode verifikasi wajib diisi.');
      return;
    }

    setState({ status: 'loading' });

    try {
      const response = await fetch('/api/v1/auth/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: mfaData!.challengeId, token: mfaCode })
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        const msg = payload.error?.message ?? 'Verifikasi MFA gagal.';
        setState({ status: 'error', message: msg });
        toast.error(msg);
        return;
      }

      login(
        {
          id: payload.data.userId,
          fullName: mfaData!.pendingUser.fullName,
          email: mfaData!.pendingUser.email,
          phone: mfaData!.pendingUser.phone,
          branchId: payload.data.branchId,
          branchName: mfaData!.pendingBranch.name,
          branchCode: mfaData!.pendingBranch.code,
          roleCodes: payload.data.roleCodes,
          permissions: payload.data.permissions
        },
        payload.data.sessionId
      );

      setMfaData(null);
      setMfaCode('');

      toast.success(`Masuk berhasil. Selamat datang, ${mfaData!.pendingUser.fullName}!`);
      window.location.href = getRedirectUrl();
    } catch {
      const msg = 'Gagal terhubung. Periksa koneksi Anda.';
      setState({ status: 'error', message: msg });
      toast.error(msg);
    }
  }

  function cancelMfa() {
    setMfaData(null);
    setMfaCode('');
    setState({ status: 'idle' });
  }

  const qrCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mfaData?.otpauth && qrCanvas.current) {
      QRCode.toCanvas(qrCanvas.current, mfaData.otpauth, {
        width: 180,
        margin: 2,
        color: { dark: '#1e293b', light: '#ffffff' },
      });
    }
  }, [mfaData?.otpauth]);

  useEffect(() => {
    if (!mfaData) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/auth/mfa/code?challengeId=${mfaData.challengeId}`);
        const json = await res.json();
        if (json.success) {
          setMfaCode(json.data.code);
        }
      } catch {
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [mfaData]);

  if (mfaData) {
    const secret = mfaData.otpauth
      ? (new URLSearchParams(mfaData.otpauth.split('?')[1]).get('secret') ?? '')
      : '';

    return (
      <div className="loginGrid">
        <form className="authCard" onSubmit={handleMfaSubmit} aria-label="Form MFA">
          <div className="authCardHeader">
            <p className="eyebrow">Verifikasi Dua Langkah</p>
            <h2 className="sectionTitle">Masukkan kode autentikasi</h2>
            <p className="sectionLead">
              Kode di bawah sudah terisi otomatis. Klik <strong>Verifikasi</strong> untuk masuk.
            </p>
          </div>

          <div className="mfaCurrentCode">
            <p className="sidebarLabel">Kode saat ini</p>
            <p className="mfaCodeDisplay">{mfaData.currentCode}</p>
          </div>

          <label className="field">
            <span>Kode 6 digit</span>
            <input
              type="text"
              value={mfaCode}
              onChange={(event) => setMfaCode(event.target.value)}
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
              aria-label="Kode verifikasi 6 digit"
            />
          </label>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="primaryButton authButton"
              type="submit"
              disabled={state.status === 'loading' || mfaCode.trim().length < 6}
              aria-label="Verifikasi kode"
            >
              {state.status === 'loading' ? 'Memverifikasi...' : 'Verifikasi'}
            </button>
            <button
              type="button"
              className="filterChip"
              onClick={cancelMfa}
              disabled={state.status === 'loading'}
            >
              Batal
            </button>
          </div>

          <details style={{ marginTop: 16 }}>
            <summary style={{ cursor: 'pointer', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
              Cara lain: pindai QR atau masukkan kode secret
            </summary>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              {mfaData.otpauth ? (
                <>
                  <canvas ref={qrCanvas} />
                  <div className="mfaSecretBox">
                    <p className="sidebarLabel">Kode secret</p>
                    <code className="mfaSecret">{secret}</code>
                  </div>
                </>
              ) : null}
            </div>
          </details>

          {state.status === 'success' ? <p className="notice noticeSuccess" role="status">{state.message}</p> : null}
          {state.status === 'error' ? <p className="notice noticeError" role="alert">{state.message}</p> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="loginGrid">
      <form className="authCard" onSubmit={handleSubmit} aria-label="Form login">
        <div className="authCardHeader">
          <div>
            <p className="eyebrow">Autentikasi</p>
            <h2 className="sectionTitle">Masuk ke Bimbel One Platform</h2>
            <p className="sectionLead">
              Masukkan kredensial akun Anda untuk masuk ke platform.
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
            aria-label="Email atau nomor telepon"
          />
        </label>

        <label className="field">
          <span>Kata sandi</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Kata sandi akun"
            aria-label="Kata sandi akun"
          />
        </label>

        <label className="field">
          <span>Cabang</span>
          <select value={branchCode} onChange={(event) => setBranchCode(event.target.value)} aria-label="Pilih cabang">
            {branchDirectory.map((branch) => (
              <option key={branch.code} value={branch.code}>
                {branch.code} - {branch.name}
              </option>
            ))}
          </select>
        </label>

        <button className="primaryButton authButton" type="submit" disabled={!canSubmit || state.status === 'loading'} aria-label={state.status === 'loading' ? 'Memproses login' : 'Masuk ke platform'}>
          {state.status === 'loading' ? 'Memproses...' : 'Masuk'}
        </button>

        {state.status === 'success' ? <p className="notice noticeSuccess" role="status">{state.message}</p> : null}
        {state.status === 'error' ? <p className="notice noticeError" role="alert">{state.message}</p> : null}
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
              <span>MFA: {item.mfa}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
