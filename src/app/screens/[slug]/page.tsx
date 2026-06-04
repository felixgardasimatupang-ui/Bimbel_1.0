import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { ScreenPanel } from '@/components/screen-panels';
import { screenMap, screens } from '@/lib/screens';

export function generateStaticParams() {
  return screens.map((screen) => ({ slug: screen.slug }));
}

type ScreenPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ScreenPageProps): Promise<Metadata> {
  const { slug } = await params;
  const screen = screenMap.get(slug);

  if (!screen) {
    return {};
  }

  return {
    title: `${screen.title} | Bimbel One Platform`,
    description: screen.subtitle
  };
}

export default async function ScreenPage({ params }: ScreenPageProps) {
  const { slug } = await params;
  const screen = screenMap.get(slug);

  if (!screen) {
    notFound();
  }

  return (
    <AppShell
      activeSlug={screen.slug}
      currentScreen={screen}
      title={screen.title}
      description={screen.subtitle}
    >
      <ScreenPanel screen={screen} />
    </AppShell>
  );
}
