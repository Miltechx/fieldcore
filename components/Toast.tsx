'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
  onClose: () => void
}

export default function Toast({ message, type, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, 3000)
      return () => clearTimeout(t)
    }
  }, [visible, onClose])

  const borderColor = type === 'success' ? 'border-l-[#10B981]' : type === 'error' ? 'border-l-[#EF4444]' : 'border-l-[#F59E0B]'
  const dotColor = type === 'success' ? 'bg-[#10B981]' : type === 'error' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'

  return (
    <div
      className={`fixed bottom-6 right-6 md:right-6 left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 z-50 w-[calc(100vw-32px)] md:w-80 bg-[#111827] border border-[#1F2937] border-l-4 ${borderColor} rounded p-4 flex items-center gap-3 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
      <span className="text-sm text-[#F9FAFB]">{message}</span>
      <button onClick={onClose} className="ml-auto text-[#6B7280] hover:text-[#F9FAFB] text-lg leading-none">×</button>
    </div>
  )
}
