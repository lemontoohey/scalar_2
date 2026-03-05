import { SPECIMEN_DATA } from '@/lib/specimens'
import SpecimenDetail from '@/components/SpecimenDetail'

export function generateStaticParams() {
  return SPECIMEN_DATA.map((s) => ({
    code: s.code,
  }))
}

export default async function SpecimenPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = await params;
  const decodedCode = decodeURIComponent(resolvedParams.code);
  const specimen = SPECIMEN_DATA.find((s) => s.code === decodedCode)

  if (!specimen) {
    return <div className="text-white pt-20 text-center">Specimen not found: {decodedCode}</div>
  }

  return <SpecimenDetail specimen={specimen} />
}
