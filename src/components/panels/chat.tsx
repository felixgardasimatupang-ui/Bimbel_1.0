import type { ReactNode } from 'react';
import { SectionCard, SimpleList, Badge } from './shared';

type ChatMessage = {
  author: string;
  role: 'agent' | 'customer';
  time: string;
  body: string;
};

export function ChatPanel() {
  const messages: ChatMessage[] = [
    { author: 'Mira', role: 'customer', time: '09:12', body: 'Halo, saya tidak bisa masuk ke portal kelas.' },
    { author: 'Ayu', role: 'agent', time: '09:13', body: 'Baik, saya cek dulu data cabang dan akun siswa Anda.' },
    { author: 'Mira', role: 'customer', time: '09:15', body: 'Saya sudah kirim nomor student ID dan screenshot error.' }
  ];

  return (
    <section className="screenPanel">
      <div className="twoColLayout chatLayout">
        <SectionCard title="Percakapan realtime" lead="Percakapan aktif dengan pelanggan atau orang tua.">
          <div className="chatThread">
            {messages.map((message) => (
              <article key={`${message.author}-${message.time}`} className={`chatBubble chatBubble${message.role === 'agent' ? 'Agent' : 'Customer'}`}>
                <div className="chatBubbleMeta">
                  <strong>{message.author}</strong>
                  <span>{message.time}</span>
                </div>
                <p>{message.body}</p>
              </article>
            ))}
          </div>
          <div className="composer">
            <span>Tulis balasan...</span>
            <Badge tone="info">Terjemahan otomatis aktif</Badge>
          </div>
        </SectionCard>
        <SectionCard title="Panel kehadiran" lead="Tim yang sedang daring dan siap menanggapi.">
          <SimpleList items={[
            { title: 'Ayu Santika', meta: 'Agen senior · daring', tone: 'success' as const, extra: '2 chat' },
            { title: 'Rizky Pratama', meta: 'Agen dukungan · tidak aktif', tone: 'warning' as const, extra: '1 chat' },
            { title: 'Nadia Putri', meta: 'Supervisor · daring', tone: 'info' as const, extra: 'Tinjau' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
