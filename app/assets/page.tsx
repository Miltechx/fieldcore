'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import Toast from '@/components/Toast'
import { mockAssets, Asset } from '@/lib/mockData'

interface MaintenanceLog {
  id: string
  assetId: string
  date: string
  type: string
  description: string
  technician: string
  cost: number
  duration: string
  status: string
}

const initialLogs: MaintenanceLog[] = [
  { id: 'MNT-2025-012', assetId: 'VH-0011', date: '01 Mar 2025', type: 'Scheduled', description: 'Full service — engine oil, filters, brake inspection, tire rotation', technician: 'Base Mechanic', cost: 145000, duration: '4h', status: 'Completed' },
  { id: 'MNT-2025-011', assetId: 'GN-0003', date: '10 Apr 2025', type: 'Scheduled', description: '250-hour service — oil change, spark plugs, air filter, load test', technician: 'Perkins Technician', cost: 210000, duration: '3h', status: 'Completed' },
  { id: 'MNT-2025-010', assetId: 'MV-0001', date: '22 Apr 2025', type: 'Scheduled', description: 'Hull inspection, engine service, safety equipment check', technician: 'Marine Engineers Ltd', cost: 580000, duration: '2 days', status: 'Completed' },
  { id: 'MNT-2025-009', assetId: 'VH-0012', date: '15 Feb 2025', type: 'Scheduled', description: 'Full service — overdue by 2 weeks', technician: 'Base Mechanic', cost: 98000, duration: '3h', status: 'Completed' },
  { id: 'MNT-2025-008', assetId: 'CP-0002', date: '12 Mar 2025', type: 'Scheduled', description: 'Annual service — belts, valves, oil separator', technician: 'Atlas Copco Nigeria', cost: 185000, duration: '6h', status: 'Completed' },
]

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [logs] = useState<MaintenanceLog[]>(initialLogs)
  const [selectedAsset, setSelectedAsset] = useState<Asset>(mockAssets[0])
  const [activeTab, setActiveTab] = useState<'register' | 'schedule' | 'downtime'>('register')
  const [showForm, setShowForm] = useState(false)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [contextOpen, setContextOpen] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' })
  const [filterCategory, setFilterCategory] = useState('All')
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Vehicle', location: '', assignedTo: '', maintenanceInterval: 'Quarterly' })

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type })
  }

  const handleSaveAsset = () => {
    if (!newAsset.name) { showToast('Asset name is required', 'error'); return }
    const id = `AS-${String(assets.length + 100).padStart(4, '0')}`
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    const asset: Asset = {
      id, name: newAsset.name, category: newAsset.category, location: newAsset.location,
      lastMaintenance: '—', nextDue: '—', status: 'Operational',
      assignedTo: newAsset.assignedTo, maintenanceInterval: newAsset.maintenanceInterval, costYTD: 0
    }
    setAssets([...assets, asset])
    setSelectedAsset(asset)
    showToast('Asset registered successfully', 'success')
    setShowForm(false)
    setNewAsset({ name: '', category: 'Vehicle', location: '', assignedTo: '', maintenanceInterval: 'Quarterly' })
  }

  const categories = ['All', 'Vehicle', 'Generator', 'Pump', 'Compressor', 'Marine Vessel']
  const filteredAssets = filterCategory === 'All' ? assets : assets.filter(a => a.category === filterCategory)

  const overdueCount = assets.filter(a => a.status === 'Maintenance Due').length
  const totalCostYTD = assets.reduce((sum, a) => sum + a.costYTD, 0)

  const inputClass = "w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-8 text-xs text-[#F9FAFB] focus:outline-none focus:border-[#F59E0B] placeholder-[#6B7280]"

  const statusDot = (status: string) => {
    const c = status === 'Operational' ? 'bg-green-500' : status === 'Maintenance Due' ? 'bg-amber-500' : 'bg-red-500'
    return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c}`} />
  }

  const AssetDetail = () => {
    const assetLogs = logs.filter(l => l.assetId === selectedAsset.id)
    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-6">
          <div>
            <div className="font-mono text-[12px] text-[#9CA3AF]">{selectedAsset.id}</div>
            <h2 className="font-syne text-[22px] text-[#F9FAFB]">{selectedAsset.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] bg-[#0A0F1E] border border-[#1F2937] px-2 py-0.5 rounded text-[#9CA3AF]">{selectedAsset.category}</span>
              <StatusBadge status={selectedAsset.status} />
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => showToast('Maintenance scheduled', 'info')} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706]">Schedule Maintenance</button>
            <button onClick={() => showToast('Asset report generated')} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Generate Report</button>
          </div>
        </div>

        {selectedAsset.status === 'Maintenance Due' && (
          <div className="bg-amber-900/20 border border-amber-800 rounded p-3 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-amber-400 text-sm">Maintenance overdue — schedule immediately to maintain asset warranty and compliance.</span>
          </div>
        )}

        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 mb-4">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Asset Details</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              ['Asset ID', selectedAsset.id],
              ['Category', selectedAsset.category],
              ['Location', selectedAsset.location],
              ['Assigned To', selectedAsset.assignedTo],
              ['Last Maintenance', selectedAsset.lastMaintenance],
              ['Next Due', selectedAsset.nextDue],
              ['Interval', selectedAsset.maintenanceInterval],
              ['Cost YTD', `₦${selectedAsset.costYTD.toLocaleString()}`],
            ].map(([l, v]) => (
              <div key={l}>
                <div className="text-[11px] text-[#9CA3AF]">{l}</div>
                <div className="text-[13px] text-[#F9FAFB]">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] rounded p-4">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Maintenance History</div>
          {assetLogs.length > 0 ? (
            <div className="space-y-3">
              {assetLogs.map(log => (
                <div key={log.id} className="border border-[#1F2937] rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <div className="font-mono text-xs text-[#6B7280]">{log.id}</div>
                      <div className="text-sm text-[#F9FAFB]">{log.description}</div>
                    </div>
                    <StatusBadge status={log.status} />
                  </div>
                  <div className="flex gap-4 text-xs text-[#9CA3AF] mt-1">
                    <span>{log.date}</span>
                    <span>{log.technician}</span>
                    <span>₦{log.cost.toLocaleString()}</span>
                    <span>{log.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">No maintenance records found for this asset.</p>
          )}
          <button onClick={() => showToast('Maintenance log entry added', 'info')} className="mt-3 border border-[#1F2937] text-[#9CA3AF] px-3 h-7 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">+ Add Maintenance Record</button>
        </div>
      </div>
    )
  }

  const ScheduleView = () => {
    const dueAssets = assets.filter(a => a.status === 'Maintenance Due' || a.status === 'Operational')
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne text-[20px] text-[#F9FAFB]">Maintenance Schedule</h2>
          <button onClick={() => showToast('Schedule exported')} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">Export Schedule</button>
        </div>

        {/* Overdue Banner */}
        {overdueCount > 0 && (
          <div className="bg-amber-900/20 border border-amber-800 rounded p-3 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-amber-400 text-sm">{overdueCount} asset{overdueCount > 1 ? 's' : ''} with overdue maintenance — action required</span>
          </div>
        )}

        <div className="space-y-2">
          {dueAssets.map(asset => {
            const isOverdue = asset.status === 'Maintenance Due'
            return (
              <div key={asset.id} className={`bg-[#111827] border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${isOverdue ? 'border-amber-800/50' : 'border-[#1F2937]'}`}>
                <div className="flex items-center gap-3">
                  {statusDot(asset.status)}
                  <div>
                    <div className="font-mono text-xs text-[#6B7280]">{asset.id}</div>
                    <div className="text-sm font-semibold text-[#F9FAFB]">{asset.name}</div>
                    <div className="text-xs text-[#9CA3AF]">{asset.location} · {asset.maintenanceInterval}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] text-[#9CA3AF]">Next Due</div>
                    <div className={`text-sm font-medium ${isOverdue ? 'text-amber-400' : 'text-[#F9FAFB]'}`}>{asset.nextDue}</div>
                  </div>
                  <StatusBadge status={asset.status} />
                  <button onClick={() => showToast(`Maintenance scheduled for ${asset.name}`, 'info')} className="bg-[#F59E0B] text-black font-semibold px-3 h-7 rounded text-xs hover:bg-[#D97706]">Schedule</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const DowntimeView = () => {
    const categories_breakdown = [
      { cat: 'Vehicle', count: 2, cost: 700000 },
      { cat: 'Generator', count: 2, cost: 950000 },
      { cat: 'Pump', count: 2, cost: 385000 },
      { cat: 'Compressor', count: 1, cost: 320000 },
      { cat: 'Marine Vessel', count: 1, cost: 1200000 },
    ]
    const maxCost = Math.max(...categories_breakdown.map(c => c.cost))

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne text-[20px] text-[#F9FAFB]">Cost &amp; Downtime Analysis</h2>
          <button onClick={() => showToast('Report generated')} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706]">Generate Report</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { l: 'Total Cost YTD', v: `₦${(totalCostYTD / 1000000).toFixed(1)}M`, c: 'text-[#F59E0B]' },
            { l: 'Assets Tracked', v: String(assets.length), c: 'text-[#F9FAFB]' },
            { l: 'Overdue Assets', v: String(overdueCount), c: 'text-amber-400' },
            { l: 'Avg Cost/Asset', v: `₦${Math.round(totalCostYTD / assets.length / 1000)}K`, c: 'text-[#F9FAFB]' },
          ].map(s => (
            <div key={s.l} className="bg-[#111827] border border-[#1F2937] rounded p-4">
              <div className="text-[11px] text-[#9CA3AF]">{s.l}</div>
              <div className={`font-syne text-[24px] font-bold mt-1 ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 mb-4">
          <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-4">Maintenance Cost by Category (YTD)</div>
          {categories_breakdown.map(c => (
            <div key={c.cat} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#9CA3AF]">{c.cat} ({c.count} assets)</span>
                <span className="text-[#F9FAFB]">₦{(c.cost / 1000).toFixed(0)}K</span>
              </div>
              <div className="w-full bg-[#1F2937] rounded-full h-1.5">
                <div className="bg-[#F59E0B] h-1.5 rounded-full transition-all" style={{ width: `${(c.cost / maxCost) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-[#1F2937] rounded overflow-hidden">
          <div className="px-5 py-3 border-b border-[#1F2937]">
            <div className="text-[10px] uppercase tracking-widest text-[#F59E0B]">Recent Maintenance Records</div>
          </div>
          {logs.slice(0, 5).map(log => (
            <div key={log.id} className="px-5 py-3 border-b border-[#1F2937] last:border-0 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#6B7280]">{log.id}</span>
                  <span className="text-xs text-[#9CA3AF]">{log.assetId}</span>
                </div>
                <div className="text-sm text-[#F9FAFB]">{log.description.slice(0, 60)}...</div>
                <div className="text-xs text-[#6B7280]">{log.date} · {log.technician}</div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-sm font-medium text-[#F9FAFB]">₦{log.cost.toLocaleString()}</div>
                <div className="text-xs text-[#6B7280]">{log.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const MobileOverlay = () => (
    <div className="fixed inset-0 bg-[#111827] z-40 overflow-y-auto p-4 md:hidden">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setMobileOverlayOpen(false)} className="text-[#F59E0B] text-sm">← Back</button>
        <span className="font-syne text-lg text-[#F9FAFB]">
          {activeTab === 'register' ? selectedAsset.name : activeTab === 'schedule' ? 'Maintenance Schedule' : 'Cost & Downtime'}
        </span>
      </div>
      {activeTab === 'register' && <AssetDetail />}
      {activeTab === 'schedule' && <ScheduleView />}
      {activeTab === 'downtime' && <DowntimeView />}
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
            <div className="font-syne text-[18px] text-[#F9FAFB]">Assets &amp; Maintenance</div>
            <div className="text-[12px] text-[#9CA3AF]">Equipment register, maintenance schedule and cost tracking</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1">
              {(['register', 'schedule', 'downtime'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1 text-sm font-medium transition-colors ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}`}>
                  {tab === 'register' ? 'Asset Register' : tab === 'schedule' ? 'Maintenance Schedule' : 'Cost & Downtime'}
                </button>
              ))}
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] transition-colors">+ Add Asset</button>
            <button onClick={() => setContextOpen(!contextOpen)} className="hidden md:flex border border-[#1F2937] text-[#9CA3AF] px-2 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors items-center">{contextOpen ? '›' : '‹'}</button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-[#1F2937] px-4">
          {(['register', 'schedule', 'downtime'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-xs font-medium transition-colors ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF]'}`}>
              {tab === 'register' ? 'Register' : tab === 'schedule' ? 'Schedule' : 'Costs'}
            </button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Column 1 */}
          <div className="w-full md:w-80 flex-shrink-0 border-r border-[#1F2937] flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1F2937] flex-shrink-0 flex items-center justify-between">
              <span className="text-[12px] text-[#9CA3AF]">{filteredAssets.length} assets</span>
              {activeTab === 'register' && (
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-6 text-[11px] text-[#9CA3AF] focus:outline-none focus:border-[#F59E0B]">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
            </div>

            {/* New Asset Form */}
            {showForm && (
              <div className="bg-[#0F172A] border-b border-[#1F2937] p-4 space-y-2 flex-shrink-0">
                <input placeholder="Asset Name" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className={inputClass} />
                <select value={newAsset.category} onChange={e => setNewAsset({...newAsset, category: e.target.value})} className={inputClass}>
                  {['Vehicle', 'Generator', 'Pump', 'Compressor', 'Marine Vessel', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
                <input placeholder="Location" value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} className={inputClass} />
                <input placeholder="Assigned To" value={newAsset.assignedTo} onChange={e => setNewAsset({...newAsset, assignedTo: e.target.value})} className={inputClass} />
                <select value={newAsset.maintenanceInterval} onChange={e => setNewAsset({...newAsset, maintenanceInterval: e.target.value})} className={inputClass}>
                  {['Monthly', 'Quarterly', 'Bi-Annual', 'Annual'].map(i => <option key={i}>{i}</option>)}
                </select>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSaveAsset} className="flex-1 bg-[#F59E0B] text-black h-7 rounded text-xs font-semibold hover:bg-[#D97706]">Save</button>
                  <button onClick={() => setShowForm(false)} className="flex-1 border border-[#1F2937] text-[#9CA3AF] h-7 rounded text-xs">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {(activeTab === 'register' ? filteredAssets : activeTab === 'schedule' ? assets.filter(a => a.status === 'Maintenance Due' || a.status === 'Operational') : assets).map(asset => (
                <div key={asset.id} onClick={() => { setSelectedAsset(asset); setMobileOverlayOpen(true) }}
                  className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors ${selectedAsset.id === asset.id && activeTab === 'register' ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {statusDot(asset.status)}
                      <span className="font-mono text-xs text-[#6B7280]">{asset.id}</span>
                    </div>
                    <StatusBadge status={asset.status} />
                  </div>
                  <div className="font-syne text-sm font-semibold text-[#F9FAFB] mt-0.5">{asset.name}</div>
                  <div className="text-xs text-[#9CA3AF]">{asset.category} · {asset.location}</div>
                  <div className="text-xs text-[#6B7280] mt-1">Next: {asset.nextDue}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 (desktop) */}
          <div className="hidden md:block flex-1 overflow-y-auto p-6">
            {activeTab === 'register' && <AssetDetail />}
            {activeTab === 'schedule' && <ScheduleView />}
            {activeTab === 'downtime' && <DowntimeView />}
          </div>

          {/* Context Panel */}
          {contextOpen && (
            <div className="hidden md:block w-72 flex-shrink-0 border-l border-[#1F2937] bg-[#0F172A] overflow-y-auto">
              <div className="px-4 py-3 border-b border-[#1F2937] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#F9FAFB] text-[13px] font-bold">Context</span>
                  {overdueCount > 0 && <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
                </div>
                <button onClick={() => setContextOpen(false)} className="text-[#9CA3AF] hover:text-[#F9FAFB] text-sm">‹</button>
              </div>
              <div className="px-4 py-4 space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Fleet Summary</div>
                  {[
                    { l: 'Total Assets', v: String(assets.length), c: 'text-[#F9FAFB]' },
                    { l: 'Operational', v: String(assets.filter(a => a.status === 'Operational').length), c: 'text-green-400' },
                    { l: 'Maintenance Due', v: String(overdueCount), c: 'text-amber-400' },
                    { l: 'Total Cost YTD', v: `₦${(totalCostYTD / 1000000).toFixed(1)}M`, c: 'text-[#F59E0B]' },
                  ].map(s => (
                    <div key={s.l} className="flex justify-between py-1.5 border-b border-[#1F2937] last:border-0">
                      <span className="text-sm text-[#9CA3AF]">{s.l}</span>
                      <span className={`font-syne font-bold text-[16px] ${s.c}`}>{s.v}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#1F2937] pt-3">
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Overdue Assets</div>
                  {assets.filter(a => a.status === 'Maintenance Due').map(a => (
                    <div key={a.id} className="mb-2 pb-2 border-b border-[#1F2937] last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-[#F9FAFB]">{a.name}</div>
                          <div className="text-xs text-[#6B7280]">{a.location}</div>
                        </div>
                        <span className="text-xs text-amber-400 flex-shrink-0 ml-2">{a.nextDue}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#1F2937] pt-3">
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Quick Actions</div>
                  {['Schedule All Overdue →', 'Export Asset Register', 'Download Maintenance Report'].map(a => (
                    <button key={a} onClick={() => showToast(`${a.replace(' →', '')} — done`, 'info')} className="h-8 text-xs border border-[#1F2937] text-[#9CA3AF] hover:border-[#F59E0B] hover:text-[#F59E0B] rounded w-full text-left px-3 mb-2 transition-colors">{a}</button>
                  ))}
                </div>
                <div className="border-t border-[#1F2937] pt-3">
                  <div className="text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Assets by Category</div>
                  {['Vehicle', 'Generator', 'Pump', 'Compressor', 'Marine Vessel'].map(cat => {
                    const count = assets.filter(a => a.category === cat).length
                    return count > 0 ? (
                      <div key={cat} className="flex justify-between text-sm py-1">
                        <span className="text-[#9CA3AF]">{cat}</span>
                        <span className="text-[#F9FAFB] font-medium">{count}</span>
                      </div>
                    ) : null
                  })}
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
