interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case 'Completed':
      case 'Active':
      case 'Operational':
      case 'Approved':
      case 'Closed':
      case 'Submitted & Approved':
        return 'bg-green-900/40 text-green-400 border border-green-800/50'
      case 'In Progress':
      case 'Expiring Soon':
      case 'Pending':
      case 'Under Review':
      case 'At Risk':
      case 'Maintenance Due':
        return 'bg-amber-900/40 text-amber-400 border border-amber-800/50'
      case 'Critical':
      case 'Overdue':
      case 'Action Required':
      case 'Corrective Open':
        return 'bg-red-900/40 text-red-400 border border-red-800/50'
      case 'Draft':
      case 'Pending Renewal':
      case 'Inactive':
        return 'bg-gray-800 text-gray-400 border border-gray-700'
      case 'Submitted':
      case 'Info':
      case 'Final':
        return 'bg-blue-900/40 text-blue-400 border border-blue-800/50'
      default:
        return 'bg-gray-800 text-gray-400 border border-gray-700'
    }
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide ${getStyle()}`}>
      {status}
    </span>
  )
}
