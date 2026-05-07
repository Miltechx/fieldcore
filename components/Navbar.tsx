'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 h-16 px-6 md:px-10 flex justify-between items-center transition-all duration-300 ${scrolled ? 'bg-[#111827] border-b border-[#1F2937]' : 'bg-transparent'}`}>
      <div>
        <span className="font-syne text-[18px] font-bold text-[#F59E0B]">FieldCore</span>
        <div className="text-[11px] text-[#6B7280]">Nigeria Oil &amp; Gas Platform</div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/research" className="hidden md:block text-sm text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">Research</Link>
        <Link href="/dashboard" className="bg-[#F59E0B] text-black font-semibold px-5 h-9 rounded text-sm hover:bg-[#D97706] transition-colors flex items-center">Enter Demo →</Link>
      </div>
    </nav>
  )
}
