import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400', '600', '700', '800'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['400', '500', '600'] })

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
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-[#0A0F1E] text-[#F9FAFB] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
