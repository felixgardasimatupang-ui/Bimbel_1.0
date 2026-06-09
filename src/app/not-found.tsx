import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="notFound">
      <p className="eyebrow">404</p>
      <h1 className="pageTitle">Layar tidak ditemukan</h1>
      <p className="pageLead">Halaman yang diminta tidak ditemukan.</p>
      <Link className="primaryButton" href="/">
        Kembali ke dasbor
      </Link>
    </main>
  );
}
