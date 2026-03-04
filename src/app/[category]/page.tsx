import CollectionGrid from '@/components/CollectionGrid'

export function generateStaticParams() {
  return [{ category: 'organic' }, { category: 'inorganic' }]
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  
  if (resolvedParams.category !== 'organic' && resolvedParams.category !== 'inorganic') {
    return <div>Category not found</div>
  }

  return <CollectionGrid category={resolvedParams.category as 'organic' | 'inorganic'} />
}
