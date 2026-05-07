'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import Toast from '@/components/Toast'
import { mockFilings, mockComplianceData, Filing } from '@/lib/mockData'

export default function CompliancePage() {
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'workforce' | 'procurement' | 'ncfcc' | 'capacity'>('overview')
  const [selectedFiling, setSelectedFiling] = useState<Filing>(mockFilings[3])
  const [activeTab, setActiveTab] = useState<'overview' | 'filings' | 'documents'>('overview')
  const [contextOpen, setContextOpen] = useState(true)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' })
  const [generating, setGenerating] = useState(false)
  const [docCategory, setDocCategory] = useState('NCP Filings')
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type })
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      showToast('NCP Report generated successfully. Ready to download.', 'success')
    }, 3000)
  }

  const toggleCheck = (key: string) => setChecklist(c => ({ ...c, [key]: !c[key] }))

  const cd = mockComplianceData
  const metrics = [
    { key: 'overview' as const, label: 'Compliance Overview', value: `${cd.nigerianContentScore}%`, status: 'At Risk' },
    { key: 'workforce' as const, label: 'Workforce Localization', value: `${cd.workforce.nigerianNationals}%`, status: 'Approved' },
    { key: 'procurement' as const, label: 'Local Procurement', value: `${cd.procurement.localSourcingPercent}%`, status: 'At Risk' },
    { key: 'capacity' as const, label: 'Capacity Building', value: 'On Track', status: 'Active' },
    { key: 'ncfcc' as const, label: 'NCFCC Certificate', value: 'Pending Renewal', status: 'Pending Renewal' },
  ]

  const docCategories = ['NCP Filings', 'NCFCC Certificate', 'Workforce Data', 'Procurement Records', 'Training Certificates', 'Audit Reports']
  const docItems: Record<string, { name: string; date: string; size: string }[]> = {
    'NCP Filings': [
      { name: 'NCP_Q1_2025_Final.pdf', date: '15 Apr 2025', size: '2.4 MB' },
      { name: 'NCP_Q4_2024_Annual.pdf', date: '30 Jan 2025', size: '5.1 MB' },
      { name: 'NCP_Q3_2024_Final.pdf', date: '14 Oct 2024', size: '2.2 MB' },
    ],
    'NCFCC Certificate': [
      { name: 'NCFCC_2024_Certificate.pdf', date: '20 Jun 2024', size: '0.8 MB' },
    ],
    'Workforce Data': [
      { name: 'Workforce_Q1_2025.xlsx', date: '01 Apr 2025', size: '1.2 MB' },
      { name: 'Expatriate_Quota_2025.pdf', date: '15 Jan 2025', size: '0.5 MB' },
    ],
    'Procurement Records': [
      { name: 'Local_Procurement_Q1_2025.xlsx', date: '10 Apr 2025', size: '3.1 MB' },
    ],
    'Training Certificates': [
      { name: 'Training_Completion_Q1_2025.pdf', date: '31 Mar 2025', size: '4.5 MB' },
    ],
    'Audit Reports': [
      { name: 'NCDMB_Audit_Mar2025.pdf', date: '22 Mar 2025', size: '1.8 MB' },
    ],
  }

  const ProgressBar = ({ val, max = 100, color = 'bg-[#F59E0B]' }: { val: number; max?: number; color?: string }) => (
    <div className="w-full bg-[#1F2937] rounded-full h-1.5">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min((val / max) * 100, 100)}%` }} />
    </div>
  )

  const MetricDetail = () => {
    if (selectedMetric === 'overview') return (
      <div>
        <h2 className="font-syne text-[20px] text-[#F9FAFB] mb-4">Compliance Overview</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { l: 'Nigerian Content Score', v: `${cd.nigerianContentScore}%`, c: 'text-[#F59E0B]', sub: 'AT RISK — below 70% target' },
            { l: 'Next NCDMB Filing', v: '30 Jun 2025', c: 'text-[#F9FAFB]', sub: '18 days remaining' },
            { l: 'NCFCC Certificate', v: 'Pending Renewal', c: 'text-red-400', sub: 'Due: 15 Jun 2025 · 12 days' },
            { l: 'Last Audit', v: 'March 2025', c: 'text-green-400', sub: 'Passed — NCDMB Region 2' },
          ].map(s => (
            <div key={s.l} className="bg-[#111827] border border-[#1F2937] rounded p-4">
              <div className="text-[11px] text-[#9CA3AF]">{s.l}</div>
              <div className={`font-syne text-[22px] font-bold mt-1 ${s.c}`}>{s.v}</div>
              <div className="text-[11px] text-[#6B7280] mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#111827] border border-[#1F2937] rounded p-4">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Overall Nigerian Content Score</div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-syne text-[32px] text-[#F59E0B]">{cd.nigerianContentScore}%</span>
            <StatusBadge status="At Risk" />
          </div>
          <ProgressBar val={cd.nigerianContentScore} color="bg-[#F59E0B]" />
          <div className="flex justify-between text-[11px] text-[#6B7280] mt-1">
            <span>0%</span><span>Target: 70%</span><span>100%</span>
          </div>
          <p className="text-[13px] text-[#9CA3AF] mt-4 leading-relaxed">
            All oil and gas companies operating in Nigeria must maintain a minimum Nigerian Content score of 70% as required by the Nigerian Oil and Gas Industry Content Development (NOGICD) Act 2010.
            Current score is {cd.nigerianContentScore}% — {cd.targetScore - cd.nigerianContentScore}% below the required minimum. Corrective action is required before the next NCDMB filing.
          </p>
        </div>
      </div>
    )

    if (selectedMetric === 'workforce') return (
      <div>
        <h2 className="font-syne text-[20px] text-[#F9FAFB] mb-4">Workforce Localization</h2>
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[#F9FAFB] font-syne text-[18px]">Overall: {cd.workforce.nigerianNationals}%</span>
            <span className="text-green-400">✓</span>
          </div>
          {[
            { label: 'Junior / Intermediate', val: cd.workforce.juniorIntermediate, target: 85, color: 'bg-green-500' },
            { label: 'Senior / Management', val: cd.workforce.seniorManagement, target: 85, color: 'bg-amber-500' },
          ].map(r => (
            <div key={r.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#9CA3AF]">{r.label}</span>
                <span className={r.val >= r.target ? 'text-green-400' : 'text-amber-400'}>{r.val}% {r.val >= r.target ? '✓' : '⚠'}</span>
              </div>
              <ProgressBar val={r.val} color={r.color} />
              <div className="text-[11px] text-[#6B7280] mt-0.5">Target: {r.target}% minimum</div>
            </div>
          ))}
          <div className="border-t border-[#1F2937] pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#9CA3AF]">Expatriate Quota Used</span>
              <span className="text-green-400">{cd.workforce.expatriateUsed} of {cd.workforce.expatriateAllowed} ✓</span>
            </div>
          </div>
          <div className="border-t border-[#1F2937] pt-3 bg-amber-900/20 border border-amber-800/50 rounded p-3">
            <div className="text-[11px] text-amber-400 font-bold">NOGICD Act Section 28 — 85% minimum at all levels</div>
            <div className="text-[12px] text-[#9CA3AF] mt-1">Status: Senior level at {cd.workforce.seniorManagement}% — below target. Action required to recruit or promote qualified Nigerians to senior roles.</div>
          </div>
        </div>
      </div>
    )

    if (selectedMetric === 'procurement') return (
      <div>
        <h2 className="font-syne text-[20px] text-[#F9FAFB] mb-4">Local Procurement — {cd.procurement.localSourcingPercent}% ⚠</h2>
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { l: 'Total This Quarter', v: cd.procurement.totalThisQuarter },
              { l: 'Local Sourcing', v: `₦1.46B (${cd.procurement.localSourcingPercent}%)` },
              { l: 'Imported', v: `₦0.94B (${cd.procurement.importedPercent}%)` },
              { l: 'Items With Waiver', v: String(cd.procurement.itemsWithWaiver) },
            ].map(s => (
              <div key={s.l}>
                <div className="text-[11px] text-[#9CA3AF]">{s.l}</div>
                <div className="text-[14px] text-[#F9FAFB] font-medium">{s.v}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1F2937] pt-3">
            <div className="text-[11px] text-[#F59E0B] uppercase tracking-widest mb-3">By Category</div>
            {cd.procurement.categories.map(c => (
              <div key={c.name} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#9CA3AF]">{c.name}</span>
                  <span className={c.local >= c.target ? 'text-green-400' : 'text-amber-400'}>{c.local}% {c.local >= c.target ? '✓' : '⚠'}</span>
                </div>
                <ProgressBar val={c.local} color={c.local >= c.target ? 'bg-green-500' : c.local >= 50 ? 'bg-amber-500' : 'bg-red-500'} />
                <div className="text-[11px] text-[#6B7280] mt-0.5">Target: {c.target}%</div>
              </div>
            ))}
          </div>
          <div className="bg-amber-900/20 border border-amber-800/50 rounded p-3">
            <div className="text-[12px] text-amber-400">Action: Increase local sourcing for chemicals and specialized equipment to reach 70% target before Q2 2025 filing.</div>
          </div>
        </div>
      </div>
    )

    if (selectedMetric === 'ncfcc') return (
      <div>
        <h2 className="font-syne text-[20px] text-[#F9FAFB] mb-4">NCFCC — Nigerian Content Fund Clearance Certificate</h2>
        <div className="bg-red-900/20 border border-red-800 rounded p-4 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-sm font-medium">Certificate renewal required within 12 days</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 space-y-3">
          {[
            ['Status', 'PENDING RENEWAL'], ['Certificate No', 'NCDMB/NCFCC/2024/04871'],
            ['Expiry', '15 June 2025 (12 days)'], ['Required for', 'All contracts above ₦10M'],
            ['Consequence', 'Disqualification from all active tenders'],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between">
              <span className="text-[13px] text-[#9CA3AF]">{l}</span>
              <span className={`text-[13px] font-medium ${l === 'Status' ? 'text-red-400' : l === 'Consequence' ? 'text-red-400' : 'text-[#F9FAFB]'}`}>{v}</span>
            </div>
          ))}
          <div className="border-t border-[#1F2937] pt-3">
            <div className="text-[11px] text-[#F59E0B] uppercase tracking-widest mb-2">Required Steps</div>
            {['Submit renewal to NCDMB portal', 'Attach Q1 2025 NCP compliance report', 'Pay renewal fee: ₦250,000', 'Processing: 5–7 working days'].map((s, i) => (
              <div key={i} className="text-[13px] text-[#9CA3AF] mb-1">{i + 1}. {s}</div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => showToast('NCDMB renewal portal opened in new tab', 'info')} className="flex-1 bg-[#F59E0B] text-black font-semibold h-9 rounded text-xs hover:bg-[#D97706]">Begin Renewal Process →</button>
            <button onClick={() => showToast('Certificate downloaded')} className="flex-1 border border-[#1F2937] text-[#9CA3AF] h-9 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Download Certificate</button>
          </div>
        </div>
      </div>
    )

    if (selectedMetric === 'capacity') return (
      <div>
        <h2 className="font-syne text-[20px] text-[#F9FAFB] mb-4">Capacity Building</h2>
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 grid grid-cols-2 gap-4">
          {[
            { l: 'Training Hours (YTD)', v: cd.capacityBuilding.trainingHours.toLocaleString(), c: 'text-green-400' },
            { l: 'NCD Fund Contribution', v: cd.capacityBuilding.ncdFundContribution, c: 'text-[#F9FAFB]' },
            { l: 'Technology Transfer Programs', v: String(cd.capacityBuilding.technologyTransferPrograms), c: 'text-[#F9FAFB]' },
            { l: 'R&D Activities', v: String(cd.capacityBuilding.rdActivities), c: 'text-[#F9FAFB]' },
          ].map(s => (
            <div key={s.l} className="bg-[#0A0F1E] border border-[#1F2937] rounded p-3">
              <div className="text-[11px] text-[#9CA3AF]">{s.l}</div>
              <div className={`font-syne text-[24px] font-bold mt-1 ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-green-900/20 border border-green-800/50 rounded p-3">
          <div className="text-[12px] text-green-400">✓ Capacity building metrics are on track for Q2 2025 filing.</div>
        </div>
      </div>
    )

    return null
  }

  const FilingDetail = () => {
    if (selectedFiling.status === 'Pending') return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-syne text-[20px] text-[#F9FAFB]">{selectedFiling.period} — {selectedFiling.type}</h2>
          <StatusBadge status={selectedFiling.status} />
        </div>
        <div className="bg-amber-900/20 border border-amber-800/50 rounded p-3 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-amber-400 text-sm">Due: {selectedFiling.dueDate} ({selectedFiling.daysRemaining} days)</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Preparation Checklist</div>
          <div className="mb-4">
            <div className="text-[12px] text-[#9CA3AF] mb-2 font-medium">Required Documents:</div>
            {['Workforce data export (Apr–Jun 2025)', 'Procurement ledger with local/import breakdown', 'Training completion certificates', 'NCD Fund payment receipt', 'Signed declaration from Country Manager'].map(item => (
              <label key={item} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" checked={!!checklist[item]} onChange={() => toggleCheck(item)} className="accent-[#F59E0B]" />
                <span className={`text-[13px] ${checklist[item] ? 'text-green-400 line-through' : 'text-[#9CA3AF]'}`}>{item}</span>
              </label>
            ))}
          </div>
          <div>
            <div className="text-[12px] text-[#9CA3AF] mb-2 font-medium">Metrics to Report:</div>
            {['Nigerian workforce % by grade', 'Local procurement % by category', 'Capacity building hours', 'Technology transfer activities'].map(item => (
              <label key={item} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" checked={!!checklist[`m_${item}`]} onChange={() => toggleCheck(`m_${item}`)} className="accent-[#F59E0B]" />
                <span className={`text-[13px] ${checklist[`m_${item}`] ? 'text-green-400 line-through' : 'text-[#9CA3AF]'}`}>{item}</span>
              </label>
            ))}
          </div>
          <button onClick={() => showToast('Filing workspace opened', 'info')} className="mt-4 bg-[#F59E0B] text-black font-semibold px-4 h-9 rounded text-xs hover:bg-[#D97706]">Start Preparation →</button>
        </div>
      </div>
    )

    if (selectedFiling.status === 'Action Required') return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-syne text-[20px] text-[#F9FAFB]">{selectedFiling.type}</h2>
          <StatusBadge status={selectedFiling.status} />
        </div>
        <div className="bg-red-900/20 border border-red-800 rounded p-3 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-sm">Action required: Due {selectedFiling.dueDate} ({selectedFiling.daysRemaining} days)</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 space-y-2">
          {[['Period', selectedFiling.period], ['Reference', selectedFiling.reference], ['Due Date', selectedFiling.dueDate]].map(([l, v]) => (
            <div key={l} className="flex justify-between">
              <span className="text-[13px] text-[#9CA3AF]">{l}</span>
              <span className="text-[13px] text-[#F9FAFB]">{v}</span>
            </div>
          ))}
          <div className="pt-3 flex gap-2">
            <button onClick={() => showToast('NCDMB renewal portal opened', 'info')} className="flex-1 bg-[#F59E0B] text-black font-semibold h-9 rounded text-xs hover:bg-[#D97706]">Begin Renewal →</button>
          </div>
        </div>
      </div>
    )

    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-syne text-[20px] text-[#F9FAFB]">Submission Confirmed — {selectedFiling.type}</h2>
          <StatusBadge status={selectedFiling.status} />
        </div>
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 space-y-2">
          {[
            ['Period', selectedFiling.period],
            ['Submission Date', selectedFiling.submissionDate],
            ['NCDMB Reference', selectedFiling.reference],
            ['Approved By', selectedFiling.approvedBy],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between">
              <span className="text-[13px] text-[#9CA3AF]">{l}</span>
              <span className="text-[13px] text-[#F9FAFB]">{v || '—'}</span>
            </div>
          ))}
          <div className="pt-3 flex gap-2">
            <button onClick={() => showToast('Report downloaded')} className="flex-1 border border-[#1F2937] text-[#9CA3AF] h-9 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Download Approved Report</button>
            <button onClick={() => showToast('Submission details loaded', 'info')} className="flex-1 border border-[#1F2937] text-[#9CA3AF] h-9 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">View Submission Details</button>
          </div>
        </div>
      </div>
    )
  }

  const MobileOverlay = () => (
    <div className="fixed inset-0 bg-[#111827] z-40 overflow-y-auto p-4 md:hidden">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setMobileOverlayOpen(false)} className="text-[#F59E0B] text-sm">← Back</button>
        <span className="font-syne text-lg text-[#F9FAFB]">
          {activeTab === 'overview' ? metrics.find(m => m.key === selectedMetric)?.label : activeTab === 'filings' ? selectedFiling.period : 'Documents'}
        </span>
      </div>
      {activeTab === 'overview' && <MetricDetail />}
      {activeTab === 'filings' && <FilingDetail />}
      {activeTab === 'documents' && <DocumentsDetail />}
    </div>
  )

  const DocumentsDetail = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne text-[20px] text-[#F9FAFB]">{docCategory}</h2>
        <button onClick={() => showToast('Document uploaded successfully')} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706]">+ Upload</button>
      </div>
      <div className="bg-[#111827] border border-[#1F2937] rounded overflow-hidden">
        {(docItems[docCategory] || []).map(doc => (
          <div key={doc.name} className="flex items-center justify-between px-4 py-3 border-b border-[#1F2937] hover:bg-[#1F2937] transition-colors">
            <div>
              <div className="text-sm text-[#F9FAFB]">{doc.name}</div>
              <div className="text-xs text-[#6B7280]">{doc.date} · {doc.size}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast(`${doc.name} downloaded`)} className="text-[11px] border border-[#1F2937] text-[#9CA3AF] px-2 h-6 rounded hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Download</button>
              <button onClick={() => showToast(`Opening ${doc.name}`, 'info')} className="text-[11px] border border-[#1F2937] text-[#9CA3AF] px-2 h-6 rounded hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0F1E]">
      <Sidebar />
      {mobileOverlayOpen && <MobileOverlay />}

      <div className="flex flex-col flex-1 overflow-hidden md:ml-60">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-[#1F2937] flex-shrink-0">
          <div>
            <div className="font-syne text-[18px] text-[#F9FAFB]">NCDMB Compliance</div>
            <div className="text-[12px] text-[#9CA3AF]">Nigerian Content tracking and regulatory filing management</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1">
              {(['overview', 'filings', 'documents'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1 text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}`}>
                  {tab === 'overview' ? 'Overview' : tab === 'filings' ? 'Filing History' : 'Document Vault'}
                </button>
              ))}
            </div>
            <button onClick={handleGenerate} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] transition-colors">
              {generating ? 'Generating...' : 'Generate NCP Report'}
            </button>
            <button onClick={() => setContextOpen(!contextOpen)} className="hidden md:flex border border-[#1F2937] text-[#9CA3AF] px-2 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors items-center">{contextOpen ? '›' : '‹'}</button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-[#1F2937] px-4">
          {(['overview', 'filings', 'documents'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-xs font-medium transition-colors ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF]'}`}>
              {tab === 'overview' ? 'Overview' : tab === 'filings' ? 'Filings' : 'Vault'}
            </button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Column 1 */}
          <div className="w-full md:w-80 flex-shrink-0 border-r border-[#1F2937] flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1F2937] flex-shrink-0">
              <span className="text-[12px] text-[#9CA3AF]">
                {activeTab === 'overview' ? 'Metrics (5)' : activeTab === 'filings' ? `Filings (${mockFilings.length})` : `Categories (${docCategories.length})`}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'overview' && (
                <>
                  <div className="mx-4 my-3 bg-[#0A0F1E] border border-[#1F2937] rounded p-4">
                    <div className="text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-2">Nigerian Content Score</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-syne text-[28px] text-[#F59E0B]">{cd.nigerianContentScore}%</span>
                      <StatusBadge status="At Risk" />
                    </div>
                    <div className="w-full bg-[#1F2937] rounded-full h-1.5">
                      <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: `${cd.nigerianContentScore}%` }} />
                    </div>
                    <div className="text-[11px] text-[#6B7280] mt-1">Target: {cd.targetScore}% minimum required</div>
                  </div>
                  {metrics.map(m => (
                    <div key={m.key} onClick={() => { setSelectedMetric(m.key); setMobileOverlayOpen(true) }}
                      className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors flex items-center justify-between ${selectedMetric === m.key ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                      <div>
                        <div className="text-sm text-[#F9FAFB]">{m.label}</div>
                        <div className="text-xs text-[#9CA3AF]">{m.value}</div>
                      </div>
                      <StatusBadge status={m.status} />
                    </div>
                  ))}
                </>
              )}
              {activeTab === 'filings' && mockFilings.map(f => (
                <div key={f.id} onClick={() => { setSelectedFiling(f); setMobileOverlayOpen(true) }}
                  className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors ${selectedFiling.id === f.id ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-[#6B7280]">{f.id}</span>
                    <StatusBadge status={f.status} />
                  </div>
                  <div className="text-sm font-semibold text-[#F9FAFB] mt-0.5">{f.period}</div>
                  <div className="text-xs text-[#9CA3AF]">{f.type}</div>
                  {f.dueDate && <div className="text-xs text-amber-400 mt-1">Due: {f.dueDate}</div>}
                </div>
              ))}
              {activeTab === 'documents' && docCategories.map(cat => (
                <div key={cat} onClick={() => { setDocCategory(cat); setMobileOverlayOpen(true) }}
                  className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors flex justify-between items-center ${docCategory === cat ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                  <span className="text-sm text-[#F9FAFB]">{cat}</span>
                  <span className="text-xs text-[#6B7280]">{(docItems[cat] || []).length} files</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Detail (desktop) */}
          <div className="hidden md:block flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && <MetricDetail />}
            {activeTab === 'filings' && <FilingDetail />}
            {activeTab === 'documents' && <DocumentsDetail />}
          </div>

          {/* Context Panel */}
          {contextOpen && (
            <div className="hidden md:block w-80 flex-shrink-0 border-l border-[#1F2937] bg-[#0F172A] overflow-y-auto">
              <div className="px-4 py-3 border-b border-[#1F2937] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#F9FAFB] text-[13px] font-bold">Context</span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
                <button onClick={() => setContextOpen(false)} className="text-[#9CA3AF] hover:text-[#F9FAFB] text-sm">‹</button>
              </div>
              <div className="px-4 py-4 space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Filing Deadlines</div>
                  {[
                    { l: 'Q2 NCP Report', d: '30 Jun 2025 · 18 days', c: 'text-amber-400' },
                    { l: 'NCFCC Renewal', d: '15 Jun 2025 · 12 days', c: 'text-red-400' },
                    { l: 'Annual NCP', d: '31 Jan 2026', c: 'text-green-400' },
                  ].map(i => (
                    <div key={i.l} className="flex justify-between py-1">
                      <span className="text-sm text-[#9CA3AF]">{i.l}</span>
                      <span className={`text-xs ${i.c}`}>{i.d}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#1F2937] pt-3">
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Quick Actions</div>
                  {['Prepare Q2 Filing', 'Download NCP Template', 'Contact NCDMB →'].map(a => (
                    <button key={a} onClick={() => showToast(`${a.replace(' →', '')} — opened`, 'info')} className="h-8 text-xs border border-[#1F2937] text-[#9CA3AF] hover:border-[#F59E0B] hover:text-[#F59E0B] rounded w-full text-left px-3 mb-2 transition-colors">{a}</button>
                  ))}
                </div>
                <div className="border-t border-[#1F2937] pt-3">
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Compliance Summary</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#9CA3AF]">Score</span><span className="text-amber-400">67% AT RISK</span></div>
                    <div className="flex justify-between"><span className="text-[#9CA3AF]">Last Audit</span><span className="text-green-400">March 2025 — Passed</span></div>
                    <div className="flex justify-between"><span className="text-[#9CA3AF]">Auditor</span><span className="text-[#F9FAFB] text-xs">NCDMB Region 2</span></div>
                    <div className="flex justify-between"><span className="text-[#9CA3AF]">Next Audit</span><span className="text-[#F9FAFB] text-xs">Q3 2025 (est.)</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />
    </div>
  )
}
