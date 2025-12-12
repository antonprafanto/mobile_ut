import { modules } from '@/data/modules';
import ModulePageClient from './ModulePageClient';

// Generate static params for all modules
export function generateStaticParams() {
  return modules.map((module) => ({
    slug: module.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModulePage({ params }: PageProps) {
  const { slug } = await params;
  return <ModulePageClient slug={slug} />;
}
