import type { ReactNode } from 'react'

export type BadgeTone = 'default' | 'secondary' | 'outline' | 'failed' | 'paid'

const toneClasses: Record<BadgeTone, string> = {
  default: 'bg-inv text-inv-fg',
  secondary: 'bg-subtle text-fg',
  outline: 'border border-border text-muted',
  failed: 'bg-danger-soft text-danger-text',
  paid: 'bg-success-soft text-success-text',
}

export function Badge({ tone = 'default', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-grid grid-flow-col auto-cols-max items-center rounded-full px-10 py-2 text-caption font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}
