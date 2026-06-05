import { MetricCard, SectionCard, CardGrid, SimpleList } from './shared';

export function SchedulePanel() {
  const schedule = [
    ['14:00', 'Matematika Kelas 10', 'Fisika Kelas 12', '', 'Biologi Kelas 11', ''],
    ['16:00', '', 'Kimia Kelas 12', 'Matematika Kelas 9', '', 'Bahasa Inggris Kelas 10'],
    ['18:00', 'Klub membaca', '', 'Klinik esai', 'Tinjauan mentor', '']
  ];

  return (
    <section className="screenPanel">
      <div className="metricGrid metricGrid3">
        <MetricCard label="Kelas hari ini" value="18" note="Slot aktif pada semua cabang" tone="info" />
        <MetricCard label="Bentrok ruang" value="0" note="Tidak ada bentrok jadwal yang aktif" tone="success" />
        <MetricCard label="Cakupan tutor" value="96%" note="Cakupan tutor untuk minggu ini" tone="warning" />
      </div>
      <SectionCard title="Jadwal kelas mingguan" lead="Tampilan ringkas untuk memeriksa slot, tutor, dan ruang.">
        <div className="scheduleGrid">
          <div className="scheduleHeadRow">
            <span /><span>Sen 12</span><span className="isActive">Sel 13</span><span>Rab 14</span><span>Kam 15</span><span>Jum 16</span>
          </div>
          {schedule.map((row) => (
            <div key={row[0]} className="scheduleRow">
              <span className="scheduleTime">{row[0]}</span>
              {row.slice(1).map((cell, index) => (
                <div key={`${row[0]}-${index}`} className={cell ? 'scheduleSlot scheduleSlotFilled' : 'scheduleSlot'}>
                  {cell ? <strong>{cell}</strong> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>
      <div className="twoColLayout">
        <SectionCard title="Kelas berikutnya" lead="Agenda berikutnya yang paling dekat.">
          <CardGrid columns={2} items={[
            { badge: '14:30', title: 'Fisika Kelas 12', meta: 'Ruang C, Ibu Siti', tone: 'info' },
            { badge: '15:45', title: 'Kimia Kelas 11', meta: 'Lab 1, Pak Yanto', tone: 'warning' },
            { badge: '17:00', title: 'Matematika Kelas 9', meta: 'Ruang D, Pak Budi', tone: 'success' },
            { badge: '18:30', title: 'Klinik Bahasa Inggris', meta: 'Ruang A, Bu Jane', tone: 'info' }
          ]} />
        </SectionCard>
        <SectionCard title="Alokasi ruangan" lead="Ketersediaan dan pemakaian ruangan.">
          <SimpleList items={[
            { title: 'Ruang A', meta: '2 kelas terjadwal', tone: 'success' as const, extra: 'Tersedia' },
            { title: 'Ruang B', meta: '1 kelas diblokir untuk perawatan', tone: 'warning' as const, extra: 'Perawatan' },
            { title: 'Lab 1', meta: 'Penuh untuk jalur sains', tone: 'danger' as const, extra: 'Penuh' }
          ]} />
        </SectionCard>
      </div>
    </section>
  );
}
