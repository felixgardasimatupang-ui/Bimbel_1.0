'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        <main className="notFoundPage">
          <div className="notFoundCard">
            <p className="notFoundCode">500</p>
            <h2 className="sectionTitle">Kesalahan Kritis</h2>
            <p className="sectionLead">
              Terjadi kesalahan kritis pada aplikasi. Silakan muat ulang halaman.
            </p>
            <button className="primaryButton" onClick={reset} type="button">
              Muat Ulang
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
