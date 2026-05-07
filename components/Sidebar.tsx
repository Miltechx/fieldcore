'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    label: 'Field Operations',
    href: '/operations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="1" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="5" y1="11" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    label: 'Compliance',
    href: '/compliance',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1L2 3.5V8C2 11.5 5 14 8 15C11 14 14 11.5 14 8V3.5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label: 'HSE & Incidents',
    href: '/hse',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="8" y1="7" x2="8" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
      </svg>
    )
  },
  {
    label: 'Assets',
    href: '/assets',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.5 2.5L13.5 5.5L5.5 13.5L1.5 14.5L2.5 10.5L10.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="8.5" y1="4.5" x2="11.5" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
]

const resourceItems = [
  {
    label: 'Research',
    href: '/research',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="1" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="5" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => pathname === href

  const navLinkClass = (href: string) =>
    `h-11 flex items-center gap-3 text-sm cursor-pointer transition-colors ${
      isActive(href)
        ? 'text-[#F59E0B] border-l-[3px] border-[#F59E0B] bg-[#F59E0B]/5 pl-[13px] pr-4'
        : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937] px-4'
    }`

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-[#111827] border-r border-[#1F2937] h-screen fixed left-0 top-0 z-30">
        {/* Logo */}
        <div className="h-16 px-4 flex flex-col justify-center border-b border-[#1F2937]">
          <span className="font-syne text-[18px] font-bold text-[#F59E0B]">FieldCore</span>
          <span className="text-[11px] text-[#6B7280]">Nigeria Oil &amp; Gas Platform</span>
        </div>

        {/* Workspaces */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 mt-6 mb-2 text-[10px] uppercase tracking-widest text-[#6B7280]">Workspaces</div>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {item.icon}
              {item.label}
            </Link>
          ))}

          <div className="px-4 mt-6 mb-2 text-[10px] uppercase tracking-widest text-[#6B7280]">Resources</div>
          {resourceItems.map(item => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* User block */}
        <div className="border-t border-[#1F2937] p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-black text-xs font-bold flex items-center justify-center flex-shrink-0">EK</div>
          <div className="min-w-0">
            <div className="text-[13px] text-[#F9FAFB] font-medium truncate">Emmanuel Kalu</div>
            <div className="text-[11px] text-[#9CA3AF] truncate">Senior Wireline Engineer</div>
            <div className="text-[11px] text-[#6B7280] truncate">Seplat Energy · PHC</div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-14 bg-[#111827] border-t border-[#1F2937] flex items-center justify-around md:hidden z-50">
        {navItems.map(item => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center justify-center gap-1 px-2 h-full ${isActive(item.href) ? 'text-[#F59E0B]' : 'text-[#9CA3AF]'}`}
          >
            {item.icon}
            <span className="text-[9px]">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
