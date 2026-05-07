'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import Toast from '@/components/Toast'
import Timeline from '@/components/Timeline'
import { mockIncidents, Incident } from '@/lib/mockData'

interface CorrectiveAction {
  id: string
  incidentId: string
  description: string
  assignedTo: string
  dueDate: string
  status: 'Open' | 'In Progress' | 'Verified' | 'Closed'
  notes: string
}

const initialActions: CorrectiveAction[] = [
  { id: 'CA-2025-003', incidentId: 'HSE-2025-006', description: 'Early calibration check for GR-0017', assignedTo: 'Emmanuel Kalu', dueDate: '20 May 2025', status: 'Open', notes: '' },
  { id: 'CA-2025-002', incidentId: 'HSE-2025-003', description: 'Wireline unit hydraulic system full inspection', assignedTo: 'Field Team B', dueDate: '15 May 2025', status: 'In Progress', notes: '' },
  { id: 'CA-2025-001', incidentId: 'HSE-2025-004', description: 'PPE toolbox talk for all field personnel', assignedTo: 'Safety Officer', dueDate: '22 Apr 2025', status: 'Closed', notes: 'Completed 22 Apr 2025. All personnel attended.' },
]

const hseReports = [
  { id: 'HSE-RPT-2025-04', period: 'April 2025', type: 'Monthly HSE Report', status: 'Final', incidents: 2, nearMisses: 1 },
  { id: 'HSE-RPT-2025-Q1', period: 'Q1 2025', type: 'Quarterly HSE Summary', status: 'Final', incidents: 4, nearMisses: 3 },
  { id: 'HSE-RPT-2025-03', period: 'March 2025', type: 'Monthly HSE Report', status: 'Final', incidents: 2, nearMisses: 2 },
]

export default function HSEPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)
  const [actions, setActions] = useState<CorrectiveAction[]>(initialActions)
  const [selectedIncident, setSelectedIncident] = useState<Incident>(mockIncidents[1])
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction>(initialActions[0])
  const [activeTab, setActiveTab] = useState<'incidents' | 'actions' | 'hsereports'>('incidents')
  const [showForm, setShowForm] = useState(false)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [contextOpen, setContextOpen] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' })
  const [generating, setGenerating] = useState(false)
  const [actionNote, setActionNote] = useState('')

  const [newIncident, setNewIncident] = useState({
    type: 'Near Miss', dateTime: '', location: '', description: '', immediateAction: '',
    reportedBy: 'Emmanuel Kalu', severity: 'Low'
  })

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type })
  }

  const handleGenerateHSEReport = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      showToast('HSE Report generated successfully. Ready to download.', 'success')
    }, 3000)
  }

  const handleSaveIncident = () => {
    if (!newIncident.description) { showToast('Description is required', 'error'); return }
    const id = `HSE-2025-${String(incidents.length + 10).padStart(3, '0')}`
    const incident: Incident = {
      id, type: newIncident.type, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toTimeString().slice(0, 5), location: newIncident.location,
      severity: newIncident.severity, status: 'Under Review', reportedBy: newIncident.reportedBy,
      description: newIncident.description, immediateAction: newIncident.immediateAction,
      timeline: [{ time: new Date().toTimeString().slice(0, 5), label: 'Incident Reported', type: 'normal' as const }]
    }
    setIncidents([incident, ...incidents])
    setSelectedIncident(incident)
    showToast('Incident logged successfully', 'success')
    setShowForm(false)
  }

  const handleMarkComplete = (actionId: string) => {
    setActions(prev => prev.map(a => a.id === actionId ? { ...a, status: 'Closed' as const } : a))
    showToast('Corrective action marked as closed', 'success')
  }

  const severityDot = (sev: string) => {
    const color = sev === 'High' || sev === 'Critical' ? 'bg-red-500' : sev === 'Medium' ? 'bg-amber-500' : 'bg-[#6B7280]'
    return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
  }

  const inputClass = "w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-8 text-xs text-[#F9FAFB] focus:outline-none focus:border-[#F59E0B] placeholder-[#6B7280]"

  const IncidentDetail = () => (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-6">
        <div>
          <div className="font-mono text-[12px] text-[#9CA3AF]">{selectedIncident.id}</div>
          <h2 className="font-syne text-[20px] text-[#F9FAFB]">{selectedIncident.type}</h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={selectedIncident.status} />
          <button onClick={() => showToast('Incident closed', 'success')} className="border border-green-800 text-green-400 px-3 h-8 rounded text-xs hover:bg-green-900/30 transition-colors">Close Incident</button>
          <button onClick={handleGenerateHSEReport} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] transition-colors">
            {generating ? 'Generating...' : 'Generate HSE Report'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Incident Timeline</div>
        <Timeline events={selectedIncident.timeline} />
      </div>

      <div className="bg-[#111827] border border-[#1F2937] rounded p-5 mb-4">
        <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Incident Details</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
          {[
            ['Type', selectedIncident.type],
            ['Date & Time', `${selectedIncident.date} · ${selectedIncident.time}`],
            ['Location', selectedIncident.location],
            ['Reported By', selectedIncident.reportedBy],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="text-[11px] text-[#9CA3AF]">{l}</div>
              <div className="text-[13px] text-[#F9FAFB]">{v}</div>
            </div>
          ))}
          <div>
            <div className="text-[11px] text-[#9CA3AF]">Severity</div>
            <StatusBadge status={selectedIncident.severity === 'High' ? 'Critical' : selectedIncident.severity === 'Medium' ? 'Under Review' : 'Approved'} />
          </div>
        </div>
        <div className="mb-3">
          <div className="text-[11px] text-[#9CA3AF] mb-1">Description</div>
          <p className="text-[13px] text-[#F9FAFB] leading-relaxed">{selectedIncident.description}</p>
        </div>
        <div>
          <div className="text-[11px] text-[#9CA3AF] mb-1">Immediate Action Taken</div>
          <p className="text-[13px] text-[#F9FAFB] leading-relaxed">{selectedIncident.immediateAction}</p>
        </div>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] rounded p-4">
        <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Linked Corrective Actions</div>
        {actions.filter(a => a.incidentId === selectedIncident.id).length > 0
          ? actions.filter(a => a.incidentId === selectedIncident.id).map(a => (
            <div key={a.id} className="flex items-center justify-between py-2 border-b border-[#1F2937] last:border-0">
              <div>
                <div className="font-mono text-xs text-[#6B7280]">{a.id}</div>
                <div className="text-sm text-[#F9FAFB]">{a.description}</div>
                <div className="text-xs text-[#9CA3AF]">Assigned: {a.assignedTo} · Due: {a.dueDate}</div>
              </div>
              <StatusBadge status={a.status === 'Open' ? 'In Progress' : a.status} />
            </div>
          ))
          : <p className="text-sm text-[#6B7280]">+ No corrective actions linked to this incident</p>
        }
      </div>
    </div>
  )

  const ActionDetail = () => {
    const progressSteps = ['Assigned', 'In Progress', 'Verified', 'Closed']
    const currentStep = progressSteps.indexOf(selectedAction.status === 'Open' ? 'Assigned' : selectedAction.status)

    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-6">
          <div>
            <div className="font-mono text-[12px] text-[#9CA3AF]">{selectedAction.id}</div>
            <h2 className="font-syne text-[20px] text-[#F9FAFB]">{selectedAction.description}</h2>
            <div className="text-[12px] text-[#9CA3AF] mt-1">Linked to: {selectedAction.incidentId}</div>
          </div>
          <StatusBadge status={selectedAction.status === 'Open' ? 'In Progress' : selectedAction.status} />
        </div>

        {/* Progress tracker */}
        <div className="flex items-center mb-6">
          {progressSteps.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${i <= currentStep ? 'bg-[#F59E0B]' : 'bg-[#374151]'}`} />
                <div className={`text-[10px] mt-1 whitespace-nowrap ${i <= currentStep ? 'text-[#F59E0B]' : 'text-[#6B7280]'}`}>{step}</div>
              </div>
              {i < progressSteps.length - 1 && (
                <div className={`flex-1 h-px mx-1 mb-4 ${i < currentStep ? 'bg-[#F59E0B]' : 'bg-[#374151]'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 mb-4">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Action Details</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              ['Action ID', selectedAction.id],
              ['Assigned To', selectedAction.assignedTo],
              ['Due Date', selectedAction.dueDate],
              ['Status', selectedAction.status],
            ].map(([l, v]) => (
              <div key={l}>
                <div className="text-[11px] text-[#9CA3AF]">{l}</div>
                <div className="text-[13px] text-[#F9FAFB]">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] rounded p-4 mb-4">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-2">Notes</div>
          <textarea
            className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded p-3 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B] resize-none h-20 mt-2"
            placeholder="Add action notes..."
            value={selectedAction.notes || actionNote}
            onChange={e => {
              setActionNote(e.target.value)
              setActions(prev => prev.map(a => a.id === selectedAction.id ? { ...a, notes: e.target.value } : a))
            }}
          />
        </div>

        <div className="flex gap-2">
          {selectedAction.status !== 'Closed' && (
            <button onClick={() => handleMarkComplete(selectedAction.id)} className="bg-[#F59E0B] text-black font-semibold px-4 h-9 rounded text-xs hover:bg-[#D97706]">Mark Complete</button>
          )}
          <button onClick={() => showToast('Action reassigned', 'info')} className="border border-[#1F2937] text-[#9CA3AF] px-4 h-9 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Reassign</button>
        </div>
      </div>
    )
  }

  const ReportsDetail = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne text-[20px] text-[#F9FAFB]">HSE Reports</h2>
        <button onClick={handleGenerateHSEReport} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706]">
          {generating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
      {hseReports.map(r => (
        <div key={r.id} className="bg-[#111827] border border-[#1F2937] rounded p-5 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-mono text-xs text-[#6B7280]">{r.id}</div>
              <div className="font-syne text-[16px] text-[#F9FAFB]">{r.period}</div>
              <div className="text-xs text-[#9CA3AF]">{r.type}</div>
            </div>
            <StatusBadge status={r.status} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div><div className="text-[11px] text-[#9CA3AF]">Incidents</div><div className="text-[18px] font-syne text-[#F9FAFB]">{r.incidents}</div></div>
            <div><div className="text-[11px] text-[#9CA3AF]">Near Misses</div><div className="text-[18px] font-syne text-[#F9FAFB]">{r.nearMisses}</div></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => showToast(`${r.id} downloaded`)} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-7 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Download PDF</button>
            <button onClick={() => showToast('Link copied', 'info')} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-7 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Share</button>
          </div>
        </div>
      ))}
    </div>
  )

  const MobileOverlay = () => (
    <div className="fixed inset-0 bg-[#111827] z-40 overflow-y-auto p-4 md:hidden">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setMobileOverlayOpen(false)} className="text-[#F59E0B] text-sm">← Back</button>
        <span className="font-syne text-lg text-[#F9FAFB]">
          {activeTab === 'incidents' ? selectedIncident.id : activeTab === 'actions' ? selectedAction.id : 'HSE Reports'}
        </span>
      </div>
      {activeTab === 'incidents' && <IncidentDetail />}
      {activeTab === 'actions' && <ActionDetail />}
      {activeTab === 'hsereports' && <ReportsDetail />}
      <div className="mt-6 border border-[#1F2937] rounded">
        <button onClick={() => {}} className="w-full px-4 py-3 text-left text-[#F59E0B] text-sm font-medium">Context &amp; Alerts ▼</button>
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
            <div className="font-syne text-[18px] text-[#F9FAFB]">HSE &amp; Incidents</div>
            <div className="text-[12px] text-[#9CA3AF]">Safety incident log and corrective action tracker</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1">
              {(['incidents', 'actions', 'hsereports'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1 text-sm font-medium transition-colors ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}`}>
                  {tab === 'incidents' ? 'Incident Log' : tab === 'actions' ? 'Corrective Actions' : 'HSE Reports'}
                </button>
              ))}
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] transition-colors">+ Log Incident</button>
            <button onClick={() => setContextOpen(!contextOpen)} className="hidden md:flex border border-[#1F2937] text-[#9CA3AF] px-2 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors items-center">{contextOpen ? '›' : '‹'}</button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-[#1F2937] px-4">
          {(['incidents', 'actions', 'hsereports'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-xs font-medium transition-colors ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF]'}`}>
              {tab === 'incidents' ? 'Incidents' : tab === 'actions' ? 'Actions' : 'Reports'}
            </button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Column 1 */}
          <div className="w-full md:w-80 flex-shrink-0 border-r border-[#1F2937] flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1F2937] flex-shrink-0">
              <span className="text-[12px] text-[#9CA3AF]">
                {activeTab === 'incidents' ? `Incidents (${incidents.length})` : activeTab === 'actions' ? `Actions (${actions.length})` : `Reports (${hseReports.length})`}
              </span>
            </div>

            {/* New Incident Form */}
            {showForm && activeTab === 'incidents' && (
              <div className="bg-[#0F172A] border-b border-[#1F2937] p-4 space-y-2 flex-shrink-0">
                <select value={newIncident.type} onChange={e => setNewIncident({...newIncident, type: e.target.value})} className={inputClass}>
                  {['Near Miss', 'Equipment Damage', 'Minor Injury', 'Environmental', 'Fire', 'Security'].map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="datetime-local" value={newIncident.dateTime} onChange={e => setNewIncident({...newIncident, dateTime: e.target.value})} className={inputClass} />
                <input placeholder="Location / Well" value={newIncident.location} onChange={e => setNewIncident({...newIncident, location: e.target.value})} className={inputClass} />
                <textarea placeholder="Description" rows={3} value={newIncident.description} onChange={e => setNewIncident({...newIncident, description: e.target.value})} className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-2 py-1 text-xs text-[#F9FAFB] focus:outline-none focus:border-[#F59E0B] placeholder-[#6B7280] resize-none" />
                <textarea placeholder="Immediate Action" rows={2} value={newIncident.immediateAction} onChange={e => setNewIncident({...newIncident, immediateAction: e.target.value})} className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-2 py-1 text-xs text-[#F9FAFB] focus:outline-none focus:border-[#F59E0B] placeholder-[#6B7280] resize-none" />
                <input placeholder="Reported By" value={newIncident.reportedBy} onChange={e => setNewIncident({...newIncident, reportedBy: e.target.value})} className={inputClass} />
                <select value={newIncident.severity} onChange={e => setNewIncident({...newIncident, severity: e.target.value})} className={inputClass}>
                  {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s}>{s}</option>)}
                </select>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSaveIncident} className="flex-1 bg-[#F59E0B] text-black h-7 rounded text-xs font-semibold hover:bg-[#D97706]">Save</button>
                  <button onClick={() => setShowForm(false)} className="flex-1 border border-[#1F2937] text-[#9CA3AF] h-7 rounded text-xs">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'incidents' && incidents.map(inc => (
                <div key={inc.id} onClick={() => { setSelectedIncident(inc); setMobileOverlayOpen(true) }}
                  className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors ${selectedIncident.id === inc.id ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {severityDot(inc.severity)}
                      <span className="font-mono text-xs text-[#6B7280]">{inc.id}</span>
                    </div>
                    <StatusBadge status={inc.status} />
                  </div>
                  <div className="font-syne text-sm font-semibold text-[#F9FAFB] mt-0.5">{inc.type}</div>
                  <div className="text-xs text-[#9CA3AF]">{inc.date} · {inc.location}</div>
                </div>
              ))}
              {activeTab === 'actions' && actions.map(a => (
                <div key={a.id} onClick={() => { setSelectedAction(a); setMobileOverlayOpen(true) }}
                  className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors ${selectedAction.id === a.id ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-[#6B7280]">{a.id}</span>
                    <StatusBadge status={a.status === 'Open' ? 'In Progress' : a.status} />
                  </div>
                  <div className="text-sm font-semibold text-[#F9FAFB] mt-0.5">{a.description}</div>
                  <div className="text-xs text-[#9CA3AF]">{a.assignedTo} · Due {a.dueDate}</div>
                </div>
              ))}
              {activeTab === 'hsereports' && hseReports.map(r => (
                <div key={r.id} onClick={() => setMobileOverlayOpen(true)}
                  className="px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-[#6B7280]">{r.id}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="text-sm font-semibold text-[#F9FAFB] mt-0.5">{r.period}</div>
                  <div className="text-xs text-[#9CA3AF]">{r.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 (desktop) */}
          <div className="hidden md:block flex-1 overflow-y-auto p-6">
            {activeTab === 'incidents' && <IncidentDetail />}
            {activeTab === 'actions' && <ActionDetail />}
            {activeTab === 'hsereports' && <ReportsDetail />}
          </div>

          {/* Context Panel */}
          {contextOpen && (
            <div className="hidden md:block w-80 flex-shrink-0 border-l border-[#1F2937] bg-[#0F172A] overflow-y-auto">
              <div className="px-4 py-3 border-b border-[#1F2937] flex items-center justify-between">
                <span className="text-[#F9FAFB] text-[13px] font-bold">Context</span>
                <button onClick={() => setContextOpen(false)} className="text-[#9CA3AF] hover:text-[#F9FAFB] text-sm">‹</button>
              </div>
              <div className="px-4 py-4 space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">HSE Statistics (30 Days)</div>
                  {[
                    { l: 'Total Incidents', v: '2', c: 'text-green-400' },
                    { l: 'Near Misses', v: '1', c: 'text-amber-400' },
                    { l: 'Open Corrective Actions', v: String(actions.filter(a => a.status !== 'Closed').length), c: 'text-amber-400' },
                    { l: 'LTI Year to Date', v: '0', c: 'text-green-400' },
                  ].map(s => (
                    <div key={s.l} className="flex justify-between py-1.5 border-b border-[#1F2937] last:border-0">
                      <span className="text-sm text-[#9CA3AF]">{s.l}</span>
                      <span className={`font-syne font-bold text-[16px] ${s.c}`}>{s.v}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#1F2937] pt-3">
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Incident Breakdown</div>
                  {[
                    { l: 'Near Miss', v: 2 },
                    { l: 'Equipment Damage', v: 1 },
                    { l: 'Minor Injury', v: 1 },
                    { l: 'Environmental', v: 1 },
                  ].map(s => (
                    <div key={s.l} className="flex justify-between text-sm py-1">
                      <span className="text-[#9CA3AF]">{s.l}</span>
                      <span className="text-[#F9FAFB] font-medium">{s.v}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#1F2937] pt-3">
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-2">LTI-Free Streak</div>
                  <div className="font-syne text-[32px] text-green-400">847</div>
                  <div className="text-[12px] text-[#9CA3AF]">consecutive days</div>
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
