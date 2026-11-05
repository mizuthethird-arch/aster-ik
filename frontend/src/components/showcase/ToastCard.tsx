import { m } from 'motion/react'
import { useEffect, useState } from 'react'
import { CheckIcon } from '../icons'
import { toastVariants } from '../../motion/config'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

type ToastKind = 'saved' | 'undone'

const copy: Record<ToastKind, { title: string; description: string }> = {
  saved: { title: 'Changes saved', description: 'Your workspace was updated.' },
  undone: { title: 'Changes undone', description: 'Your workspace was restored.' },
}

export function ToastCard({ className = '' }: { className?: string }) {
  const [toast, setToast] = useState<ToastKind | null>('saved')

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), toast === 'saved' ? 5000 : 2000)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <Card title="Toast" className={className}>
      <div className="mt-16 grid gap-12">
        <Button onClick={() => setToast('saved')}>Show toast</Button>

        <div aria-live="polite">
          {toast && (
            <m.div
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-[auto_1fr_auto] items-start gap-10 rounded-lg border border-border bg-subtle p-12"
            >
              <CheckIcon className="mt-2 size-16 text-success-text" />
              <div role="status">
                <p className="text-body-medium text-fg">{copy[toast].title}</p>
                <p className="mt-2 text-caption text-muted">{copy[toast].description}</p>
              </div>
              <Button variant="ghost" onClick={() => setToast('undone')}>
                Undo
              </Button>
            </m.div>
          )}
        </div>
      </div>
    </Card>
  )
}
