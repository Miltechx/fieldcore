'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function ResearchPage() {
  return (
    <div className="bg-[#0A0F1E] min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="py-20 px-6 text-center">
        <div className="text-[#F59E0B] text-[11px] uppercase tracking-widest">Industry Research</div>
        <h1 className="font-syne font-bold text-[30px] md:text-[48px] text-[#F9FAFB] mt-4">The Research Behind FieldCore</h1>
        <p className="text-[18px] text-[#9CA3AF] max-w-2xl mx-auto mt-6 leading-relaxed">
          We did not guess. Before writing a single line of code, we mapped every software gap in Nigeria&apos;s oil and gas sector using public regulatory statements, industry conference reports, operator announcements, and global oil &amp; gas technology intelligence. This is what we found.
        </p>
      </div>

      {/* Section 1 */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="font-syne text-[24px] text-[#F9FAFB] mb-6">The Starting Point</h2>
        <div className="text-[15px] text-[#9CA3AF] leading-[1.8] space-y-4">
          <p>Nigeria is Africa&apos;s largest oil producer, holding 37 billion barrels of proven crude oil reserves and over 200 trillion cubic feet of natural gas. The sector contributes over 80% of export revenues and nearly a third of federal government income.</p>
          <p>Yet its operators — particularly the growing class of indigenous companies now managing assets divested by Shell, Chevron, TotalEnergies, and ExxonMobil — are running billion-naira operations on Excel spreadsheets, WhatsApp group chats, and paper forms filed in physical folders.</p>
          <p>The question we asked was simple: why does no Nigerian-built software exist to solve this?</p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-[#111827] py-16 px-6">
        <h2 className="font-syne text-[28px] text-[#F9FAFB] max-w-3xl mx-auto mb-3">Direct From the People Running the Industry</h2>
        <p className="text-[14px] text-[#9CA3AF] max-w-3xl mx-auto mb-10">These quotes were recorded at public industry events between 2025 and 2026.</p>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              quote: 'Nigeria possesses decades of valuable data — well logs and seismic information dating back to 1956 — much of which remains underutilised or stored in analogue formats. Harnessing this data through artificial intelligence, advanced analytics, and modern data infrastructure is critical to improving decision-making, reducing operational costs, and optimising production.',
              name: 'Bayo Ojulari', title: 'Group Chief Executive Officer, NNPC Limited',
              event: '2026 Oloibiri Lecture & Energy Forum (OLEF 2026), Abuja · April 2026'
            },
            {
              quote: 'NNPC will begin reviewing the budgets of its JV partners to assess their level of investment in AI and digital technologies. The industry can no longer afford to pay lip service to digitalisation — failure to adopt data-driven approaches will lead to rising costs and declining competitiveness.',
              name: 'Bayo Ojulari', title: 'Group CEO, NNPC Limited (represented by EVP Upstream Udobong Ntia)',
              event: 'OLEF 2026, Abuja · April 2026'
            },
            {
              quote: 'Achieving Nigeria\'s 3 million barrels per day oil and 22 billion cubic feet gas targets will require robust financing mechanisms, modern technology adoption, and effective regulation.',
              name: 'Saidu Mohammed', title: 'Chief Executive Officer, NMDPRA',
              event: 'OLEF 2026, Abuja · April 2026'
            },
            {
              quote: 'Recent reforms under the Petroleum Industry Act have begun to reposition Nigeria\'s upstream sector. Flagship projects such as Bonga North, Ubeta, and HI are expected to attract over $10 billion in Final Investment Decisions.',
              name: 'Oritsemeyiwa Eyesan', title: 'Chief Executive, NUPRC',
              event: 'OLEF 2026, Abuja · April 2026'
            },
            {
              quote: 'Fragmented data and operational inefficiencies — not local content mandates — are the primary cost drivers. NCDMB\'s emphasis on technology integration and data consolidation is critical to ensuring cost efficiency while maintaining local participation.',
              name: 'Industry Leaders Panel — NCDMB', title: '',
              event: 'Nigeria Oil & Gas (NOG) Conference 2025, Abuja · July 2025'
            },
            {
              quote: 'Many Nigerian workers are still struggling to piece together maintenance schedules from incomplete plant plans and records kept in Excel. Employees waste enormous time looking for data siloed into several systems — or worse, data that has not been captured at all, residing solely in colleagues\' memories.',
              name: 'Society of Petroleum Engineers (SPE) Nigeria', title: '"Nigeria Looks To Bridge Gaps in Oil and Gas Digital Transformation"',
              event: 'SPE Journal of Petroleum Technology, 2023'
            },
          ].map((q, i) => (
            <div key={i} className="bg-[#0A0F1E] border border-[#1F2937] border-l-4 border-l-[#F59E0B] p-7 rounded-r">
              <p className="text-[#F9FAFB] text-[15px] italic leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
              <div className="mt-5">
                <div className="text-[#F59E0B] text-[13px] font-bold">{q.name}{q.title ? ` — ${q.title}` : ''}</div>
                <div className="text-[#6B7280] text-[11px] mt-1">{q.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-syne text-[28px] text-[#F9FAFB] mb-3">Eight Software Gaps. One Consistent Pattern.</h2>
        <p className="text-[14px] text-[#9CA3AF] mb-10">Across regulatory statements, conference proceedings, operator reports, and global industry surveys, the same problems appeared repeatedly.</p>
        <div className="space-y-4">
          {[
            {
              n: '01', title: 'Analog Data Locked Since 1956',
              body: "Nigeria's NNPC GCEO confirmed in April 2026 that the country holds decades of well logs and seismic data dating to 1956 — stored in analogue formats, unqueryable, and inaccessible to AI systems. This data represents enormous exploration value that is currently invisible. No Nigerian software tool exists to extract, structure, or analyze it.",
              opp: 'AI-powered document digitization and data extraction fed into a structured, searchable database.'
            },
            {
              n: '02', title: 'Maintenance Managed on Excel and Whiteboards',
              body: 'A 2023 SPE Nigeria report confirmed that indigenous operators manage maintenance schedules from "incomplete plant plans and records kept in Excel." A Hexagon industry survey found that 68% of oil and gas leaders receive delayed or outdated information, and 69% say manual processes directly affect their ability to meet performance goals. 73% report poor data quality has severe business impact.',
              opp: 'Mobile-first CMMS built for Nigerian conditions — offline-capable, Naira-priced.'
            },
            {
              n: '03', title: 'NCDMB Compliance Through Word Documents',
              body: "Every company in Nigeria's oil and gas sector must file a Nigerian Content Plan (NCP) with NCDMB. The NCDMB recently made the Nigerian Content Fund Clearance Certificate (NCFCC) mandatory for all contractors. Currently companies compile these manually using Word documents and Excel sheets. A missed filing means contract disqualification and regulatory fines.",
              opp: 'A compliance SaaS that auto-calculates Nigerian Content %, generates NCDMB-ready reports, tracks deadlines.'
            },
            {
              n: '04', title: 'No Real-Time Production Data',
              body: 'Field data is recorded on paper by pumpers, mailed to the office weekly, and manually re-entered by administrative staff. By the time it reaches a decision-maker it is two weeks old. For operations where a well can die undetected for nine days, this delay is a direct, quantifiable financial loss with no current solution for small and mid-sized indigenous operators.',
              opp: 'Mobile-first field data capture with offline sync for low-connectivity Niger Delta environments.'
            },
            {
              n: '05', title: 'Crew Scheduling on WhatsApp',
              body: 'Industry sources confirm oil and gas organizations rely on Excel-based crew scheduling and WhatsApp coordination. When a rig crew is ready but equipment is under unscheduled maintenance, operations stop — because the systems tracking people and those tracking assets do not communicate.',
              opp: 'Integrated crew and asset scheduling with certification expiry tracking.'
            },
            {
              n: '06', title: "Five Regulators, No Unified Compliance Tracker",
              body: "Nigeria's oil and gas sector is governed by five overlapping regulatory bodies — NUPRC, NMDPRA, NCDMB, NOSDRA, and the Federal Ministry of Environment — each requiring separate filings on different timelines in different formats. No Nigerian operator currently tracks all five in a single system.",
              opp: 'A multi-regulator compliance dashboard with unified deadline tracking and document management.'
            },
            {
              n: '07', title: "HSE Incidents Under-Reported",
              body: "Incident reporting in Nigeria's oil and gas sector is paper-based and inconsistent. No corrective action tracking, no pattern analysis, and no automated generation of HSE reports required by NUPRC and NMDPRA. This creates both safety risks and compliance exposure simultaneously.",
              opp: 'Mobile HSE incident reporting that feeds directly into regulatory report generation.'
            },
            {
              n: '08', title: "Digital Transformation Stuck in Pilot",
              body: "70% of oil and gas companies globally remain stuck in the pilot phase of digital transformation. In Nigeria this is amplified: global tools like SAP IS-Oil, IBM Maximo, and SLB Delfi cost $500,000–$2M+ to implement. No Nigerian-built, Naira-priced, locally-supported alternative exists for the growing class of indigenous operators now running billion-naira assets.",
              opp: 'The entire FieldCore platform.'
            },
          ].map(p => (
            <div key={p.n} className="bg-[#111827] border border-[#1F2937] p-6 rounded">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[#F59E0B] text-[11px] uppercase font-medium">{p.n}</span>
                <span className="font-syne text-[15px] text-[#F9FAFB]">{p.title}</span>
              </div>
              <p className="text-[13px] text-[#9CA3AF] leading-relaxed">{p.body}</p>
              <p className="text-[11px] text-[#9CA3AF] mt-3"><span className="text-[#F59E0B] font-bold">Opportunity:</span> {p.opp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Landscape */}
      <div className="bg-[#111827] py-16 px-6">
        <h2 className="font-syne text-[28px] text-[#F9FAFB] max-w-3xl mx-auto mb-10">Who Else Is Building — And Why It Is Not Enough</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              name: 'PetroData Management Services (Lagos, 25+ years)',
              desc: 'Enterprise data storage and geophysical document management for IOCs.',
              why: 'Serves only the top 5% of the industry — Shell, Chevron, TotalEnergies. No SaaS product. No self-serve. Not accessible to indigenous operators.'
            },
            {
              name: 'Axiel Technologies (Port Harcourt, est. February 2024)',
              desc: 'Authorized distributor of Leica Geosystems 3D laser scanning hardware.',
              why: 'Hardware reseller, not a software company. No web platform. No compliance, operations, or HSE SaaS of any kind.'
            },
            {
              name: 'Polaris Integrated & Geosolutions (Port Harcourt, est. 2004)',
              desc: 'Geotechnical and geospatial field services for oil and gas projects.',
              why: 'A professional services firm. No digital product of any kind.'
            },
            {
              name: 'Axxela Group (Lagos)',
              desc: "Gas distribution company. Built an internal pipeline monitoring system (RMCS) for their own infrastructure.",
              why: 'Internal tool, not productized, not sold externally, not accessible to any other company.'
            },
            {
              name: 'NipeX / NNPC e-Procurement (Government platform, 2005)',
              desc: 'Electronic tendering and contractor pre-qualification for NNPC JV contracts.',
              why: 'Covers only major IOC procurement. No compliance tracking, no operations management, no HSE, no field data capture. Has not meaningfully evolved since 2010.'
            },
          ].map(c => (
            <div key={c.name} className="bg-[#0A0F1E] border border-[#1F2937] p-6 rounded">
              <div className="text-[#F9FAFB] font-bold text-[15px]">{c.name}</div>
              <div className="text-[13px] text-[#9CA3AF] mt-1">{c.desc}</div>
              <p className="text-[13px] text-[#9CA3AF] mt-3"><span className="text-[#F59E0B] text-[11px] font-bold">Why it&apos;s not enough:</span> {c.why}</p>
            </div>
          ))}
        </div>
        <p className="max-w-3xl mx-auto mt-8 text-[14px] text-[#F9FAFB]">
          <span className="text-[#F59E0B] font-bold">The Gap:</span> <span className="text-[#9CA3AF]">There is no Nigerian-built, Naira-priced SaaS platform covering operations, compliance, HSE, and asset management for indigenous oil and gas operators. That is what FieldCore is.</span>
        </p>
      </div>

      {/* Feedback */}
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="font-syne text-[28px] text-[#F9FAFB]">You Are The Expert We Haven&apos;t Talked To Yet</h2>
        <div className="text-[15px] text-[#9CA3AF] leading-relaxed mt-6 space-y-4">
          <p>Everything on this page came from public sources. It represents what is visible from the outside. You have ground truth. You know which problem is most painful. You know what we got wrong.</p>
          <p>We built this demo to start that conversation.</p>
        </div>
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="bg-[#F59E0B] text-black font-semibold px-6 h-11 rounded text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center">Enter the Demo →</Link>
          <Link href="/" className="border border-[#F59E0B] text-[#F59E0B] px-6 h-11 rounded text-sm hover:bg-[#F59E0B]/10 transition-colors flex items-center justify-center">Back to Home</Link>
        </div>
      </div>

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
