'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function LandingPage() {
  const [formValues, setFormValues] = useState({ name: '', companyRole: '', module: '', feedback: '' })

  const handleSubmit = () => {
    const body = `Name: ${formValues.name}\nCompany & Role: ${formValues.companyRole}\nModule: ${formValues.module}\nFeedback: ${formValues.feedback}`
    window.location.href = `mailto:fieldcore@demo.com?subject=FieldCore Feedback&body=${encodeURIComponent(body)}`
  }

  const inputClass = "w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-3 h-10 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B] transition-colors"

  return (
    <div className="bg-[#0A0F1E] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-[#0A0F1E] text-center px-6 pt-16">
        <h1 className="font-syne font-bold text-[32px] md:text-[56px] text-[#F9FAFB] leading-tight max-w-4xl">
          Nigeria&apos;s Oil &amp; Gas<br />
          Runs on WhatsApp<br />
          and Excel.<br />
          <span className="text-[#F59E0B]">FieldCore Changes That.</span>
        </h1>
        <p className="text-[15px] md:text-[18px] text-[#9CA3AF] max-w-[560px] mt-6 leading-relaxed">
          One platform for field operations, equipment calibration, NCDMB compliance,
          HSE incidents, and asset maintenance — built specifically for Nigerian
          operators, contractors, and service companies.
        </p>
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="bg-[#F59E0B] text-black font-semibold px-6 h-11 rounded text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center">Enter Demo →</Link>
          <Link href="/research" className="border border-[#F59E0B] text-[#F59E0B] px-6 h-11 rounded text-sm hover:bg-[#F59E0B]/10 transition-colors flex items-center justify-center">See Our Research</Link>
        </div>
        <p className="text-[12px] text-[#6B7280] mt-4">No account needed. Explore the full demo freely.</p>
      </section>

      {/* Stats Bar */}
      <div className="border-y border-[#1F2937] py-8 bg-[#111827]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-6">
          {[
            { num: '₦46B+', label: 'Lost to crude theft' },
            { num: '68%', label: 'Oil & gas leaders get delayed data' },
            { num: '250,000', label: 'Barrels stolen daily from pipelines' },
            { num: '70%', label: 'Companies stuck in manual processes' },
          ].map(s => (
            <div key={s.num} className="text-center">
              <div className="font-syne font-bold text-[36px] text-[#F59E0B]">{s.num}</div>
              <div className="text-[13px] text-[#9CA3AF] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#6B7280] text-center mt-4 px-6">Sources: NEITI 2020 · Hexagon Industry Survey · Prisma Photonics · DXC Technology 2025</p>
      </div>

      {/* Problems */}
      <section className="bg-[#0A0F1E] py-20 px-6">
        <h2 className="font-syne text-[36px] text-[#F9FAFB] text-center">The Problems We Found</h2>
        <p className="text-[16px] text-[#9CA3AF] text-center max-w-2xl mx-auto mt-4 mb-12 leading-relaxed">
          After months of research — regulatory statements, industry conferences, operator reports, and global technology surveys — these are the eight software gaps we identified in Nigeria&apos;s oil and gas sector.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[
            { n: '01', title: 'Analog data locked since 1956', desc: 'Well logs and seismic records from 1956 sit in physical files. Never digitized. Never queryable.' },
            { n: '02', title: 'Maintenance on whiteboards', desc: 'Equipment schedules live in Excel and handwritten forms. No alerts, no history, no audit trail.' },
            { n: '03', title: 'NCDMB compliance in Word docs', desc: 'Nigerian Content Plans compiled manually. No system tracks deadlines, workforce %, or filing status.' },
            { n: '04', title: 'No real-time production data', desc: 'Field data is handwritten, mailed, and re-keyed by admin. Decisions are two weeks behind reality.' },
            { n: '05', title: 'Crew scheduling on WhatsApp', desc: 'Workforce rotation and certification tracking in group chats. No visibility, no accountability.' },
            { n: '06', title: 'Pipeline theft with no software', desc: 'Theft costs 250,000 barrels daily. Hardware exists. Affordable intelligence software does not.' },
            { n: '07', title: 'Five regulators, zero unified tracker', desc: 'NUPRC, NMDPRA, NCDMB, NOSDRA, FMEnv — separate reports, separate timelines, no unified view.' },
            { n: '08', title: 'HSE incidents under-reported', desc: 'Incident logging is paper-based. No corrective action tracking. No NUPRC-format reporting.' },
          ].map(p => (
            <div key={p.n} className="bg-[#111827] border border-[#1F2937] rounded p-5">
              <div className="text-[#F59E0B] text-[11px] uppercase tracking-widest font-medium">{p.n}</div>
              <div className="font-syne text-[#F9FAFB] font-semibold text-sm mt-1">{p.title}</div>
              <div className="text-[#9CA3AF] text-xs mt-2 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="bg-[#111827] py-20 px-6">
        <h2 className="font-syne text-[36px] text-[#F9FAFB] text-center">Six Workspaces. One Platform.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12">
          {[
            { n: '01', title: 'Field Operations', desc: 'Job cards, tool calibration tracking, field timelines, and one-click report generation. Built for wireline engineers and well intervention contractors.', href: '/operations' },
            { n: '02', title: 'NCDMB Compliance', desc: 'Track your Nigerian Content %, manage filing deadlines, store audit documents, and generate NCDMB-ready reports automatically.', href: '/compliance' },
            { n: '03', title: 'HSE & Incidents', desc: 'Log safety incidents and near-misses from the field. Track corrective actions. Generate NUPRC/NMDPRA-format HSE reports with one click.', href: '/hse' },
            { n: '04', title: 'Asset & Maintenance', desc: 'Equipment register, maintenance schedules, downtime logs, and certification expiry alerts — for every asset from vehicles to marine vessels.', href: '/assets' },
          ].map(m => (
            <div key={m.n} className="bg-[#0A0F1E] border border-[#1F2937] rounded p-6 hover:border-[#F59E0B]/40 transition-colors">
              <div className="text-[#F59E0B] text-[11px] uppercase tracking-widest">{m.n}</div>
              <div className="font-syne text-[18px] text-[#F9FAFB] mt-1">{m.title}</div>
              <p className="text-[14px] text-[#9CA3AF] mt-3 leading-relaxed">{m.desc}</p>
              <Link href={m.href} className="text-[#F59E0B] text-sm mt-4 block hover:underline">→ Explore Module</Link>
            </div>
          ))}
          <div className="bg-[#0A0F1E] border border-[#1F2937] rounded p-6 hover:border-[#F59E0B]/40 transition-colors">
            <span className="text-[#F59E0B] text-[11px] uppercase tracking-widest">05</span>
            <div className="font-syne text-[18px] text-[#F9FAFB] mt-1">Comms</div>
            <p className="text-[14px] text-[#9CA3AF] mt-3 leading-relaxed">Encrypted team chat, scheduled meetings with AI-generated minutes, voice notes, and file sharing — all inside FieldCore. No WhatsApp. No Google Meet. No switching apps.</p>
            <Link href="/comms" className="text-[#F59E0B] text-sm mt-4 block hover:underline">→ Explore Module</Link>
          </div>
          <div className="bg-[#0A0F1E] border border-[#1F2937] rounded p-6 hover:border-[#F59E0B]/40 transition-colors">
            <span className="text-[#F59E0B] text-[11px] uppercase tracking-widest">06</span>
            <div className="font-syne text-[18px] text-[#F9FAFB] mt-1">Invoice Builder</div>
            <p className="text-[14px] text-[#9CA3AF] mt-3 leading-relaxed">Build professional invoices in your company format, send directly to clients via email or WhatsApp, and track payment status — without leaving FieldCore.</p>
            <Link href="/invoice" className="text-[#F59E0B] text-sm mt-4 block hover:underline">→ Explore Module</Link>
          </div>
        </div>
      </section>

      {/* Industry Voices */}
      <section className="bg-[#0A0F1E] py-20 px-6">
        <h2 className="font-syne text-[36px] text-[#F9FAFB] text-center">What Nigeria&apos;s Oil &amp; Gas Leaders Are Saying</h2>
        <p className="text-[#9CA3AF] text-center max-w-xl mx-auto mt-3 mb-12 text-sm">These are not our words. These are direct statements from the people running Nigeria&apos;s energy sector, recorded at public industry events in 2025 and 2026.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { q: 'Nigeria possesses decades of valuable data — well logs and seismic information dating back to 1956 — much of which remains underutilised or stored in analogue formats.', name: 'Bayo Ojulari, Group CEO, NNPC Limited', src: '2026 Oloibiri Lecture & Energy Forum, Abuja · April 2026' },
            { q: 'The industry can no longer afford to pay lip service to digitalisation. Failure to adopt data-driven approaches will lead to rising costs and declining competitiveness.', name: 'Bayo Ojulari, Group CEO, NNPC Limited', src: 'OLEF 2026, Abuja · April 2026' },
            { q: 'Fragmented data and operational inefficiencies — not local content mandates — are the primary cost drivers in the sector.', name: 'NCDMB Industry Leaders Panel', src: 'Nigeria Oil & Gas Conference 2025, Abuja · July 2025' },
          ].map((q, i) => (
            <div key={i} className="bg-[#111827] border-l-4 border-[#F59E0B] p-6 rounded-r">
              <p className="text-[#F9FAFB] text-sm italic leading-relaxed">&ldquo;{q.q}&rdquo;</p>
              <div className="text-[#F59E0B] text-xs font-bold mt-4">— {q.name}</div>
              <div className="text-[#6B7280] text-[11px] mt-1">{q.src}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Ask */}
      <section className="bg-[#111827] py-20 px-6">
        <h2 className="font-syne text-[32px] text-[#F9FAFB] text-center max-w-2xl mx-auto">We Built This From Research. You Have the Real Data.</h2>
        <p className="text-[15px] text-[#9CA3AF] text-center max-w-xl mx-auto mt-6 leading-relaxed">
          FieldCore was built by developers who spent months researching Nigeria&apos;s oil and gas software gaps. But we are not field engineers. We have not sat in your office at 11pm compiling an NCDMB report. You have.<br /><br />
          If you work in Nigeria&apos;s oil and gas sector — as an operator, engineer, contractor, or regulator — we want your feedback.
        </p>
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="bg-[#F59E0B] text-black font-semibold px-6 h-11 rounded text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center">Enter the Demo →</Link>
          <Link href="/research" className="border border-[#F59E0B] text-[#F59E0B] px-6 h-11 rounded text-sm hover:bg-[#F59E0B]/10 transition-colors flex items-center justify-center">Read Our Research</Link>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="font-syne text-[28px] text-[#F9FAFB]">You Are The Expert We Haven&apos;t Talked To Yet</h2>
        <div className="text-[15px] text-[#9CA3AF] leading-relaxed mt-6 space-y-4 text-left">
          <p>Everything on this page came from public sources. It represents what is visible from the outside. You have ground truth. You know which problem is most painful. You know what we got wrong.</p>
          <p>We built this demo to start that conversation.</p>
        </div>
        <div className="max-w-lg mx-auto mt-10 text-left space-y-4">
          <input type="text" placeholder="Your name" value={formValues.name} onChange={e => setFormValues({...formValues, name: e.target.value})} className={inputClass} />
          <input type="text" placeholder="Company & Role" value={formValues.companyRole} onChange={e => setFormValues({...formValues, companyRole: e.target.value})} className={inputClass} />
          <select value={formValues.module} onChange={e => setFormValues({...formValues, module: e.target.value})} className={inputClass}>
            <option value="">Which module matters most?</option>
            <option>Field Operations</option>
            <option>NCDMB Compliance</option>
            <option>HSE & Incidents</option>
            <option>Assets & Maintenance</option>
            <option>All of them</option>
            <option>Something else</option>
          </select>
          <textarea
            rows={5}
            placeholder="Is this solving the right problem? What's missing? What would make you pay for this?"
            value={formValues.feedback}
            onChange={e => setFormValues({...formValues, feedback: e.target.value})}
            className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded px-3 py-2 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F59E0B] transition-colors resize-none"
          />
          <button onClick={handleSubmit} className="w-full bg-[#F59E0B] text-black font-semibold h-11 rounded text-sm hover:bg-[#D97706] transition-colors">Send Feedback →</button>
        </div>
        <Link href="/dashboard" className="inline-block mt-8 border border-[#F59E0B] text-[#F59E0B] px-6 h-11 rounded text-sm hover:bg-[#F59E0B]/10 transition-colors leading-[44px]">Enter the Demo →</Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0F1E] border-t border-[#1F2937] py-8 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[13px] text-[#9CA3AF]">FieldCore · Nigeria Oil &amp; Gas Platform</span>
          <div className="flex gap-6">
            <Link href="/research" className="text-[13px] text-[#9CA3AF] hover:text-[#F9FAFB]">Research</Link>
            <Link href="/dashboard" className="text-[13px] text-[#9CA3AF] hover:text-[#F9FAFB]">Enter Demo</Link>
          </div>
        </div>
        <p className="text-[11px] text-[#6B7280] text-center mt-4">© 2025 FieldCore. Built in Nigeria, for Nigeria.</p>
      </footer>
    </div>
  )
}
