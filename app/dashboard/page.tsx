'use client'

import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import { mockJobs, mockTools } from '@/lib/mockData'

export default function DashboardPage() {
  const criticalTools = mockTools.filter(t => t.status === 'Critical' || t.status === 'Expiring Soon').slice(0, 2)
  const recentJobs = mockJobs.slice(0, 3)

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0F1E]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto md:ml-60 pb-16 md:pb-0">
        {/* Header */}
        <div className="px-6 py-6 border-b border-[#1F2937]">
          <h1 className="font-syne text-[22px] text-[#F9FAFB]">Overview</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-1">Good morning, Emmanuel. Here is what needs your attention today.</p>
        </div>

        {/* Alert Banner */}
        <div className="mx-6 mt-4 bg-red-900/20 border border-red-800/50 rounded px-4 py-3 text-sm text-[#F9FAFB] flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
          <span>2 tools require immediate calibration · NCFCC certificate renewal due in 18 days · 3 corrective actions open</span>
        </div>

        {/* Stat Cards */}
        <div className="px-6 mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { val: '3', label: 'Active Jobs', color: 'text-blue-400', sub: '' },
            { val: '2', label: 'Tools Critical', color: 'text-red-400', sub: 'action required' },
            { val: '12', label: 'Reports This Month', color: 'text-blue-400', sub: '' },
            { val: '67%', label: 'Nigerian Content Score', color: 'text-amber-400', sub: 'AT RISK — below 70%' },
            { val: '2', label: 'HSE Incidents (30d)', color: 'text-green-400', sub: '0 LTI this year' },
            { val: '2', label: 'Assets Overdue', color: 'text-red-400', sub: 'maintenance overdue' },
          ].map(s => (
            <div key={s.label} className="bg-[#111827] border border-[#1F2937] rounded p-4">
              <div className={`font-syne text-[28px] font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[12px] text-[#9CA3AF] mt-1 leading-tight">{s.label}</div>
              {s.sub && <div className={`text-[11px] mt-0.5 ${s.color}`}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Workspace Cards */}
        <div className="px-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { n: '01', title: 'Field Operations', summary: '3 active jobs · 2 tools critical · Last report: 12 Apr 2025', href: '/operations' },
            { n: '02', title: 'NCDMB Compliance', summary: 'Nigerian Content: 67% AT RISK · Next filing: 30 Jun 2025 (18 days)', href: '/compliance' },
            { n: '03', title: 'HSE & Incidents', summary: '2 incidents this month · 3 corrective actions open · 0 LTI this year', href: '/hse' },
            { n: '04', title: 'Assets & Maintenance', summary: '12 assets tracked · 2 overdue maintenance · 3 due within 7 days', href: '/assets' },
          ].map(w => (
            <Link key={w.n} href={w.href} className="bg-[#111827] border border-[#1F2937] rounded p-5 hover:border-[#F59E0B]/40 transition-colors cursor-pointer block">
              <div className="text-[#F59E0B] text-[10px] uppercase tracking-widest">{w.n}</div>
              <div className="font-syne text-[16px] text-[#F9FAFB] mt-1">{w.title}</div>
              <p className="text-[13px] text-[#9CA3AF] mt-2 leading-relaxed">{w.summary}</p>
            </Link>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="px-6 mt-6 mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recent Jobs */}
          <div className="bg-[#111827] border border-[#1F2937] rounded p-4">
            <div className="text-[13px] uppercase tracking-wide text-[#F59E0B] mb-3">Recent Jobs</div>
            <div className="space-y-3">
              {recentJobs.map(j => (
                <div key={j.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-[#6B7280]">{j.id}</div>
                    <div className="text-sm text-[#F9FAFB]">{j.wellName}</div>
                  </div>
                  <StatusBadge status={j.status} />
                </div>
              ))}
            </div>
            <Link href="/operations" className="block text-[#F59E0B] text-[12px] mt-4 hover:underline">→ View all jobs</Link>
          </div>

          {/* Compliance Snapshot */}
          <div className="bg-[#111827] border border-[#1F2937] rounded p-4">
            <div className="text-[13px] uppercase tracking-wide text-[#F59E0B] mb-3">Compliance Snapshot</div>
            <div className="flex items-center gap-3">
              <span className="font-syne text-[28px] text-[#F59E0B]">67%</span>
              <StatusBadge status="At Risk" />
            </div>
            <div className="w-full bg-[#1F2937] rounded-full h-1.5 mt-2">
              <div className="w-[67%] bg-[#F59E0B] h-1.5 rounded-full" />
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-[12px] text-[#F59E0B]">Next NCDMB Filing: 30 Jun 2025 — 18 days</p>
              <p className="text-[12px] text-red-400">NCFCC Status: Pending Renewal</p>
            </div>
            <Link href="/compliance" className="block text-[#F59E0B] text-[12px] mt-4 hover:underline">→ View compliance</Link>
          </div>

          {/* Tools Needing Attention */}
          <div className="bg-[#111827] border border-[#1F2937] rounded p-4">
            <div className="text-[13px] uppercase tracking-wide text-[#F59E0B] mb-3">Tools Needing Attention</div>
            <div className="space-y-3">
              {criticalTools.map(t => (
                <div key={t.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-[#6B7280]">{t.id}</div>
                    <div className="text-sm text-[#F9FAFB] truncate max-w-[140px]">{t.name}</div>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
            <Link href="/operations" className="block text-[#F59E0B] text-[12px] mt-4 hover:underline">→ View tool register</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
