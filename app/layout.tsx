import type { Metadata } from 'next'
import { Archivo, Archivo_Narrow } from 'next/font/google'
import ThermalCursor from '@/components/ThermalCursor'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-archivo',
  display: 'swap',
})

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo-narrow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Scalar Materials | Architecture of Light',
  description: 'A materials science house engineering high-performance coatings.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${archivo.variable} ${archivoNarrow.variable} font-sans bg-black`}>
        <ThermalCursor />
        {children}
      </body>
    </html>
  )
}
