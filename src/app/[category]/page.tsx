import CollectionGrid from '@/components/CollectionGrid'

export function generateStaticParams() {
  return [{ category: 'organic' }, { category: 'inorganic' }]
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  // Validate category
  if (params.category !== 'organic' && params.category !== 'inorganic') {
    return <div>Category not found</div>
  }

  return (
    <CollectionGrid 
      category={params.category as 'organic' | 'inorganic'} 
    />
  )
}
