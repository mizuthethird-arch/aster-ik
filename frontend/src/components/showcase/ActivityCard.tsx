import { useState } from 'react'
import { Card } from '../ui/Card'
import { Segmented } from '../ui/Segmented'

type Range = 'week' | 'month' | 'year'

type Bar = { label: string; short: string; value: number }

const data: Record<Range, Bar[]> = {
  week: [
    { label: 'Mon', short: 'M', value: 40 },
    { label: 'Tue', short: 'T', value: 62 },
    { label: 'Wed', short: 'W', value: 48 },
    { label: 'Thu', short: 'T', value: 88 },
    { label: 'Fri', short: 'F', value: 52 },
    { label: 'Sat', short: 'S', value: 72 },
    { label: 'Sun', short: 'S', value: 96 },
  ],
  month: [
    { label: 'Week 1', short: 'W1', value: 58 },
    { label: 'Week 2', short: 'W2', value: 74 },
    { label: 'Week 3', short: 'W3', value: 66 },
    { label: 'Week 4', short: 'W4', value: 84 },
  ],
  year: [
    { label: 'Jan', short: 'J', value: 52 },
    { label: 'Feb', short: 'F', value: 44 },
    { label: 'Mar', short: 'M', value: 66 },
    { label: 'Apr', short: 'A', value: 58 },
    { label: 'May', short: 'M', value: 72 },
    { label: 'Jun', short: 'J', value: 64 },
    { label: 'Jul', short: 'J', value: 80 },
    { label: 'Aug', short: 'A', value: 70 },
    { label: 'Sep', short: 'S', value: 62 },
    { label: 'Oct', short: 'O', value: 86 },
    { label: 'Nov', short: 'N', value: 74 },
    { label: 'Dec', short: 'D', value: 92 },
  ],
}

const rangeOptions = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
] as const

const columns: Record<Range, string> = {
  week: 'grid-cols-7',
  month: 'grid-cols-4',
  year: 'grid-cols-12',
}

export function ActivityCard({ className = '' }: { className?: string }) {
  const [range, setRange] = useState<Range>('week')
  const bars = data[range]
  const last = bars.length - 1

  return (
    <Card
      title="Weekly activity"
      subtitle="Chart component · sample data"
      className={className}
      action={
        <Segmented label="Chart range" options={rangeOptions} value={range} onChange={setRange} />
      }
    >
      <ul
        aria-label={`Activity by ${range}`}
        className={`mt-16 grid min-h-112 flex-1 items-end gap-6 ${columns[range]}`}
      >
        {bars.map((bar, index) => (
          <li
            key={`${range}-${bar.label}`}
            aria-label={`${bar.label} ${bar.value}`}
            className="grid h-full grid-rows-[1fr_auto] items-end gap-6"
          >
            <div
              className={`w-full rounded-sm ${index === last ? 'bg-inv' : 'bg-border'}`}
              style={{ height: `${bar.value}%` }}
            />
            <span className="text-center text-caption text-muted">{bar.short}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
