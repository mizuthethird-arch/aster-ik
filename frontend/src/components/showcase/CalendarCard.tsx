import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons'
import { Card } from '../ui/Card'

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

type MonthView = { year: number; month: number }

const monthName = (view: MonthView) =>
  new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(
    new Date(view.year, view.month, 1),
  )

const shortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const shortMonth = (month: number) => shortMonths[month]

const daysIn = (view: MonthView) => new Date(view.year, view.month + 1, 0).getDate()

/* Monday-first leading blanks: Date.getDay() is Sunday=0. */
const leadingBlanks = (view: MonthView) => (new Date(view.year, view.month, 1).getDay() + 6) % 7

const initialView: MonthView = { year: 2026, month: 9 }

export function CalendarCard({ className = '' }: { className?: string }) {
  const [view, setView] = useState<MonthView>(initialView)
  const [selected, setSelected] = useState({ ...initialView, day: 18 })

  const moveMonth = (delta: number) => {
    const next = new Date(view.year, view.month + delta, 1)
    const nextView = { year: next.getFullYear(), month: next.getMonth() }
    setView(nextView)
    setSelected({ ...nextView, day: 1 })
  }

  const selectedLabel = `${shortMonth(selected.month)} ${selected.day}`

  return (
    <Card title={monthName(view)} className={className}>
      <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-8">
        <p className="text-caption text-muted">Selected: {selectedLabel}</p>
        <div className="grid grid-flow-col auto-cols-max gap-4">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => moveMonth(-1)}
            className="grid size-24 place-items-center rounded-md text-muted transition-ui hover:bg-subtle hover:text-fg"
          >
            <ChevronLeftIcon className="size-16" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => moveMonth(1)}
            className="grid size-24 place-items-center rounded-md text-muted transition-ui hover:bg-subtle hover:text-fg"
          >
            <ChevronRightIcon className="size-16" />
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-7 gap-2 text-center">
        {weekdays.map((day) => (
          <span key={day} className="text-caption text-muted">
            {day}
          </span>
        ))}

        {Array.from({ length: leadingBlanks(view) }, (_, index) => (
          <span key={`blank-${index}`} aria-hidden="true" />
        ))}

        {Array.from({ length: daysIn(view) }, (_, index) => {
          const day = index + 1
          const isSelected =
            selected.year === view.year && selected.month === view.month && selected.day === day

          return (
            <button
              key={day}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected({ ...view, day })}
              className={`grid h-32 place-items-center rounded-sm text-caption transition-ui ${
                isSelected
                  ? 'bg-inv font-medium text-inv-fg'
                  : 'text-muted hover:bg-subtle hover:text-fg'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
