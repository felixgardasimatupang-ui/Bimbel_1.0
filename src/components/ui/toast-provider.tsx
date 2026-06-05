'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(15, 25, 43, 0.96)',
          color: '#eaf1ff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          fontSize: '0.92rem'
        },
        success: {
          iconTheme: { primary: '#35d0b7', secondary: '#07101d' }
        },
        error: {
          iconTheme: { primary: '#ff7d7d', secondary: '#07101d' }
        }
      }}
    />
  );
}
