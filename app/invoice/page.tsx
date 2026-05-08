'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import StatusBadge from '@/components/StatusBadge'
import Toast from '@/components/Toast'
import { mockInvoices, Invoice, InvoiceLineItem } from '@/lib/mockData'

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(mockInvoices[0])
  const [activeTab, setActiveTab] = useState<'invoices' | 'new'>('invoices')
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [contextOpen, setContextOpen] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' })
  const [invoiceSearch, setInvoiceSearch] = useState('')

  const emptyLine = (): InvoiceLineItem => ({
    id: `LI-new-${Date.now()}`, description: '', quantity: 1, unit: 'Job', unitPrice: 0, total: 0
  })

  const [newInvoice, setNewInvoice] = useState({
    client: '', clientEmail: '', clientAddress: '', jobReference: '',
    issueDate: new Date().toISOString().split('T')[0], dueDate: '', notes: '',
    lineItems: [emptyLine()] as InvoiceLineItem[]
  })

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000)
  }

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  const calcSubtotal = (items: InvoiceLineItem[]) =>
    items.reduce((sum, item) => sum + item.total, 0)

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setNewInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }
        updated.total = Number(updated.quantity) * Number(updated.unitPrice)
        return updated
      })
    }))
  }

  const addLineItem = () => {
    setNewInvoice(prev => ({ ...prev, lineItems: [...prev.lineItems, emptyLine()] }))
  }

  const removeLineItem = (id: string) => {
    setNewInvoice(prev => ({ ...prev, lineItems: prev.lineItems.filter(i => i.id !== id) }))
  }

  const handleSaveDraft = () => {
    if (!newInvoice.client) { showToast('Client name is required', 'error'); return }
    const sub = calcSubtotal(newInvoice.lineItems)
    const vat = sub * 0.075
    const inv: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `FC-INV-${new Date().getFullYear()}-${String(invoices.length + 50).padStart(3, '0')}`,
      client: newInvoice.client, clientEmail: newInvoice.clientEmail,
      clientAddress: newInvoice.clientAddress, jobReference: newInvoice.jobReference,
      issueDate: newInvoice.issueDate, dueDate: newInvoice.dueDate,
      status: 'Draft', lineItems: newInvoice.lineItems,
      subtotal: sub, vat, total: sub + vat, notes: newInvoice.notes
    }
    setInvoices(prev => [inv, ...prev])
    setSelectedInvoice(inv)
    setActiveTab('invoices')
    showToast('Invoice saved as draft')
    setNewInvoice({ client: '', clientEmail: '', clientAddress: '', jobReference: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '', notes: '', lineItems: [emptyLine()] })
  }

  const handleGenerateSend = () => {
    if (!newInvoice.client) { showToast('Client name is required', 'error'); return }
    const sub = calcSubtotal(newInvoice.lineItems)
    const vat = sub * 0.075
    const inv: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `FC-INV-${new Date().getFullYear()}-${String(invoices.length + 50).padStart(3, '0')}`,
      client: newInvoice.client, clientEmail: newInvoice.clientEmail,
      clientAddress: newInvoice.clientAddress, jobReference: newInvoice.jobReference,
      issueDate: newInvoice.issueDate, dueDate: newInvoice.dueDate,
      status: 'Sent', lineItems: newInvoice.lineItems,
      subtotal: sub, vat, total: sub + vat, notes: newInvoice.notes, sentVia: 'email'
    }
    setInvoices(prev => [inv, ...prev])
    setSelectedInvoice(inv)
    setActiveTab('invoices')
    showToast('Invoice created and ready to send')
    setNewInvoice({ client: '', clientEmail: '', clientAddress: '', jobReference: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '', notes: '', lineItems: [emptyLine()] })
  }

  const handleMarkPaid = (inv: Invoice) => {
    const updated = { ...inv, status: 'Paid' as const }
    setInvoices(prev => prev.map(i => i.id === inv.id ? updated : i))
    setSelectedInvoice(updated)
    showToast('Invoice marked as paid')
  }

  const handleSendEmail = (inv: Invoice) => {
    window.location.href = `mailto:${inv.clientEmail}?subject=${encodeURIComponent(`Invoice ${inv.invoiceNumber} — ${inv.client}`)}&body=${encodeURIComponent(`Please find attached invoice ${inv.invoiceNumber} for ${inv.jobReference}. Total amount: ${formatNaira(inv.total)}.`)}`
    showToast('Opening email client...')
  }

  const handleSendWhatsApp = (inv: Invoice) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Invoice ${inv.invoiceNumber} for ${inv.client}. Job: ${inv.jobReference}. Amount: ${formatNaira(inv.total)}. Please confirm receipt.`)}`)
    showToast('Opening WhatsApp...')
  }

  const filteredInvoices = invoices.filter(i =>
    !invoiceSearch || i.client.toLowerCase().includes(invoiceSearch.toLowerCase()) || i.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase())
  )

  const outstanding = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((s, i) => s + i.total, 0)
  const paid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0)
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.total, 0)
  const draft = invoices.filter(i => i.status === 'Draft').reduce((s, i) => s + i.total, 0)

  const inputCls = "w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-3 h-9 font-inter text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B]"

  // ── Invoice Detail View ──────────────────────────────────────────────────────
  const InvoiceDetail = ({ inv }: { inv: Invoice }) => (
    <div>
      {/* Header block */}
      <div className="bg-[#111827] border border-[#1F2937] rounded p-6 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-mona text-2xl font-bold text-[#F59E0B]">INVOICE</div>
            <div className="font-mono text-sm text-[#9CA3AF] mt-1">{inv.invoiceNumber}</div>
            <div className="mt-2"><StatusBadge status={inv.status} /></div>
          </div>
          <div className="text-right">
            <div className="font-mona text-base font-semibold text-[#F9FAFB]">Kalu Field Services Ltd.</div>
            <div className="font-inter text-xs text-[#9CA3AF] mt-1">Port Harcourt, Rivers State, Nigeria</div>
            <div className="font-inter text-xs text-[#9CA3AF]">fieldservices@kalu.ng</div>
          </div>
        </div>

        <div className="border-b border-[#1F2937] my-5" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-inter text-[10px] uppercase tracking-wide text-[#F59E0B] mb-1">Bill To</div>
            <div className="font-mona text-sm font-semibold text-[#F9FAFB]">{inv.client}</div>
            <div className="font-inter text-xs text-[#9CA3AF] mt-1">{inv.clientAddress}</div>
            <div className="font-inter text-xs text-[#9CA3AF]">{inv.clientEmail}</div>
          </div>
          <div className="text-right">
            <div className="space-y-1">
              {[
                ['Issue Date', inv.issueDate, false],
                ['Due Date', inv.dueDate, inv.status === 'Overdue'],
                ['Job Reference', inv.jobReference, false],
              ].map(([label, val, red]) => (
                <div key={String(label)} className="flex justify-end gap-3">
                  <span className="font-inter text-xs text-[#9CA3AF]">{String(label)}:</span>
                  <span className={`font-inter text-xs ${red ? 'text-red-400' : 'text-[#F9FAFB]'} ${String(label) === 'Job Reference' ? 'font-mono' : ''}`}>{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="bg-[#111827] border border-[#1F2937] rounded mb-4 overflow-hidden">
        <div className="bg-[#0F172A] px-4 py-2 grid grid-cols-12 gap-2">
          {[['Description', 5], ['Qty', 1], ['Unit', 2], ['Unit Price', 2], ['Total', 2]].map(([h, span]) => (
            <div key={String(h)} className={`col-span-${span} font-inter text-[10px] uppercase tracking-wide text-[#F59E0B]`}>{String(h)}</div>
          ))}
        </div>
        {inv.lineItems.map(item => (
          <div key={item.id} className="px-4 py-3 border-t border-[#1F2937] grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5 font-inter text-sm text-[#F9FAFB]">{item.description}</div>
            <div className="col-span-1 font-jakarta text-sm text-[#F9FAFB]">{item.quantity}</div>
            <div className="col-span-2 font-inter text-xs text-[#9CA3AF]">{item.unit}</div>
            <div className="col-span-2 font-jakarta text-sm text-[#F9FAFB]">{formatNaira(item.unitPrice)}</div>
            <div className="col-span-2 font-jakarta text-sm font-bold text-[#F59E0B] text-right">{formatNaira(item.total)}</div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="bg-[#111827] border border-[#1F2937] rounded p-5 mb-4">
        <div className="max-w-xs ml-auto space-y-2">
          <div className="flex justify-between">
            <span className="font-inter text-sm text-[#9CA3AF]">Subtotal</span>
            <span className="font-jakarta text-sm text-[#F9FAFB]">{formatNaira(inv.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-inter text-sm text-[#9CA3AF]">VAT (7.5%)</span>
            <span className="font-jakarta text-sm text-[#F9FAFB]">{formatNaira(inv.vat)}</span>
          </div>
          <div className="border-b border-[#1F2937] pt-1" />
          <div className="flex justify-between items-baseline pt-1">
            <span className="font-mona text-base font-bold text-[#F9FAFB]">TOTAL</span>
            <span className="font-jakarta text-xl font-bold text-[#F59E0B]">{formatNaira(inv.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-[#111827] border border-[#1F2937] rounded p-4 mb-4">
        <div className="font-inter text-[10px] uppercase tracking-wide text-[#F59E0B] mb-2">Payment Notes</div>
        <p className="font-inter text-sm text-[#9CA3AF]">{inv.notes}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { window.print(); showToast('Opening print dialog — save as PDF') }} className="bg-[#F59E0B] text-black font-semibold px-4 h-9 rounded text-sm hover:bg-[#D97706] font-inter">Download PDF</button>
        <button onClick={() => handleSendEmail(inv)} className="border border-[#1F2937] text-[#9CA3AF] px-4 h-9 rounded text-sm hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">Send via Email</button>
        <button onClick={() => handleSendWhatsApp(inv)} className="border border-green-800 text-green-400 px-4 h-9 rounded text-sm hover:bg-green-900/30 transition-colors font-inter">Send via WhatsApp</button>
        {(inv.status === 'Sent' || inv.status === 'Overdue') && (
          <button onClick={() => handleMarkPaid(inv)} className="border border-green-800 text-green-400 px-4 h-9 rounded text-sm hover:bg-green-900/30 transition-colors font-inter">Mark as Paid</button>
        )}
      </div>
    </div>
  )

  // ── New Invoice Form ─────────────────────────────────────────────────────────
  const NewInvoiceForm = () => {
    const sub = calcSubtotal(newInvoice.lineItems)
    const vat = sub * 0.075
    return (
      <div className="flex-1 overflow-y-auto p-6 pb-16 md:pb-6">
        {/* Client Details */}
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 mb-4">
          <div className="font-inter text-[10px] uppercase tracking-wide text-[#F59E0B] mb-4">Client Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-inter text-[11px] text-[#9CA3AF] block mb-1">Client / Company Name *</label>
              <input value={newInvoice.client} onChange={e => setNewInvoice(p => ({...p, client: e.target.value}))} placeholder="e.g. SEPLAT Energy" className={inputCls} />
            </div>
            <div>
              <label className="font-inter text-[11px] text-[#9CA3AF] block mb-1">Client Email</label>
              <input type="email" value={newInvoice.clientEmail} onChange={e => setNewInvoice(p => ({...p, clientEmail: e.target.value}))} placeholder="procurement@client.com" className={inputCls} />
            </div>
            <div>
              <label className="font-inter text-[11px] text-[#9CA3AF] block mb-1">Client Address</label>
              <textarea rows={2} value={newInvoice.clientAddress} onChange={e => setNewInvoice(p => ({...p, clientAddress: e.target.value}))} placeholder="Full address" className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-3 py-2 font-inter text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B] resize-none" />
            </div>
            <div>
              <label className="font-inter text-[11px] text-[#9CA3AF] block mb-1">Job Reference</label>
              <input value={newInvoice.jobReference} onChange={e => setNewInvoice(p => ({...p, jobReference: e.target.value}))} placeholder="e.g. WO-2024-041 — Agbami-7" className={inputCls} />
              <p className="font-inter text-[10px] text-[#6B7280] mt-1">Link to a job e.g. WO-2024-041</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 mb-4">
          <div className="font-inter text-[10px] uppercase tracking-wide text-[#F59E0B] mb-4">Line Items</div>

          {/* Header row */}
          <div className="hidden md:grid grid-cols-12 gap-2 mb-2 px-1">
            {[['Description', 5], ['Qty', 1], ['Unit', 2], ['Unit Price (₦)', 2], ['Total', 2]].map(([h, span]) => (
              <div key={String(h)} className={`col-span-${span} font-inter text-[10px] text-[#9CA3AF] uppercase`}>{String(h)}</div>
            ))}
          </div>

          {newInvoice.lineItems.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center mb-2 relative group">
              <input value={item.description} onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                placeholder="Description" className="col-span-12 md:col-span-5 bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-8 font-inter text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B]" />
              <input type="number" min="1" value={item.quantity} onChange={e => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                className="col-span-4 md:col-span-1 bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-8 font-jakarta text-xs text-[#F9FAFB] focus:outline-none focus:border-[#F59E0B]" />
              <select value={item.unit} onChange={e => updateLineItem(item.id, 'unit', e.target.value)}
                className="col-span-4 md:col-span-2 bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-8 font-inter text-xs text-[#F9FAFB] focus:outline-none focus:border-[#F59E0B]">
                {['Job', 'Day', 'Hour', 'Item', 'Lump Sum'].map(u => <option key={u}>{u}</option>)}
              </select>
              <input type="number" min="0" value={item.unitPrice || ''} onChange={e => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                placeholder="0" className="col-span-4 md:col-span-2 bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-8 font-jakarta text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B]" />
              <div className="col-span-10 md:col-span-2 flex items-center justify-between">
                <span className="font-jakarta text-sm font-bold text-[#F59E0B]">{formatNaira(item.total)}</span>
                <button onClick={() => removeLineItem(item.id)} className="text-red-500 hover:text-red-400 text-lg leading-none flex-shrink-0 ml-2">×</button>
              </div>
            </div>
          ))}

          <button onClick={addLineItem} className="mt-3 border border-[#F59E0B]/50 text-[#F59E0B] px-4 h-8 rounded text-xs hover:bg-[#F59E0B]/10 transition-colors font-inter">+ Add Line Item</button>

          {/* Live totals */}
          <div className="mt-4 max-w-xs ml-auto space-y-1.5 border-t border-[#1F2937] pt-4">
            <div className="flex justify-between">
              <span className="font-inter text-sm text-[#9CA3AF]">Subtotal</span>
              <span className="font-jakarta text-sm text-[#F9FAFB]">{formatNaira(sub)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-inter text-sm text-[#9CA3AF]">VAT (7.5%)</span>
              <span className="font-jakarta text-sm text-[#F9FAFB]">{formatNaira(vat)}</span>
            </div>
            <div className="border-b border-[#1F2937] pt-1" />
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-mona text-sm font-bold text-[#F9FAFB]">TOTAL</span>
              <span className="font-jakarta text-xl font-bold text-[#F59E0B]">{formatNaira(sub + vat)}</span>
            </div>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="bg-[#111827] border border-[#1F2937] rounded p-5 mb-4">
          <div className="font-inter text-[10px] uppercase tracking-wide text-[#F59E0B] mb-4">Invoice Settings</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-inter text-[11px] text-[#9CA3AF] block mb-1">Issue Date</label>
              <input type="date" value={newInvoice.issueDate} onChange={e => setNewInvoice(p => ({...p, issueDate: e.target.value}))} className={inputCls} />
            </div>
            <div>
              <label className="font-inter text-[11px] text-[#9CA3AF] block mb-1">Due Date</label>
              <input type="date" value={newInvoice.dueDate} onChange={e => setNewInvoice(p => ({...p, dueDate: e.target.value}))} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="font-inter text-[11px] text-[#9CA3AF] block mb-1">Payment Notes</label>
              <textarea rows={2} value={newInvoice.notes} onChange={e => setNewInvoice(p => ({...p, notes: e.target.value}))}
                placeholder="Bank details, payment terms, etc."
                className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-3 py-2 font-inter text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B] resize-none" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleGenerateSend} className="bg-[#F59E0B] text-black font-semibold px-6 h-10 rounded text-sm hover:bg-[#D97706] font-inter">Generate &amp; Send</button>
          <button onClick={handleSaveDraft} className="border border-[#1F2937] text-[#9CA3AF] px-6 h-10 rounded text-sm hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">Save as Draft</button>
        </div>
      </div>
    )
  }

  // ── Mobile overlay ───────────────────────────────────────────────────────────
  const MobileOverlay = () => (
    <div className="fixed inset-0 bg-[#111827] z-40 overflow-y-auto p-4 md:hidden">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setMobileOverlayOpen(false)} className="font-inter text-sm text-[#F59E0B]">← Back</button>
        <span className="font-mona text-lg text-[#F9FAFB]">{selectedInvoice.client}</span>
      </div>
      <InvoiceDetail inv={selectedInvoice} />
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
            <div className="font-mona text-[18px] text-[#F9FAFB] font-semibold">Invoice Builder</div>
            <div className="font-inter text-xs text-[#9CA3AF]">Professional invoicing for oil &amp; gas services</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1">
              {(['invoices', 'new'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1 text-sm font-inter font-medium transition-colors ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'}`}>
                  {tab === 'invoices' ? 'Invoices' : 'New Invoice'}
                </button>
              ))}
            </div>
            <button onClick={() => setActiveTab('new')} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] transition-colors font-inter">+ New Invoice</button>
            <button onClick={() => setContextOpen(v => !v)} className="hidden md:flex border border-[#1F2937] text-[#9CA3AF] px-2 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors items-center">{contextOpen ? '›' : '‹'}</button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-[#1F2937] px-4">
          {(['invoices', 'new'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-xs font-inter font-medium transition-colors ${activeTab === tab ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : 'text-[#9CA3AF]'}`}>
              {tab === 'invoices' ? 'Invoices' : 'New Invoice'}
            </button>
          ))}
        </div>

        {activeTab === 'new' ? (
          <NewInvoiceForm />
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Column 1 — Invoice List */}
            <div className="w-full md:w-80 flex-shrink-0 border-r border-[#1F2937] flex flex-col overflow-hidden">
              {/* Stats strip */}
              <div className="px-4 py-3 border-b border-[#1F2937] bg-[#0F172A] flex justify-between flex-shrink-0">
                <div>
                  <div className="font-inter text-[10px] text-[#9CA3AF]">Outstanding</div>
                  <div className="font-jakarta text-sm font-bold text-[#F59E0B]">{formatNaira(outstanding)}</div>
                </div>
                <div>
                  <div className="font-inter text-[10px] text-[#9CA3AF]">Paid This Month</div>
                  <div className="font-jakarta text-sm font-bold text-green-400">{formatNaira(paid)}</div>
                </div>
              </div>

              <div className="px-4 py-2 border-b border-[#1F2937] flex-shrink-0">
                <input placeholder="Search invoices..." value={invoiceSearch} onChange={e => setInvoiceSearch(e.target.value)}
                  className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-7 font-inter text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B]" />
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredInvoices.map(inv => (
                  <div key={inv.id} onClick={() => { setSelectedInvoice(inv); setMobileOverlayOpen(true) }}
                    className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors ${selectedInvoice.id === inv.id ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-[#6B7280]">{inv.invoiceNumber}</span>
                      <StatusBadge status={inv.status} />
                    </div>
                    <div className="font-mona text-sm font-semibold text-[#F9FAFB] mt-0.5">{inv.client}</div>
                    <div className="font-inter text-xs text-[#9CA3AF] truncate max-w-[220px]">{inv.jobReference}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-jakarta text-sm font-bold text-[#F59E0B]">{formatNaira(inv.total)}</span>
                      <span className={`font-inter text-[11px] ${inv.status === 'Overdue' ? 'text-red-400' : 'text-[#6B7280]'}`}>Due {inv.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 — Invoice Detail (desktop) */}
            <div className="hidden md:block flex-1 overflow-y-auto p-6">
              <InvoiceDetail inv={selectedInvoice} />
            </div>

            {/* Column 3 — Context Panel */}
            {contextOpen && (
              <div className="hidden md:block w-72 flex-shrink-0 border-l border-[#1F2937] bg-[#0F172A] overflow-y-auto">
                <div className="px-4 py-3 border-b border-[#1F2937] flex items-center justify-between">
                  <span className="font-mona text-[13px] text-[#F9FAFB] font-semibold">Invoice Summary</span>
                  <button onClick={() => setContextOpen(false)} className="text-[#9CA3AF] hover:text-[#F9FAFB] text-sm">‹</button>
                </div>
                <div className="px-4 py-4 space-y-4">
                  <div>
                    <div className="font-inter text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Financial Overview</div>
                    {[
                      { l: 'Outstanding', v: formatNaira(outstanding), c: 'text-[#F59E0B]' },
                      { l: 'Paid This Month', v: formatNaira(paid), c: 'text-green-400' },
                      { l: 'Overdue', v: formatNaira(overdue), c: 'text-red-400' },
                      { l: 'Draft', v: formatNaira(draft), c: 'text-[#9CA3AF]' },
                    ].map(s => (
                      <div key={s.l} className="flex justify-between py-1.5 border-b border-[#1F2937] last:border-0">
                        <span className="font-inter text-sm text-[#9CA3AF]">{s.l}</span>
                        <span className={`font-jakarta font-bold text-[15px] ${s.c}`}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#1F2937] pt-3">
                    <div className="font-inter text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Recent Invoices</div>
                    {invoices.slice(0, 4).map(inv => (
                      <div key={inv.id} onClick={() => setSelectedInvoice(inv)} className="flex justify-between items-center py-1.5 border-b border-[#1F2937] last:border-0 cursor-pointer hover:opacity-80">
                        <div>
                          <div className="font-inter text-xs text-[#F9FAFB]">{inv.client}</div>
                          <div className="font-mono text-[10px] text-[#6B7280]">{inv.invoiceNumber}</div>
                        </div>
                        <StatusBadge status={inv.status} />
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#1F2937] pt-3">
                    <div className="font-inter text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Quick Actions</div>
                    {[
                      { l: 'Create New Invoice', fn: () => setActiveTab('new') },
                      { l: 'Download All as PDF', fn: () => showToast('Preparing bulk PDF export...') },
                      { l: 'View Payment History', fn: () => showToast('Payment history coming soon', 'info') },
                    ].map(a => (
                      <button key={a.l} onClick={a.fn} className="h-8 text-xs border border-[#1F2937] text-[#9CA3AF] hover:border-[#F59E0B] hover:text-[#F59E0B] rounded w-full text-left px-3 mb-2 transition-colors font-inter">{a.l}</button>
                    ))}
                  </div>
                  <div className="border-t border-[#1F2937] pt-3">
                    <div className="font-inter text-[10px] uppercase tracking-widest text-[#F59E0B] mb-3">Client Info</div>
                    {[
                      ['Client', selectedInvoice.client],
                      ['Email', selectedInvoice.clientEmail],
                      ['Last Invoice', selectedInvoice.issueDate],
                    ].map(([l, v]) => (
                      <div key={l} className="py-1">
                        <div className="font-inter text-[10px] text-[#9CA3AF]">{l}</div>
                        <div className="font-inter text-[12px] text-[#F9FAFB] truncate">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(t => ({...t, visible: false}))} />
    </div>
  )
}
