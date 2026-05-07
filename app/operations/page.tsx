'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import Toast from '@/components/Toast'
import Timeline from '@/components/Timeline'
import { mockJobs, mockTools, mockReports, Job, Tool, Report } from '@/lib/mockData'

export default function OperationsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs)
  const [tools, setTools] = useState<Tool[]>(mockTools)
  const [reports] = useState<Report[]>(mockReports)
  const [selectedJob, setSelectedJob] = useState<Job>(mockJobs[0])
  const [selectedTool, setSelectedTool] = useState<Tool>(mockTools[0])
  const [selectedReport, setSelectedReport] = useState<Report>(mockReports[0])
  const [activeTab, setActiveTab] = useState<'jobs' | 'tools' | 'reports'>('jobs')
  const [showForm, setShowForm] = useState(false)
  const [contextOpen, setContextOpen] = useState(true)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' })
  const [noteText, setNoteText] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [newJob, setNewJob] = useState({ wellName: '', client: 'SEPLAT Energy', jobType: 'E-Line Logging', date: '', location: '', engineer: 'Emmanuel Kalu', status: 'Pending' })

  useEffect(() => {
    if (noteTimer.current) clearTimeout(noteTimer.current)
    if (noteText) {
      setNoteSaved(false)
      noteTimer.current = setTimeout(() => setNoteSaved(true), 1000)
    }
    return () => { if (noteTimer.current) clearTimeout(noteTimer.current) }
  }, [noteText])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type })
  }

  const handleGenerateReport = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      showToast('Field report generated successfully. Ready to download.', 'success')
    }, 3000)
  }

  const handleSaveJob = () => {
    if (!newJob.wellName) { showToast('Well name is required', 'error'); return }
    const id = `WO-2025-${String(jobs.length + 100).padStart(3, '0')}`
    const job: Job = {
      id, wellName: newJob.wellName, client: newJob.client, jobType: newJob.jobType,
      date: newJob.date, status: newJob.status, engineer: newJob.engineer, location: newJob.location,
      field: newJob.location, duration: '—', depthFrom: 0, depthTo: 0, toolsDeployed: [],
      hasAlert: false, alertText: '', findings: 'Pending field data entry.',
      recommendations: ['Complete field data entry after job execution.'],
      timeline: [{ time: '—', label: 'Job Created', type: 'normal' as const }]
    }
    setJobs([job, ...jobs])
    setSelectedJob(job)
    showToast('Job card created successfully', 'success')
    setShowForm(false)
    setNewJob({ wellName: '', client: 'SEPLAT Energy', jobType: 'E-Line Logging', date: '', location: '', engineer: 'Emmanuel Kalu', status: 'Pending' })
  }

  const inputClass = "w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-8 text-xs text-[#F9FAFB] focus:outline-none focus:border-[#F59E0B] placeholder-[#6B7280]"
  const selectClass = inputClass

  const filteredJobs = jobs.filter(j => j.wellName.toLowerCase().includes(searchQuery.toLowerCase()) || j.id.toLowerCase().includes(searchQuery.toLowerCase()))

  const calTimeline = (tool: Tool) => [
    ...tool.calibrationHistory.map(h => ({ time: h.date, label: `Calibration Completed — ${h.lab}`, type: 'complete' as const })),
    { time: tool.nextDue, label: 'Calibration Due', type: tool.status === 'Critical' || tool.status === 'Expiring Soon' ? 'alert' as const : 'normal' as const }
  ]

  const CalBanner = ({ tool }: { tool: Tool }) => {
    if (tool.status === 'Critical') return <div className="bg-red-900/20 border border-red-800 rounded p-3 text-red-400 text-sm flex items-center gap-2 mb-4">⚠ CALIBRATION CRITICAL — Do not deploy this tool. Schedule calibration immediately.</div>
    if (tool.status === 'Expiring Soon') return <div className="bg-amber-900/20 border border-amber-800 rounded p-3 text-amber-400 text-sm flex items-center gap-2 mb-4">⚠ Calibration expires within 7 days. Schedule now.</div>
    return <div className="bg-green-900/20 border border-green-800 rounded p-3 text-green-400 text-sm flex items-center gap-2 mb-4">✓ Calibration is current.</div>
  }

  const activeJobContext = selectedJob

  const MobileOverlay = () => (
    <div className="fixed inset-0 bg-[#111827] z-40 overflow-y-auto p-4 md:hidden">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setMobileOverlayOpen(false)} className="text-[#F59E0B] text-sm flex items-center gap-1">← Back</button>
        <span className="font-syne text-lg text-[#F9FAFB]">{activeTab === 'jobs' ? selectedJob.wellName : activeTab === 'tools' ? selectedTool.name : selectedReport.wellName}</span>
      </div>
      {activeTab === 'jobs' && <JobDetailView />}
      {activeTab === 'tools' && <ToolDetailView />}
      {activeTab === 'reports' && <ReportDetailView />}
      {/* Mobile context accordion */}
      <MobileContext />
    </div>
  )

  const MobileContext = () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="mt-6 border border-[#1F2937] rounded">
        <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 text-left text-[#F59E0B] text-sm font-medium flex justify-between items-center">
          Context &amp; Alerts <span>{open ? '▲' : '▼'}</span>
        </button>
        {open && <div className="px-4 pb-4"><ContextContent /></div>}
      </div>
    )
  }

  const ContextContent = () => (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-2">Tools on this Job</div>
        {selectedJob.toolsDeployed.length ? selectedJob.toolsDeployed.map(t => {
          const tool = tools.find(x => x.shortName === t)
          return (
            <div key={t} className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm text-[#F9FAFB]">{t}</div>
                {tool && <div className="text-[11px] text-[#9CA3AF]">{tool.name}</div>}
              </div>
              {tool && <StatusBadge status={tool.status} />}
            </div>
          )
        }) : <p className="text-sm text-[#6B7280]">No tools recorded</p>}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-2">Active Alerts</div>
        {selectedJob.hasAlert
          ? <div className="flex items-center gap-2 text-[#F59E0B] text-sm">⚠ {selectedJob.alertText}</div>
          : <div className="text-green-400 text-sm">✓ No active alerts</div>}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-2">Last Incident</div>
        <div className="text-sm">
          <div className="flex items-center justify-between"><span className="font-mono text-[#9CA3AF] text-xs">HSE-2025-006</span><StatusBadge status="Under Review" /></div>
          <div className="text-[#9CA3AF] text-xs mt-1">Equipment Damage · Medium</div>
          <div className="text-[#6B7280] text-xs">02 Apr 2025 · Agbami-7</div>
          <Link href="/hse" className="text-[#F59E0B] text-[11px] block mt-1">→ View in HSE</Link>
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-2">Quick Actions</div>
        <div className="space-y-2">
          {['Log Incident →', 'Schedule Maintenance →', 'Notify Supervisor →'].map(a => (
            <button key={a} onClick={() => showToast(`${a.replace(' →', '')} — recorded`, 'info')} className="h-8 text-xs border border-[#1F2937] text-[#9CA3AF] hover:border-[#F59E0B] hover:text-[#F59E0B] rounded w-full text-left px-3 transition-colors">{a}</button>
          ))}
        </div>
      </div>
    </div>
  )

  const JobDetailView = () => (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-syne text-[22px] text-[#F9FAFB]">{selectedJob.wellName}</h2>
          <div className="font-mono text-[12px] text-[#9CA3AF] mt-1">{selectedJob.id}</div>
          <div className="text-[12px] text-[#9CA3AF] mt-1">{selectedJob.engineer} · {selectedJob.field} · {selectedJob.client}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={selectedJob.status} />
          <button onClick={handleGenerateReport} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] transition-colors">
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Timeline</div>
        <Timeline events={selectedJob.timeline} />
      </div>

      <div className="mb-6 bg-[#111827] border border-[#1F2937] rounded p-4">
        <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Operation Summary</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {[
            ['Job Type', selectedJob.jobType], ['Depth', selectedJob.depthFrom ? `${selectedJob.depthFrom.toLocaleString()}m – ${selectedJob.depthTo.toLocaleString()}m` : '—'],
            ['Duration', selectedJob.duration], ['Date', selectedJob.date],
            ['Tools', selectedJob.toolsDeployed.join(', ') || '—'], ['Location', selectedJob.field],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="text-[11px] text-[#9CA3AF]">{l}</div>
              <div className="text-[13px] text-[#F9FAFB]">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] border border-[#1F2937] rounded p-4">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Findings</div>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">{selectedJob.findings}</p>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] rounded p-4">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Recommendations</div>
          {selectedJob.recommendations.map((r, i) => (
            <div key={i} className="group relative mb-2">
              <p className="text-sm text-[#F9FAFB] py-2 pr-28">{i + 1}. {r}</p>
              <div className="absolute right-0 top-1.5 hidden group-hover:flex gap-1">
                <button onClick={() => showToast('Action accepted and logged')} className="px-2 h-6 text-[10px] border border-green-800 text-green-400 rounded hover:bg-green-900/40">Accept</button>
                <button onClick={() => showToast('Follow-up scheduled', 'info')} className="px-2 h-6 text-[10px] border border-blue-800 text-blue-400 rounded hover:bg-blue-900/40">Schedule</button>
                <button onClick={() => showToast('Flagged for review', 'info')} className="px-2 h-6 text-[10px] border border-amber-800 text-amber-400 rounded hover:bg-amber-900/40">Flag</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 bg-[#111827] border border-[#1F2937] rounded p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B]">Engineer Notes</div>
          {noteSaved && <span className="text-green-400 text-[11px]">Saved ✓</span>}
        </div>
        <textarea
          className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded p-3 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B] resize-none h-20 mt-3"
          placeholder={noteText ? undefined : '+ Add the first note for this job'}
          value={noteText}
          onChange={e => { setNoteText(e.target.value); setNoteSaved(false) }}
        />
      </div>
    </div>
  )

  const ToolDetailView = () => (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h2 className="font-syne text-[22px] text-[#F9FAFB]">{selectedTool.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-[#9CA3AF] bg-[#0F172A] border border-[#1F2937] px-2 py-0.5 rounded text-[11px]">{selectedTool.category}</span>
            <StatusBadge status={selectedTool.status} />
          </div>
        </div>
      </div>
      <CalBanner tool={selectedTool} />
      <div className="bg-[#111827] border border-[#1F2937] rounded p-4 mb-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {[
            ['Serial No', selectedTool.id], ['Category', selectedTool.category],
            ['Last Cal', selectedTool.lastCalibration], ['Next Due', selectedTool.nextDue],
            ['Location', selectedTool.location], ['Status', selectedTool.status],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="text-[11px] text-[#9CA3AF]">{l}</div>
              <div className="text-[13px] text-[#F9FAFB]">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Calibration History</div>
      <Timeline events={calTimeline(selectedTool)} />
      <div className="mt-4 flex gap-2">
        <button onClick={() => showToast('Calibration scheduled with Intertek PHC', 'info')} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] transition-colors">Schedule Calibration</button>
        <button onClick={() => showToast('Tool flagged for review', 'info')} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Flag Tool</button>
      </div>
    </div>
  )

  const ReportDetailView = () => (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <div className="font-mono text-[12px] text-[#9CA3AF]">{selectedReport.id}</div>
          <h2 className="font-syne text-[22px] text-[#F9FAFB]">{selectedReport.wellName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={selectedReport.status} />
          <button onClick={() => { window.print(); showToast('Report sent to printer') }} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Download PDF</button>
          <button onClick={() => showToast('Link copied to clipboard', 'info')} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Share</button>
        </div>
      </div>
      <div className="bg-[#111827] border border-[#1F2937] rounded p-6 font-mono text-sm text-[#9CA3AF]">
        <div className="text-[#F59E0B] mb-2">══════════════════════════════════════════</div>
        <div className="text-[#F9FAFB] font-bold mb-1">FIELDCORE FIELD REPORT</div>
        <div className="text-[#F59E0B] mb-3">══════════════════════════════════════════</div>
        <div className="grid grid-cols-2 gap-x-4 mb-4">
          <div>Job ID: <span className="text-[#F9FAFB]">{selectedReport.jobId}</span></div>
          <div>Status: <span className="text-[#F9FAFB]">{selectedReport.status.toUpperCase()}</span></div>
          <div>Generated: <span className="text-[#F9FAFB]">{selectedReport.date}</span></div>
          <div>Pages: <span className="text-[#F9FAFB]">{selectedReport.pages}</span></div>
        </div>
        <div className="text-[#F59E0B] mb-2">WELL DETAILS</div>
        <div className="grid grid-cols-2 gap-x-4 mb-4">
          <div>Well Name: <span className="text-[#F9FAFB]">{selectedReport.wellName}</span></div>
          <div>Operator: <span className="text-[#F9FAFB]">{selectedReport.client}</span></div>
          <div>Date: <span className="text-[#F9FAFB]">{selectedReport.date}</span></div>
          <div>Location: <span className="text-[#F9FAFB]">Offshore Nigeria</span></div>
        </div>
        <div className="text-[#F59E0B] mb-2">OPERATION SUMMARY</div>
        <div className="mb-4">
          <div>Job Type: <span className="text-[#F9FAFB]">E-Line Logging — Production &amp; Injection Profiling</span></div>
          <div>Tools: <span className="text-[#F9FAFB]">Full-Bore Spinner (FBS-SP-0091), HRT</span></div>
          <div>Engineer: <span className="text-[#F9FAFB]">Emmanuel Kalu — Senior Wireline Engineer</span></div>
          <div>Duration: <span className="text-[#F9FAFB]">6 hours 40 minutes</span></div>
          <div>Depth Range: <span className="text-[#F9FAFB]">3,100m – 3,400m MD</span></div>
        </div>
        <div className="text-[#F59E0B] mb-2">FINDINGS</div>
        <p className="mb-4">Spinner survey confirmed zonal contribution from perforated intervals at 3,240m and 3,310m. Temperature anomaly identified at 3,290m consistent with injection breakthrough. Gas breakthrough risk: LOW.</p>
        <div className="text-[#F59E0B] mb-2">RECOMMENDATIONS</div>
        <div className="mb-4">
          <div>1. Reperforate lower zone interval at 3,290m–3,310m</div>
          <div>2. Monitor injection profile at 30-day interval</div>
          <div>3. Schedule follow-up temperature survey in Q3 2025</div>
        </div>
        <div className="text-[#9CA3AF]">SIGNED: <span className="text-[#F9FAFB]">Emmanuel Kalu — Senior Wireline Engineer</span></div>
        <div className="text-[#F59E0B] mt-2">══════════════════════════════════════════</div>
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
            <div className="font-syne text-[18px] text-[#F9FAFB]">Field Operations</div>
            <div className="text-[12px] text-[#9CA3AF]">Live operational view</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1 border-b border-transparent">
              {(['jobs', 'tools', 'reports'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1 text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}`}>
                  {tab === 'jobs' ? 'Job Cards' : tab === 'tools' ? 'Tool Register' : 'Field Reports'}
                </button>
              ))}
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] transition-colors">+ New Entry</button>
            <button onClick={() => setContextOpen(!contextOpen)} className="hidden md:flex border border-[#1F2937] text-[#9CA3AF] px-2 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors items-center">{contextOpen ? '›' : '‹'}</button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-[#1F2937] px-4">
          {(['jobs', 'tools', 'reports'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-xs font-medium transition-colors capitalize ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF]'}`}>
              {tab === 'jobs' ? 'Jobs' : tab === 'tools' ? 'Tools' : 'Reports'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Column 1 - List */}
          <div className="w-full md:w-80 flex-shrink-0 border-r border-[#1F2937] flex flex-col overflow-hidden">
            {/* List header */}
            <div className="px-4 py-3 border-b border-[#1F2937] flex items-center justify-between flex-shrink-0">
              <span className="text-[12px] text-[#9CA3AF]">
                {activeTab === 'jobs' ? `Jobs (${filteredJobs.length})` : activeTab === 'tools' ? `Tools (${tools.length})` : `Reports (${reports.length})`}
              </span>
              {activeTab === 'jobs' && (
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-7 text-xs text-[#F9FAFB] w-32 focus:outline-none focus:border-[#F59E0B] placeholder-[#6B7280]" />
              )}
            </div>

            {/* New Entry Form */}
            {showForm && (
              <div className="bg-[#0F172A] border-b border-[#1F2937] p-4 space-y-2 flex-shrink-0">
                <input placeholder="Well Name" value={newJob.wellName} onChange={e => setNewJob({...newJob, wellName: e.target.value})} className={inputClass} />
                <select value={newJob.client} onChange={e => setNewJob({...newJob, client: e.target.value})} className={selectClass}>
                  {['SEPLAT Energy', 'TotalEnergies', 'Shell SPDC', 'NNPC', 'Oando', 'Eroton', 'Waltersmith', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={newJob.jobType} onChange={e => setNewJob({...newJob, jobType: e.target.value})} className={selectClass}>
                  {['E-Line Logging', 'Slickline Intervention', 'Well Integrity', 'Gas Lift Optimization', 'SCSSV Diagnostic', 'Well Stimulation', 'Production Profiling'].map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="date" value={newJob.date} onChange={e => setNewJob({...newJob, date: e.target.value})} className={inputClass} />
                <input placeholder="Location" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className={inputClass} />
                <input placeholder="Engineer" value={newJob.engineer} onChange={e => setNewJob({...newJob, engineer: e.target.value})} className={inputClass} />
                <select value={newJob.status} onChange={e => setNewJob({...newJob, status: e.target.value})} className={selectClass}>
                  {['Pending', 'In Progress', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSaveJob} className="flex-1 bg-[#F59E0B] text-black h-7 rounded text-xs font-semibold hover:bg-[#D97706]">Save</button>
                  <button onClick={() => setShowForm(false)} className="flex-1 border border-[#1F2937] text-[#9CA3AF] h-7 rounded text-xs hover:border-[#F59E0B]">Cancel</button>
                </div>
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'jobs' && filteredJobs.map(job => (
                <div key={job.id} onClick={() => { setSelectedJob(job); setMobileOverlayOpen(true) }}
                  className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors ${selectedJob.id === job.id ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-[#6B7280]">{job.id}</span>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="font-syne text-sm font-semibold text-[#F9FAFB] mt-0.5">{job.wellName}</div>
                  <div className="text-xs text-[#9CA3AF]">{job.jobType} · {job.client}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[#6B7280]">⏱ {job.duration}</span>
                    {job.hasAlert && <span className="text-xs text-[#F59E0B]">⚠ {job.alertText}</span>}
                  </div>
                </div>
              ))}
              {activeTab === 'tools' && tools.map(tool => (
                <div key={tool.id} onClick={() => { setSelectedTool(tool); setMobileOverlayOpen(true) }}
                  className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors ${selectedTool.id === tool.id ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-[#6B7280]">{tool.id}</span>
                    <StatusBadge status={tool.status} />
                  </div>
                  <div className="font-syne text-sm font-semibold text-[#F9FAFB] mt-0.5">{tool.name}</div>
                  <div className="text-xs text-[#9CA3AF]">{tool.category} · {tool.location}</div>
                  <div className="text-xs text-[#6B7280] mt-1">Last cal: {tool.lastCalibration}</div>
                </div>
              ))}
              {activeTab === 'reports' && reports.map(rpt => (
                <div key={rpt.id} onClick={() => { setSelectedReport(rpt); setMobileOverlayOpen(true) }}
                  className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors ${selectedReport.id === rpt.id ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-[#6B7280]">{rpt.id}</span>
                    <StatusBadge status={rpt.status} />
                  </div>
                  <div className="font-syne text-sm font-semibold text-[#F9FAFB] mt-0.5">{rpt.wellName}</div>
                  <div className="text-xs text-[#9CA3AF]">{rpt.client} · {rpt.date}</div>
                  <div className="text-xs text-[#6B7280] mt-1">{rpt.pages} pages</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Detail (desktop) */}
          <div className="hidden md:block flex-1 overflow-y-auto p-6">
            {activeTab === 'jobs' && <JobDetailView />}
            {activeTab === 'tools' && <ToolDetailView />}
            {activeTab === 'reports' && <ReportDetailView />}
          </div>

          {/* Column 3 - Context Panel (desktop) */}
          {contextOpen && (
            <div className="hidden md:block w-80 flex-shrink-0 border-l border-[#1F2937] bg-[#0F172A] overflow-y-auto">
              <div className="px-4 py-3 border-b border-[#1F2937] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#F9FAFB] text-[13px] font-bold">Context</span>
                  {activeJobContext.hasAlert && <span className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse" />}
                </div>
                <button onClick={() => setContextOpen(false)} className="text-[#9CA3AF] hover:text-[#F9FAFB] text-sm">‹</button>
              </div>
              <div className="px-4 py-4 border-b border-[#1F2937]">
                <ContextContent />
              </div>
            </div>
          )}
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />
    </div>
  )
}
