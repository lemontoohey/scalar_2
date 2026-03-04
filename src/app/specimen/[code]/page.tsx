import { SPECIMEN_DATA } from '@/lib/specimens'
import SpecimenDetail from '@/components/SpecimenDetail'

export function generateStaticParams() {
  return SPECIMEN_DATA.map((s) => ({
    code: s.code,
  }))
}

export default function SpecimenPage({ params }: { params: { code: string } }) {
  const specimen = SPECIMEN_DATA.find((s) => s.code === params.code)

  if (!specimen) {
    return <div>Specimen not found</div>
  }

  return (
    <SpecimenDetail specimen={specimen} />
  )
}
