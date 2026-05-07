import { TimelineEvent } from '@/lib/mockData'

interface TimelineProps {
  events: TimelineEvent[]
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={i} className="flex gap-0">
          <div className="text-xs text-[#6B7280] font-mono w-12 pt-0.5 flex-shrink-0">{event.time}</div>
          <div className="flex flex-col items-center mx-3 flex-shrink-0">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${
              event.type === 'alert' ? 'bg-[#F59E0B] ring-2 ring-[#F59E0B]/30' :
              event.type === 'complete' ? 'bg-[#10B981]' :
              'bg-[#374151]'
            }`} />
            {i < events.length - 1 && <div className="w-px bg-[#1F2937] flex-1 min-h-4" />}
          </div>
          <div className={`text-sm pb-4 ${
            event.type === 'alert' ? 'text-[#F59E0B]' :
            event.type === 'complete' ? 'text-[#10B981]' :
            'text-[#9CA3AF]'
          }`}>{event.label}</div>
        </div>
      ))}
    </div>
  )
}
