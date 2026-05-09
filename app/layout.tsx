import type { Metadata } from 'next'
import { Space_Grotesk, Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-mona',
  weight: ['400', '500', '600', '700']
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['700', '800']
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600']
})

export const metadata: Metadata = {
  title: 'FieldCore — Nigeria Oil & Gas Platform',
  description: 'Your operations. Documented. Compliant. In control.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${inter.variable}`}>
      <body className="bg-[#0A0F1E] text-[#F9FAFB] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}