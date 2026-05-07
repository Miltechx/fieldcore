export type TimelineEventType = 'normal' | 'alert' | 'complete'

export interface TimelineEvent {
  time: string
  label: string
  type: TimelineEventType
}

export interface Job {
  id: string
  wellName: string
  client: string
  jobType: string
  date: string
  status: string
  engineer: string
  location: string
  field: string
  duration: string
  depthFrom: number
  depthTo: number
  toolsDeployed: string[]
  hasAlert: boolean
  alertText: string
  findings: string
  recommendations: string[]
  timeline: TimelineEvent[]
}

export interface Tool {
  id: string
  name: string
  shortName: string
  category: string
  lastCalibration: string
  nextDue: string
  status: string
  location: string
  calibrationHistory: { date: string; result: string; lab: string }[]
}

export interface Asset {
  id: string
  name: string
  category: string
  location: string
  lastMaintenance: string
  nextDue: string
  status: string
  assignedTo: string
  maintenanceInterval: string
  costYTD: number
}

export interface Incident {
  id: string
  type: string
  date: string
  time: string
  location: string
  severity: string
  status: string
  reportedBy: string
  description: string
  immediateAction: string
  timeline: TimelineEvent[]
}

export interface Filing {
  id: string
  period: string
  type: string
  submissionDate: string
  status: string
  reference: string
  approvedBy: string
  dueDate: string
  daysRemaining: number
}

export interface Report {
  id: string
  jobId: string
  wellName: string
  client: string
  date: string
  status: string
  pages: number
}

export const mockJobs: Job[] = [
  {
    id: "WO-2024-041",
    wellName: "Agbami-7",
    client: "SEPLAT Energy",
    jobType: "E-Line Logging",
    date: "12 Apr 2025",
    status: "Completed",
    engineer: "Emmanuel Kalu",
    location: "Agbami Deepwater Field",
    field: "Agbami FPSO",
    duration: "6h 40m",
    depthFrom: 3100,
    depthTo: 3400,
    toolsDeployed: ["FBS", "HRT", "MBTT4"],
    hasAlert: true,
    alertText: "Injection anomaly at 3,290m",
    findings: "Spinner survey confirmed zonal contribution from perforated intervals at 3,240m and 3,310m. Temperature anomaly identified at 3,290m consistent with injection breakthrough. Gas breakthrough risk assessed as LOW at current production rates.",
    recommendations: [
      "Reperforate lower zone interval at 3,290m–3,310m",
      "Monitor injection profile at 30-day interval",
      "Schedule follow-up temperature survey in Q3 2025"
    ],
    timeline: [
      { time: "08:00", label: "Job Started", type: "normal" as const },
      { time: "09:30", label: "Tools Deployed — FBS + HRT", type: "normal" as const },
      { time: "11:10", label: "Anomaly Detected at 3,290m", type: "alert" as const },
      { time: "13:45", label: "Job Completed Successfully", type: "complete" as const }
    ]
  },
  {
    id: "WO-2024-040",
    wellName: "Forcados-3",
    client: "TotalEnergies",
    jobType: "Well Integrity",
    date: "10 Apr 2025",
    status: "In Progress",
    engineer: "Emmanuel Kalu",
    location: "Forcados Terminal",
    field: "Forcados Terminal",
    duration: "Ongoing",
    depthFrom: 2800,
    depthTo: 3100,
    toolsDeployed: ["MBTT4"],
    hasAlert: false,
    alertText: "",
    findings: "Multi-barrier thickness survey ongoing. Initial readings indicate primary barrier integrity within acceptable range. Secondary barrier assessment pending completion.",
    recommendations: [
      "Continue survey to complete secondary barrier assessment",
      "Compare readings against well integrity baseline from 2023"
    ],
    timeline: [
      { time: "07:30", label: "Mobilization to Site", type: "normal" as const },
      { time: "09:00", label: "Job Started", type: "normal" as const },
      { time: "11:30", label: "Primary Barrier Survey Complete", type: "complete" as const },
      { time: "14:00", label: "Secondary Assessment In Progress", type: "normal" as const }
    ]
  },
  {
    id: "WO-2024-039",
    wellName: "Bonny-12",
    client: "Shell SPDC",
    jobType: "Slickline Intervention",
    date: "07 Apr 2025",
    status: "Completed",
    engineer: "Emmanuel Kalu",
    location: "Bonny River Terminal",
    field: "Bonny River Terminal",
    duration: "4h 20m",
    depthFrom: 2700,
    depthTo: 2900,
    toolsDeployed: ["MST"],
    hasAlert: false,
    alertText: "",
    findings: "Motorized Setting Tool deployment successful. Bridge plug set at 2,840m with confirmed seal integrity. Well successfully isolated for planned workover operations.",
    recommendations: [
      "Proceed with scheduled workover operations",
      "Verify plug integrity before re-perforation"
    ],
    timeline: [
      { time: "08:00", label: "Job Started", type: "normal" as const },
      { time: "09:15", label: "Tool Run to 2,840m", type: "normal" as const },
      { time: "10:30", label: "Bridge Plug Set — Seal Confirmed", type: "complete" as const },
      { time: "12:20", label: "Job Completed", type: "complete" as const }
    ]
  },
  {
    id: "WO-2024-038",
    wellName: "Egina-2",
    client: "TotalEnergies",
    jobType: "Gas Lift Optimization",
    date: "03 Apr 2025",
    status: "Pending",
    engineer: "Emmanuel Kalu",
    location: "Egina FPSO",
    field: "Egina FPSO",
    duration: "—",
    depthFrom: 0,
    depthTo: 0,
    toolsDeployed: [],
    hasAlert: false,
    alertText: "",
    findings: "Pending mobilization. Pre-job planning complete. Gas lift mandrel survey scheduled pending offshore logistics approval from TotalEnergies operations team.",
    recommendations: [
      "Confirm mobilization date with TotalEnergies logistics",
      "Verify tool certification status before deployment"
    ],
    timeline: [
      { time: "—", label: "Awaiting Mobilization Approval", type: "alert" as const }
    ]
  },
  {
    id: "WO-2024-037",
    wellName: "Bonga-SW",
    client: "Shell Deepwater",
    jobType: "SCSSV Diagnostic",
    date: "28 Mar 2025",
    status: "Completed",
    engineer: "Emmanuel Kalu",
    location: "Bonga FPSO",
    field: "Bonga FPSO",
    duration: "3h 50m",
    depthFrom: 1200,
    depthTo: 1400,
    toolsDeployed: ["PCDSV Kit"],
    hasAlert: false,
    alertText: "",
    findings: "Surface-controlled subsurface safety valve pressure test passed. PCDSV function verified at full operating pressure. Valve response time within specification.",
    recommendations: [
      "No immediate action required",
      "Schedule next diagnostic in 12 months per BONGA-SW well integrity programme"
    ],
    timeline: [
      { time: "08:30", label: "Job Started", type: "normal" as const },
      { time: "09:00", label: "Tool Deployed to SCSSV Depth", type: "normal" as const },
      { time: "10:15", label: "Pressure Test Passed", type: "complete" as const },
      { time: "12:20", label: "Job Completed — All Clear", type: "complete" as const }
    ]
  }
]

export const mockTools: Tool[] = [
  {
    id: "WT-0042", name: "Multi-Barrier Thickness Tool", shortName: "MBTT4",
    category: "Well Integrity", lastCalibration: "20 Nov 2024", nextDue: "20 May 2025",
    status: "Expiring Soon", location: "Base",
    calibrationHistory: [
      { date: "20 May 2024", result: "Passed", lab: "Intertek PHC" },
      { date: "20 Nov 2024", result: "Passed", lab: "Intertek PHC" }
    ]
  },
  {
    id: "GR-0017", name: "Gamma Ray Logging Tool", shortName: "GR Tool",
    category: "E-Line Logging", lastCalibration: "05 Nov 2024", nextDue: "05 May 2025",
    status: "Critical", location: "Deployed - Agbami",
    calibrationHistory: [
      { date: "05 May 2024", result: "Passed", lab: "Bureau Veritas Lagos" },
      { date: "05 Nov 2024", result: "Passed", lab: "Bureau Veritas Lagos" }
    ]
  },
  {
    id: "SP-0091", name: "Full-Bore Spinner", shortName: "FBS",
    category: "Production Profiling", lastCalibration: "14 Jan 2025", nextDue: "14 Jul 2025",
    status: "Active", location: "Base",
    calibrationHistory: [
      { date: "14 Jul 2024", result: "Passed", lab: "SGS Nigeria" },
      { date: "14 Jan 2025", result: "Passed", lab: "SGS Nigeria" }
    ]
  },
  {
    id: "MS-0033", name: "Motorized Setting Tool", shortName: "MST",
    category: "ELS Intervention", lastCalibration: "03 Feb 2025", nextDue: "03 Aug 2025",
    status: "Active", location: "Deployed - Bonny",
    calibrationHistory: [
      { date: "03 Aug 2024", result: "Passed", lab: "Intertek PHC" },
      { date: "03 Feb 2025", result: "Passed", lab: "Intertek PHC" }
    ]
  },
  {
    id: "CA-0055", name: "Capacitance Array Tool", shortName: "CAT",
    category: "Fluid Identification", lastCalibration: "22 Dec 2024", nextDue: "22 Jun 2025",
    status: "Active", location: "Base",
    calibrationHistory: [
      { date: "22 Jun 2024", result: "Passed", lab: "Bureau Veritas Lagos" },
      { date: "22 Dec 2024", result: "Passed", lab: "Bureau Veritas Lagos" }
    ]
  },
  {
    id: "DC-0018", name: "Downhole Flash Cutter", shortName: "DFC",
    category: "ELS Intervention", lastCalibration: "10 Mar 2025", nextDue: "10 Sep 2025",
    status: "Active", location: "Base",
    calibrationHistory: [
      { date: "10 Sep 2024", result: "Passed", lab: "SGS Nigeria" },
      { date: "10 Mar 2025", result: "Passed", lab: "SGS Nigeria" }
    ]
  }
]

export const mockAssets: Asset[] = [
  { id: "VH-0011", name: "Toyota Land Cruiser V8", category: "Vehicle", location: "Port Harcourt Base", lastMaintenance: "01 Mar 2025", nextDue: "01 Jun 2025", status: "Operational", assignedTo: "Emmanuel Kalu", maintenanceInterval: "Quarterly", costYTD: 420000 },
  { id: "VH-0012", name: "Ford F-250 Field Truck", category: "Vehicle", location: "Forcados Terminal", lastMaintenance: "15 Feb 2025", nextDue: "15 May 2025", status: "Maintenance Due", assignedTo: "Field Team B", maintenanceInterval: "Quarterly", costYTD: 280000 },
  { id: "GN-0003", name: "100KVA Perkins Generator", category: "Generator", location: "Port Harcourt Base", lastMaintenance: "10 Apr 2025", nextDue: "10 Jul 2025", status: "Operational", assignedTo: "Base Team", maintenanceInterval: "Quarterly", costYTD: 560000 },
  { id: "GN-0004", name: "60KVA Caterpillar Gen Set", category: "Generator", location: "Agbami FPSO", lastMaintenance: "20 Mar 2025", nextDue: "20 Jun 2025", status: "Operational", assignedTo: "Offshore Team", maintenanceInterval: "Quarterly", costYTD: 390000 },
  { id: "PP-0007", name: "Centrifugal Transfer Pump", category: "Pump", location: "Bonny Terminal", lastMaintenance: "05 Jan 2025", nextDue: "05 May 2025", status: "Maintenance Due", assignedTo: "Bonny Team", maintenanceInterval: "Quarterly", costYTD: 175000 },
  { id: "PP-0008", name: "High-Pressure Test Pump", category: "Pump", location: "Port Harcourt Base", lastMaintenance: "28 Feb 2025", nextDue: "28 May 2025", status: "Maintenance Due", assignedTo: "Base Team", maintenanceInterval: "Quarterly", costYTD: 210000 },
  { id: "CP-0002", name: "Air Compressor (Atlas Copco)", category: "Compressor", location: "Port Harcourt Base", lastMaintenance: "12 Mar 2025", nextDue: "12 Sep 2025", status: "Operational", assignedTo: "Base Team", maintenanceInterval: "Bi-Annual", costYTD: 320000 },
  { id: "MV-0001", name: "Work Boat — Delta Star", category: "Marine Vessel", location: "Forcados Terminal", lastMaintenance: "22 Apr 2025", nextDue: "22 Jul 2025", status: "Operational", assignedTo: "Marine Team", maintenanceInterval: "Quarterly", costYTD: 1200000 }
]

export const mockIncidents: Incident[] = [
  {
    id: "HSE-2025-007", type: "Near Miss", date: "09 Apr 2025", time: "10:15",
    location: "Forcados-3", severity: "Low", status: "Closed", reportedBy: "Emmanuel Kalu",
    description: "Loose bolt found on wellhead access ladder during pre-job inspection. No personnel injury. Maintenance called immediately.",
    immediateAction: "Area cordoned off. Maintenance team dispatched. Bolt replaced and ladder inspected within 45 minutes.",
    timeline: [
      { time: "10:15", label: "Near Miss Reported", type: "normal" as const },
      { time: "10:20", label: "Area Cordoned Off", type: "normal" as const },
      { time: "11:00", label: "Maintenance Completed", type: "complete" as const },
      { time: "11:15", label: "Incident Closed", type: "complete" as const }
    ]
  },
  {
    id: "HSE-2025-006", type: "Equipment Damage", date: "02 Apr 2025", time: "14:32",
    location: "Agbami-7", severity: "Medium", status: "Under Review", reportedBy: "Emmanuel Kalu",
    description: "Gamma Ray Logging Tool (GR-0017) sustained cable tension damage during retrieval at 3,140m. Outer cable armor frayed. Tool recovered intact. No personnel injury.",
    immediateAction: "Tool withdrawn from service. Cable inspected and found serviceable. Tool flagged for early calibration check. Operations resumed after 2-hour delay.",
    timeline: [
      { time: "14:32", label: "Incident Reported", type: "normal" as const },
      { time: "14:35", label: "Operations Suspended", type: "alert" as const },
      { time: "14:45", label: "Supervisor Notified", type: "normal" as const },
      { time: "15:00", label: "Tool Withdrawn from Service", type: "normal" as const },
      { time: "17:00", label: "Operations Resumed", type: "complete" as const }
    ]
  },
  {
    id: "HSE-2025-005", type: "Near Miss", date: "28 Mar 2025", time: "09:45",
    location: "Bonga-SW", severity: "Low", status: "Closed", reportedBy: "Safety Officer",
    description: "PPE non-compliance observed on rig floor. One technician found without hard hat. Corrected immediately on site.",
    immediateAction: "Verbal warning issued. PPE briefing conducted for all personnel on deck.",
    timeline: [
      { time: "09:45", label: "Non-Compliance Observed", type: "alert" as const },
      { time: "09:50", label: "Immediate Correction", type: "normal" as const },
      { time: "10:00", label: "PPE Briefing Conducted", type: "complete" as const },
      { time: "10:15", label: "Incident Logged and Closed", type: "complete" as const }
    ]
  },
  {
    id: "HSE-2025-004", type: "Minor Injury", date: "15 Mar 2025", time: "11:20",
    location: "Bonny-12", severity: "Medium", status: "Closed", reportedBy: "Field Supervisor",
    description: "Technician sustained minor laceration to left hand during tool assembly. Wound cleaned and dressed on site. No stitches required. Personnel returned to work same day.",
    immediateAction: "First aid applied. Incident reported to HSE manager. No MEDEVAC required.",
    timeline: [
      { time: "11:20", label: "Injury Occurred", type: "alert" as const },
      { time: "11:25", label: "First Aid Administered", type: "normal" as const },
      { time: "12:00", label: "HSE Manager Notified", type: "normal" as const },
      { time: "13:00", label: "Personnel Returned to Work", type: "complete" as const },
      { time: "17:00", label: "Incident Report Filed", type: "complete" as const }
    ]
  },
  {
    id: "HSE-2025-003", type: "Environmental", date: "04 Mar 2025", time: "08:00",
    location: "Egina-2", severity: "High", status: "Corrective Open", reportedBy: "HSE Manager",
    description: "Minor hydraulic fluid leak detected from wireline unit during standby. Approximately 2 litres released to deck surface. Contained within secondary bund. No overboard discharge.",
    immediateAction: "Leak source identified and isolated. Absorbent materials deployed. Fluid contained and recovered. NOSDRA notification filed within 24 hours as required.",
    timeline: [
      { time: "08:00", label: "Leak Detected", type: "alert" as const },
      { time: "08:10", label: "Source Isolated", type: "normal" as const },
      { time: "08:30", label: "Containment and Recovery", type: "normal" as const },
      { time: "09:00", label: "NOSDRA Notification Filed", type: "complete" as const },
      { time: "Ongoing", label: "Environmental Remediation Open", type: "alert" as const }
    ]
  }
]

export const mockFilings: Filing[] = [
  { id: "F-2025-Q1", period: "Q1 2025", type: "Quarterly NCP Report", submissionDate: "15 Apr 2025", status: "Submitted & Approved", reference: "NCDMB/NCP/2025/Q1/04291", approvedBy: "NCDMB South-South Region 2", dueDate: "", daysRemaining: 0 },
  { id: "F-2024-Q4", period: "Q4 2024 / Annual", type: "Annual Nigerian Content Plan", submissionDate: "30 Jan 2025", status: "Submitted & Approved", reference: "NCDMB/NCP/ANN/2024/01847", approvedBy: "NCDMB South-South Region 2", dueDate: "", daysRemaining: 0 },
  { id: "F-2024-Q3", period: "Q3 2024", type: "Quarterly NCP Report", submissionDate: "14 Oct 2024", status: "Submitted & Approved", reference: "NCDMB/NCP/2024/Q3/03917", approvedBy: "NCDMB South-South Region 2", dueDate: "", daysRemaining: 0 },
  { id: "F-2025-Q2", period: "Q2 2025", type: "Quarterly NCP Report", submissionDate: "", status: "Pending", reference: "", approvedBy: "", dueDate: "30 Jun 2025", daysRemaining: 18 },
  { id: "F-NCFCC-2025", period: "2025", type: "NCFCC Certificate Renewal", submissionDate: "", status: "Action Required", reference: "NCDMB/NCFCC/2024/04871", approvedBy: "", dueDate: "15 Jun 2025", daysRemaining: 12 }
]

export const mockReports: Report[] = [
  { id: "RPT-2025-041", jobId: "WO-2024-041", wellName: "Agbami-7", client: "SEPLAT Energy", date: "12 Apr 2025", status: "Final", pages: 4 },
  { id: "RPT-2025-039", jobId: "WO-2024-039", wellName: "Bonny-12", client: "Shell SPDC", date: "07 Apr 2025", status: "Final", pages: 3 },
  { id: "RPT-2025-038", jobId: "WO-2024-038", wellName: "Egina-2", client: "TotalEnergies", date: "03 Apr 2025", status: "Draft", pages: 2 }
]

export const mockComplianceData = {
  nigerianContentScore: 67,
  targetScore: 70,
  nextFilingDeadline: "30 June 2025",
  daysToFiling: 18,
  ncfccStatus: "Pending Renewal",
  workforce: {
    nigerianNationals: 94,
    juniorIntermediate: 98,
    seniorManagement: 81,
    expatriateUsed: 3,
    expatriateAllowed: 5
  },
  procurement: {
    totalThisQuarter: "₦2.4B",
    localSourcingPercent: 61,
    importedPercent: 39,
    itemsWithWaiver: 4,
    categories: [
      { name: "Professional Services", local: 78, target: 70 },
      { name: "Logistics & Transport", local: 89, target: 70 },
      { name: "Specialized Equipment", local: 52, target: 70 },
      { name: "Chemicals & Reagents", local: 44, target: 70 }
    ]
  },
  capacityBuilding: {
    trainingHours: 1240,
    ncdFundContribution: "₦18.2M",
    technologyTransferPrograms: 3,
    rdActivities: 1
  }
}
