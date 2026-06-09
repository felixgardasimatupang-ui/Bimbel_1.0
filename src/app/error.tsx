'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root error boundary caught:', error);
  }, [error]);

  return (
    <main className="notFoundPage">
      <div className="notFoundCard">
        <p className="notFoundCode">500</p>
        <h2 className="sectionTitle">Terjadi Kesalahan</h2>
        <p className="sectionLead">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
        </p>
        <button className="primaryButton" onClick={reset} type="button">
          Coba Lagi
        </button>
      </div>
    </main>
  );
}
