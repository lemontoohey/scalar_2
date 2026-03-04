import { SPECIMEN_DATA } from '@/lib/specimens'
import SpecimenDetail from '@/components/SpecimenDetail'

export function generateStaticParams() {
  return SPECIMEN_DATA.map((s) => ({
    code: s.code,
  }))
}

export default async function SpecimenPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = await params;
  const specimen = SPECIMEN_DATA.find((s) => s.code === resolvedParams.code)

  if (!specimen) {
    return <div>Specimen not found</div>
  }

  return <SpecimenDetail specimen={specimen} />
}
