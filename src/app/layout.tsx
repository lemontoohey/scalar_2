import type { Metadata } from 'next'
import { Archivo, Archivo_Narrow } from 'next/font/google'
import './globals.css'
import ThermalCursor from '@/components/ThermalCursor'
import { ColorProvider } from '@/context/ColorContext'

const archivo = Archivo({ 
  subsets: ['latin'],
  variable: '--font-archivo',
})

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  variable: '--font-archivo-narrow',
})

export const metadata: Metadata = {
  title: 'SCALAR',
  description: 'Ordinance of depth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${archivoNarrow.variable}`}>
      <body className="bg-[#030F08] text-[#FCFBF8]">
        {/* Global Liquid Glass SVG Filter */}
        <svg className="hidden absolute w-0 h-0">
          <filter id="liquid-glass">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">
              {/* Cursor: ensure to animate this scale from 0 to 100 and back to 0 on route change */}
              <animate attributeName="scale" values="0;100;0" dur="0.8s" begin="routeChange.begin" />
            </feDisplacementMap>
          </filter>
        </svg>

        <ColorProvider>
          <ThermalCursor />
          {children}
        </ColorProvider>
      </body>
    </html>
  )
}
