import { Suspense } from 'react'
import { SPECIMEN_DATA } from '@/lib/specimens'
import ShopScreen from '@/components/ShopScreen'

export function generateStaticParams() {
  return SPECIMEN_DATA.map((s) => ({
    code: s.code,
  }))
}

export default function ShopPage({ params }: { params: { code: string } }) {
  const specimen = SPECIMEN_DATA.find((s) => s.code === params.code)

  if (!specimen) {
    return <div>Specimen not found</div>
  }

  return (
    <Suspense fallback={<div className="text-white text-center pt-20">Loading...</div>}>
      <ShopScreen specimen={specimen} />
    </Suspense>
  )
}
