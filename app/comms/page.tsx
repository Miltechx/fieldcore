'use client'

import { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import Toast from '@/components/Toast'
import { mockCommsGroups, ChatGroup, ChatMessage } from '@/lib/mockData'

export default function CommsPage() {
  const [groups, setGroups] = useState<ChatGroup[]>(mockCommsGroups)
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup>(mockCommsGroups[0])
  const [messageInput, setMessageInput] = useState('')
  const [showNewGroupForm, setShowNewGroupForm] = useState(false)
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false)
  const [showMinutes, setShowMinutes] = useState(false)
  const [editingMinutes, setEditingMinutes] = useState('')
  const [showCall, setShowCall] = useState(false)
  const [callSeconds, setCallSeconds] = useState(0)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)
  const [groupForm, setGroupForm] = useState({ name: '', type: 'department', duration: '2 Weeks' })
  const [meetingForm, setMeetingForm] = useState({ title: '', date: '', time: '', duration: '1 hour', channel: mockCommsGroups[0].id, agenda: '', record: true, minutes: true })
  const [minutesSaved, setMinutesSaved] = useState(false)
  const [groupSearch, setGroupSearch] = useState('')
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const minutesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000)
  }

  const formatCallTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedGroup.messages])

  useEffect(() => {
    if (!showCall) { setCallSeconds(0); return }
    const interval = setInterval(() => setCallSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [showCall])

  useEffect(() => {
    if (minutesDebounceRef.current) clearTimeout(minutesDebounceRef.current)
    minutesDebounceRef.current = setTimeout(() => setMinutesSaved(true), 1000)
    setMinutesSaved(false)
  }, [editingMinutes])

  const sendMessage = () => {
    if (!messageInput.trim()) return
    const newMsg: ChatMessage = {
      id: `MSG-${Date.now()}`, sender: 'Emmanuel Kalu', senderInitials: 'EK',
      content: messageInput.trim(), type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    const updated = { ...selectedGroup, messages: [...selectedGroup.messages, newMsg], lastMessage: messageInput.trim(), lastMessageTime: 'Just now' }
    setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updated : g))
    setSelectedGroup(updated)
    setMessageInput('')
  }

  const createGroup = () => {
    if (!groupForm.name.trim()) { showToast('Group name is required', 'error'); return }
    const grp: ChatGroup = {
      id: `GRP-${Date.now()}`, name: groupForm.name,
      type: groupForm.type as 'company' | 'department' | 'temporary',
      members: 1, lastMessage: 'Group created', lastMessageTime: 'Just now',
      lastMessageSender: 'Emmanuel Kalu', unread: 0,
      expiresAt: groupForm.type === 'temporary' ? groupForm.duration : undefined,
      messages: [{ id: `MSG-${Date.now()}`, sender: 'System', senderInitials: 'FC',
        content: `${groupForm.name} group created by Emmanuel Kalu.${groupForm.type === 'temporary' ? ` Auto-archives after ${groupForm.duration}.` : ''}`,
        type: 'system', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
    }
    setGroups(prev => [grp, ...prev])
    setSelectedGroup(grp)
    setShowNewGroupForm(false)
    setGroupForm({ name: '', type: 'department', duration: '2 Weeks' })
    showToast('Group created successfully')
  }

  const scheduleMeeting = () => {
    if (!meetingForm.title.trim()) { showToast('Meeting title is required', 'error'); return }
    const msg: ChatMessage = {
      id: `MSG-${Date.now()}`, sender: 'Emmanuel Kalu', senderInitials: 'EK',
      content: meetingForm.title, type: 'meeting_link',
      meetingTitle: meetingForm.title, meetingTime: `${meetingForm.date} · ${meetingForm.time}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    const updated = { ...selectedGroup, messages: [...selectedGroup.messages, msg] }
    setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updated : g))
    setSelectedGroup(updated)
    setShowMeetingScheduler(false)
    setMeetingForm({ title: '', date: '', time: '', duration: '1 hour', channel: groups[0].id, agenda: '', record: true, minutes: true })
    showToast('Meeting scheduled. Link posted to channel.')
  }

  const endCall = () => {
    setShowCall(false)
    showToast('Call ended. Generating AI minutes...')
    setTimeout(() => showToast('AI minutes posted to channel'), 2500)
  }

  const inputCls = "w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-3 h-10 font-inter text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B]"
  const smallCls = "w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-8 font-inter text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B]"

  const companyGroups = groups.filter(g => g.type === 'company' && (!groupSearch || g.name.toLowerCase().includes(groupSearch.toLowerCase())))
  const deptGroups = groups.filter(g => g.type === 'department' && (!groupSearch || g.name.toLowerCase().includes(groupSearch.toLowerCase())))
  const tempGroups = groups.filter(g => g.type === 'temporary' && (!groupSearch || g.name.toLowerCase().includes(groupSearch.toLowerCase())))

  const Waveform = () => (
    <div className="flex items-center gap-[2px]">
      {[5,9,13,7,15,11,8,16,6,12,9,14,7,11,8,10].map((h, i) => (
        <div key={i} className="w-1 bg-[#374151] rounded-full" style={{ height: h }} />
      ))}
    </div>
  )

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.sender === 'Emmanuel Kalu'

    if (msg.type === 'system') return (
      <div key={msg.id} className="text-center py-1">
        <span className="font-inter text-xs italic text-[#6B7280]">{msg.content}</span>
        {msg.content.includes('minutes generated') && (
          <button onClick={() => { setEditingMinutes(msg.minutesContent || ''); setShowMinutes(true) }} className="font-inter text-[#F59E0B] text-xs ml-2 hover:underline">View Minutes</button>
        )}
      </div>
    )

    if (msg.type === 'minutes') return (
      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className="bg-[#0F172A] border border-[#F59E0B]/30 rounded p-4 max-w-[360px]">
          <div className="flex items-center gap-2 mb-2">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="1" stroke="#F59E0B" strokeWidth="1.5"/><line x1="5" y1="5" x2="11" y2="5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="8" x2="11" y2="8" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="11" x2="8" y2="11" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="font-inter text-[10px] uppercase tracking-widest text-[#F59E0B]">AI Meeting Minutes</span>
          </div>
          <div className="font-mona text-sm font-bold text-[#F9FAFB]">{msg.meetingTitle}</div>
          <p className="font-inter text-xs italic text-[#9CA3AF] mt-2">{(msg.minutesContent || '').slice(0, 80)}...</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <button onClick={() => { setEditingMinutes(msg.minutesContent || ''); setShowMinutes(true) }} className="bg-[#F59E0B] text-black font-semibold px-3 h-7 rounded text-xs hover:bg-[#D97706] font-inter">View &amp; Edit</button>
            <button onClick={() => showToast('Minutes exported as PDF')} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-7 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">Export PDF</button>
            <button onClick={() => showToast('Minutes exported as Excel')} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-7 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">Export Excel</button>
          </div>
          <div className="font-inter text-[10px] text-[#6B7280] mt-2">{msg.timestamp}</div>
        </div>
      </div>
    )

    if (msg.type === 'meeting_link') return (
      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className="bg-[#0F172A] border border-[#1F2937] rounded p-4 max-w-[320px]">
          <div className="flex items-center gap-2 mb-2">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="9" height="10" rx="1" stroke="#F59E0B" strokeWidth="1.5"/><path d="M10 6L15 4V12L10 10" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            <span className="font-inter text-[10px] uppercase tracking-widest text-[#F59E0B]">FieldCore Meeting</span>
          </div>
          <div className="font-mona text-sm font-bold text-[#F9FAFB]">{msg.meetingTitle}</div>
          <div className="font-inter text-xs text-[#9CA3AF] mt-1">{msg.meetingTime}</div>
          <div className="border-b border-[#1F2937] my-3" />
          <div className="flex gap-2">
            <button onClick={() => showToast('Joining meeting...')} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] font-inter">Join Meeting</button>
            <button onClick={() => showToast('Link copied', 'info')} className="border border-[#1F2937] text-[#9CA3AF] px-3 h-8 rounded text-xs hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">Copy Link</button>
          </div>
        </div>
      </div>
    )

    if (msg.type === 'voice') return (
      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}>
        {!isUser && <div className="w-7 h-7 rounded-full bg-[#374151] flex items-center justify-center font-mona text-xs font-bold text-[#F9FAFB] flex-shrink-0 mt-1">{msg.senderInitials}</div>}
        <div>
          {!isUser && <div className="flex items-center gap-2 mb-1"><span className="font-mona text-xs font-semibold text-[#F59E0B]">{msg.sender}</span><span className="font-inter text-[10px] text-[#6B7280]">{msg.timestamp}</span></div>}
          <div className="bg-[#111827] border border-[#1F2937] rounded px-4 py-3 flex items-center gap-3 max-w-[280px]">
            <button onClick={() => showToast('Playing voice note...')} className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#D97706]">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="white"><polygon points="0,0 10,6 0,12"/></svg>
            </button>
            <Waveform />
            <span className="font-jakarta text-xs font-bold text-[#9CA3AF] flex-shrink-0">{msg.duration}</span>
          </div>
          {isUser && <div className="font-inter text-[10px] text-[#6B7280] text-right mt-1">{msg.timestamp}</div>}
        </div>
        {isUser && <div className="w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center font-mona text-xs font-bold text-black flex-shrink-0 mt-1">EK</div>}
      </div>
    )

    if (msg.type === 'file') return (
      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}>
        {!isUser && <div className="w-7 h-7 rounded-full bg-[#374151] flex items-center justify-center font-mona text-xs font-bold text-[#F9FAFB] flex-shrink-0 mt-1">{msg.senderInitials}</div>}
        <div>
          {!isUser && <div className="flex items-center gap-2 mb-1"><span className="font-mona text-xs font-semibold text-[#F59E0B]">{msg.sender}</span><span className="font-inter text-[10px] text-[#6B7280]">{msg.timestamp}</span></div>}
          <div className="bg-[#111827] border border-[#1F2937] rounded px-4 py-3 flex items-center gap-3 max-w-[320px]">
            <div className={`w-9 h-9 rounded flex items-center justify-center font-jakarta text-[10px] font-bold flex-shrink-0 ${msg.fileType === 'pdf' ? 'bg-red-900/40 border border-red-800 text-red-400' : 'bg-green-900/40 border border-green-800 text-green-400'}`}>
              {msg.fileType === 'pdf' ? 'PDF' : 'XLS'}
            </div>
            <div className="min-w-0">
              <div className="font-inter text-sm text-[#F9FAFB] truncate">{msg.fileName}</div>
              <button onClick={() => showToast(`Downloading ${msg.fileName}`)} className="font-inter text-[11px] text-[#F59E0B] hover:underline">Download</button>
            </div>
          </div>
          {isUser && <div className="font-inter text-[10px] text-[#6B7280] text-right mt-1">{msg.timestamp}</div>}
        </div>
        {isUser && <div className="w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center font-mona text-xs font-bold text-black flex-shrink-0 mt-1">EK</div>}
      </div>
    )

    return (
      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}>
        {!isUser && <div className="w-7 h-7 rounded-full bg-[#374151] flex items-center justify-center font-mona text-xs font-bold text-[#F9FAFB] flex-shrink-0 mt-1">{msg.senderInitials}</div>}
        <div className="max-w-[480px]">
          {!isUser && <div className="flex items-center gap-2 mb-1"><span className="font-mona text-xs font-semibold text-[#F59E0B]">{msg.sender}</span><span className="font-inter text-[10px] text-[#6B7280]">{msg.timestamp}</span></div>}
          <div className={`px-3 py-2 rounded font-inter text-sm leading-relaxed ${isUser ? 'bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F9FAFB]' : 'bg-[#111827] border border-[#1F2937] text-[#F9FAFB]'}`}>
            {msg.content}
          </div>
          {isUser && <div className="font-inter text-[10px] text-[#6B7280] text-right mt-1">{msg.timestamp}</div>}
        </div>
        {isUser && <div className="w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center font-mona text-xs font-bold text-black flex-shrink-0 mt-1">EK</div>}
      </div>
    )
  }

  const GroupItem = ({ group }: { group: ChatGroup }) => {
    const active = selectedGroup.id === group.id
    return (
      <div onClick={() => { setSelectedGroup(group); setMobileOverlayOpen(true) }}
        className={`px-4 py-3 border-b border-[#1F2937] cursor-pointer hover:bg-[#1F2937] transition-colors ${active ? 'border-l-[3px] border-l-[#F59E0B] bg-[#F59E0B]/5 pl-[13px]' : ''}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mona text-sm font-semibold text-[#F9FAFB] truncate">{group.name}</span>
            {group.type === 'company' && <span className="font-inter text-green-400 text-[10px] border border-green-800/50 px-1 rounded flex-shrink-0">E2E</span>}
          </div>
          <span className="font-inter text-[10px] text-[#6B7280] flex-shrink-0 ml-2">{group.lastMessageTime}</span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <span className="font-inter text-xs text-[#9CA3AF] truncate max-w-[180px]">{group.lastMessage}</span>
          {group.unread > 0 && <span className="w-[18px] h-[18px] bg-[#F59E0B] rounded-full flex items-center justify-center font-jakarta text-[10px] font-bold text-black flex-shrink-0 ml-1">{group.unread}</span>}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="font-inter text-[11px] text-[#6B7280]">{group.members} members</span>
          {group.expiresAt && (
            <div className="flex items-center gap-1">
              <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#F59E0B" strokeWidth="1.5"/><path d="M8 5V8L10 10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span className="font-inter text-[10px] text-[#F59E0B]">Expires {group.expiresAt}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const SectionLabel = ({ label, clock }: { label: string; clock?: boolean }) => (
    <div className="px-4 py-2 bg-[#0A0F1E] flex items-center gap-1.5">
      {clock && <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#F59E0B" strokeWidth="1.5"/><path d="M8 5V8L10 10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      <span className="font-inter text-[10px] uppercase tracking-widest text-[#6B7280]">{label}</span>
    </div>
  )

  const GroupListContent = () => (
    <>
      {companyGroups.length > 0 && <><SectionLabel label="Company" />{companyGroups.map(g => <GroupItem key={g.id} group={g} />)}</>}
      {deptGroups.length > 0 && <><SectionLabel label="Departments" />{deptGroups.map(g => <GroupItem key={g.id} group={g} />)}</>}
      {tempGroups.length > 0 && <><SectionLabel label="Temporary" clock />{tempGroups.map(g => <GroupItem key={g.id} group={g} />)}</>}
    </>
  )

  const ChatView = () => (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-5 py-3 border-b border-[#1F2937] flex items-center justify-between flex-shrink-0">
        <div>
          <div className="font-mona text-[15px] font-semibold text-[#F9FAFB]">{selectedGroup.name}</div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="font-inter text-xs text-[#9CA3AF]">{selectedGroup.members} members</span>
            <div className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 3.5V8C2 11.5 5 14 8 15C11 14 14 11.5 14 8V3.5L8 1Z" stroke="#10B981" strokeWidth="1.5"/><path d="M5.5 8L7 9.5L10.5 6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-inter text-xs text-green-400">End-to-end encrypted</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCall(true)} className="flex items-center gap-1.5 border border-[#F59E0B]/50 text-[#F59E0B] px-3 h-8 rounded text-xs hover:bg-[#F59E0B]/10 transition-colors font-inter">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="9" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6L15 4V12L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            Video Call
          </button>
          <button onClick={() => showToast('Starting encrypted voice call...')} className="border border-[#1F2937] text-[#9CA3AF] h-8 w-8 rounded flex items-center justify-center hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M14.5 11.2l-2.8-1.2a.8.8 0 00-.9.2l-1.2 1.5A11 11 0 014.3 6l1.5-1.2a.8.8 0 00.2-.9L4.8 1.5A.8.8 0 004 1H1.5A.8.8 0 00.7 2C1 8.3 7.7 15 14 15.3a.8.8 0 00.8-.8V12a.8.8 0 00-.3-.8z" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
          <button onClick={() => showToast('Group settings coming soon')} className="border border-[#1F2937] text-[#9CA3AF] h-8 w-8 rounded flex items-center justify-center hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">⋯</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {selectedGroup.messages.map(msg => renderMessage(msg))}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-5 py-4 border-t border-[#1F2937] flex-shrink-0">
        <div className="flex gap-2 mb-3 flex-wrap">
          {[
            { label: '📎 Attach File', action: () => showToast('File attached') },
            { label: '🎤 Voice Note', action: () => showToast('Recording voice note...') },
            { label: '📅 Schedule Meeting', action: () => setShowMeetingScheduler(true) },
            { label: '🔗 Share Report', action: () => showToast('Select a report to share from Field Operations') },
          ].map(b => (
            <button key={b.label} onClick={b.action} className="h-7 px-3 text-[11px] border border-[#1F2937] text-[#9CA3AF] rounded hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">{b.label}</button>
          ))}
        </div>
        <div className="flex gap-2 items-end">
          <textarea rows={1} style={{ maxHeight: 96 }}
            className="flex-1 bg-[#0A0F1E] border border-[#1F2937] rounded px-3 py-2 font-inter text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B] resize-none"
            placeholder={`Message ${selectedGroup.name}...`}
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            onInput={e => { const el = e.currentTarget; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 96) + 'px' }}
          />
          <button onClick={sendMessage} className="h-9 w-9 bg-[#F59E0B] hover:bg-[#D97706] rounded flex items-center justify-center flex-shrink-0 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  )

  const MeetingSchedulerOverlay = () => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#1F2937] rounded w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mona text-[18px] text-[#F9FAFB] font-semibold">Schedule a Meeting</h2>
          <button onClick={() => setShowMeetingScheduler(false)} className="text-[#6B7280] hover:text-[#F9FAFB] text-xl leading-none">×</button>
        </div>
        <div className="space-y-3">
          <input placeholder="Meeting Title *" value={meetingForm.title} onChange={e => setMeetingForm(f => ({...f, title: e.target.value}))} className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={meetingForm.date} onChange={e => setMeetingForm(f => ({...f, date: e.target.value}))} className={inputCls} />
            <input type="time" value={meetingForm.time} onChange={e => setMeetingForm(f => ({...f, time: e.target.value}))} className={inputCls} />
          </div>
          <select value={meetingForm.duration} onChange={e => setMeetingForm(f => ({...f, duration: e.target.value}))} className={inputCls}>
            {['30 minutes', '1 hour', '1.5 hours', '2 hours'].map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={meetingForm.channel} onChange={e => setMeetingForm(f => ({...f, channel: e.target.value}))} className={inputCls}>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <textarea rows={3} placeholder="Agenda — what will be discussed?" value={meetingForm.agenda} onChange={e => setMeetingForm(f => ({...f, agenda: e.target.value}))} className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-3 py-2 font-inter text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B] resize-none" />
          {[{ label: 'Record meeting?', key: 'record' as const }, { label: 'Generate AI minutes after call?', key: 'minutes' as const }].map(t => (
            <div key={t.key} className="flex items-center justify-between">
              <span className="font-inter text-sm text-[#9CA3AF]">{t.label}</span>
              <button onClick={() => setMeetingForm(f => ({...f, [t.key]: !f[t.key]}))}
                className={`relative w-10 h-5 rounded-full transition-colors ${meetingForm[t.key] ? 'bg-[#F59E0B]' : 'bg-[#374151]'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${meetingForm[t.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
          {meetingForm.minutes && <p className="font-inter text-[11px] text-[#6B7280]">AI minutes will be automatically generated when the meeting ends and posted to this channel.</p>}
          <div className="space-y-2 pt-2">
            <button onClick={scheduleMeeting} className="w-full bg-[#F59E0B] text-black font-semibold h-10 rounded text-sm hover:bg-[#D97706] font-inter">Schedule Meeting →</button>
            <button onClick={() => setShowMeetingScheduler(false)} className="w-full border border-[#1F2937] text-[#9CA3AF] h-10 rounded text-sm hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )

  const MinutesOverlay = () => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#1F2937] rounded w-full max-w-2xl flex flex-col" style={{ maxHeight: '85vh' }}>
        <div className="px-6 py-4 border-b border-[#1F2937] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mona text-[16px] text-[#F9FAFB] font-semibold">Meeting Minutes</span>
            <span className="font-inter text-[10px] bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded">AI Generated · Editable</span>
          </div>
          <button onClick={() => setShowMinutes(false)} className="text-[#6B7280] hover:text-[#F9FAFB] text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-3 bg-[#0F172A] border-b border-[#1F2937] flex flex-wrap gap-6 flex-shrink-0">
          {[['Meeting', 'Q2 Compliance Review'], ['Date', '13 May 2025'], ['Duration', '38 minutes'], ['Attendees', '4 participants']].map(([l, v]) => (
            <div key={l}><span className="font-inter text-[11px] text-[#6B7280]">{l}: </span><span className="font-inter text-[11px] text-[#F9FAFB]">{v}</span></div>
          ))}
        </div>
        <div className="flex-1 overflow-hidden p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-inter text-[10px] uppercase tracking-widest text-[#F59E0B]">Minutes Document</span>
            {minutesSaved && <span className="font-inter text-[11px] text-green-400">Auto-saved ✓</span>}
          </div>
          <textarea style={{ height: 'calc(100% - 28px)', minHeight: 280 }}
            className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded p-4 font-mono text-sm text-[#F9FAFB] leading-relaxed resize-none focus:outline-none focus:border-[#F59E0B]"
            value={editingMinutes} onChange={e => setEditingMinutes(e.target.value)} />
        </div>
        <div className="px-6 py-4 border-t border-[#1F2937] flex items-center justify-between flex-shrink-0 flex-wrap gap-3">
          <span className="font-inter text-xs text-[#6B7280]">Changes are saved automatically</span>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => showToast('Minutes exported as PDF successfully')} className="bg-[#F59E0B] text-black font-semibold px-4 h-9 rounded text-sm hover:bg-[#D97706] font-inter">Export PDF</button>
            <button onClick={() => showToast('Minutes exported as Excel successfully')} className="border border-[#1F2937] text-[#9CA3AF] px-4 h-9 rounded text-sm hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">Export Excel</button>
            <button onClick={() => showToast('Minutes shared to channel')} className="border border-[#1F2937] text-[#9CA3AF] px-4 h-9 rounded text-sm hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">Share to Channel</button>
            <button onClick={() => setShowMinutes(false)} className="border border-[#1F2937] text-[#9CA3AF] px-4 h-9 rounded text-sm hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors font-inter">Close</button>
          </div>
        </div>
      </div>
    </div>
  )

  const CallOverlay = () => {
    const participants = [
      { initials: 'EK', name: 'Emmanuel Kalu', sub: 'You', user: true },
      { initials: 'AO', name: 'Adaeze Okonkwo', sub: '', user: false },
      { initials: 'NA', name: 'Ngozi Adeyemi', sub: '', user: false },
      { initials: 'FB', name: 'Fatima Bello', sub: '', user: false },
    ]
    return (
      <div className="fixed inset-0 bg-[#0A0F1E] z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <span className="font-mona text-[#F59E0B] font-bold text-lg">FieldCore</span>
            <div className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 3.5V8C2 11.5 5 14 8 15C11 14 14 11.5 14 8V3.5L8 1Z" stroke="#10B981" strokeWidth="1.5"/><path d="M5.5 8L7 9.5L10.5 6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-inter text-xs text-green-400">End-to-end encrypted</span>
            </div>
          </div>
          <div className="font-jakarta text-2xl font-bold text-[#F9FAFB]">{formatCallTime(callSeconds)}</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /><span className="font-inter text-[10px] text-red-400">REC</span></div>
            <button onClick={endCall} className="bg-red-600 hover:bg-red-700 text-white font-inter font-medium px-4 h-9 rounded text-sm transition-colors">End Call</button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="grid grid-cols-2 gap-4 max-w-3xl w-full">
            {participants.map(p => (
              <div key={p.initials} className={`bg-[#111827] border rounded flex flex-col items-center justify-center h-36 ${p.user ? 'border-[#F59E0B]' : 'border-[#1F2937]'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-mona font-bold text-lg ${p.user ? 'bg-[#F59E0B] text-black' : 'bg-[#374151] text-[#F9FAFB]'}`}>{p.initials}</div>
                <div className="font-mona text-sm text-[#F9FAFB] mt-2">{p.name}</div>
                {p.sub && <div className="font-inter text-[11px] text-[#6B7280]">{p.sub}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 py-5 border-t border-[#1F2937]">
          {[
            { svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>, fn: () => {}, red: false },
            { svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>, fn: () => {}, red: false },
            { svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, fn: () => showToast('Screen sharing started'), red: false },
            { svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, fn: () => showToast('In-call chat — use the Comms channel'), red: false },
            { svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 18v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-6-6A19.79 19.79 0 012 4.18 2 2 0 014 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>, fn: endCall, red: true },
          ].map((btn, i) => (
            <button key={i} onClick={btn.fn} className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${btn.red ? 'bg-red-600 border-red-600 hover:bg-red-700' : 'bg-[#111827] border-[#1F2937] text-[#9CA3AF] hover:border-[#F59E0B] hover:text-[#F59E0B]'}`}>
              {btn.svg}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0F1E]">
      <Sidebar />
      {showMeetingScheduler && <MeetingSchedulerOverlay />}
      {showMinutes && <MinutesOverlay />}
      {showCall && <CallOverlay />}

      {mobileOverlayOpen && (
        <div className="fixed inset-0 bg-[#111827] z-40 flex flex-col md:hidden">
          <div className="flex items-center gap-3 px-4 h-14 border-b border-[#1F2937] flex-shrink-0">
            <button onClick={() => setMobileOverlayOpen(false)} className="font-inter text-sm text-[#F59E0B]">← Back</button>
            <span className="font-mona text-[#F9FAFB] font-semibold">{selectedGroup.name}</span>
          </div>
          <ChatView />
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden md:ml-60">
        <div className="flex items-center justify-between px-6 h-16 border-b border-[#1F2937] flex-shrink-0">
          <div>
            <div className="font-mona text-lg font-semibold text-[#F9FAFB]">Comms</div>
            <div className="flex items-center gap-2 mt-0.5">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 3.5V8C2 11.5 5 14 8 15C11 14 14 11.5 14 8V3.5L8 1Z" stroke="#10B981" strokeWidth="1.5"/><path d="M5.5 8L7 9.5L10.5 6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-inter text-xs text-green-400">Internal team communication · End-to-end encrypted</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowNewGroupForm(v => !v)} className="border border-[#F59E0B]/50 text-[#F59E0B] px-3 h-8 rounded text-xs hover:bg-[#F59E0B]/10 transition-colors font-inter">+ New Group</button>
            <button onClick={() => setShowMeetingScheduler(true)} className="bg-[#F59E0B] text-black font-semibold px-3 h-8 rounded text-xs hover:bg-[#D97706] transition-colors font-inter">Schedule Meeting</button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop group list */}
          <div className="hidden md:flex w-80 flex-shrink-0 border-r border-[#1F2937] flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1F2937] flex items-center justify-between flex-shrink-0">
              <span className="font-inter text-[11px] uppercase tracking-widest text-[#6B7280]">Channels</span>
              <input placeholder="Search..." value={groupSearch} onChange={e => setGroupSearch(e.target.value)}
                className="bg-[#0A0F1E] border border-[#1F2937] rounded px-2 h-7 text-xs w-28 focus:outline-none focus:border-[#F59E0B] text-[#F9FAFB] placeholder-[#6B7280] font-inter" />
            </div>
            {showNewGroupForm && (
              <div className="bg-[#0F172A] border-b border-[#1F2937] p-4 space-y-3 flex-shrink-0">
                <input placeholder="Group Name" value={groupForm.name} onChange={e => setGroupForm(f => ({...f, name: e.target.value}))} className={smallCls} />
                <select value={groupForm.type} onChange={e => setGroupForm(f => ({...f, type: e.target.value}))} className={smallCls}>
                  <option value="department">Department Group</option>
                  <option value="temporary">Temporary — Mobilization</option>
                  <option value="company">Company-wide</option>
                </select>
                {groupForm.type === 'temporary' && (
                  <div>
                    <select value={groupForm.duration} onChange={e => setGroupForm(f => ({...f, duration: e.target.value}))} className={smallCls}>
                      {['1 Week', '2 Weeks', '1 Month', 'Custom'].map(d => <option key={d}>{d}</option>)}
                    </select>
                    <p className="font-inter text-[11px] text-[#F59E0B] mt-2 leading-relaxed">This group will auto-archive after the selected duration. Messages are saved but removed from active channels.</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={createGroup} className="flex-1 bg-[#F59E0B] text-black h-7 rounded text-xs font-semibold hover:bg-[#D97706] font-inter">Create Group</button>
                  <button onClick={() => setShowNewGroupForm(false)} className="flex-1 border border-[#1F2937] text-[#9CA3AF] h-7 rounded text-xs font-inter">Cancel</button>
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto"><GroupListContent /></div>
          </div>

          {/* Mobile group list */}
          <div className="flex flex-col flex-1 overflow-hidden md:hidden">
            <div className="px-4 py-3 border-b border-[#1F2937] flex-shrink-0">
              <span className="font-inter text-[11px] uppercase tracking-widest text-[#6B7280]">Channels</span>
            </div>
            <div className="flex-1 overflow-y-auto"><GroupListContent /></div>
          </div>

          {/* Desktop chat */}
          <div className="hidden md:flex flex-1 overflow-hidden flex-col">
            <ChatView />
          </div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(t => ({...t, visible: false}))} />
    </div>
  )
}
