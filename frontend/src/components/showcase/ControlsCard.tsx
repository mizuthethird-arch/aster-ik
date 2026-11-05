import { useState } from 'react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AvatarGroup } from '../ui/Avatar'
import { Progress } from '../ui/Progress'

type VariantName = 'Default' | 'Secondary' | 'Outline' | 'Ghost' | 'Destructive'

export function ControlsCard({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState('')
  const [count, setCount] = useState(0)

  const press = (name: VariantName) => setStatus(`Last action: ${name}`)

  const addAction = () => {
    const next = count + 1
    setCount(next)
    setStatus(`${next} action${next === 1 ? '' : 's'}`)
  }

  return (
    <Card title="Buttons and badges" className={className}>
      <div className="mt-16 grid gap-16">
        <div className="grid grid-cols-2 items-center gap-6 sm:grid-flow-col sm:auto-cols-max sm:grid-cols-none">
          <Button onClick={() => press('Default')}>Default</Button>
          <Button variant="secondary" onClick={() => press('Secondary')}>
            Secondary
          </Button>
          <Button variant="outline" onClick={() => press('Outline')}>
            Outline
          </Button>
          <Button variant="ghost" onClick={() => press('Ghost')}>
            Ghost
          </Button>
          <Button variant="destructive" onClick={() => press('Destructive')}>
            Destructive
          </Button>
          <Button
            variant="outline"
            aria-label="Add action"
            onClick={addAction}
            className="w-32 px-0"
          >
            +
          </Button>
        </div>

        <p role="status" className="min-h-20 text-caption text-muted">
          {status}
        </p>

        <div className="grid grid-cols-2 items-center gap-6 sm:grid-flow-col sm:auto-cols-max sm:grid-cols-none">
          <Badge>Default</Badge>
          <Badge tone="secondary">Secondary</Badge>
          <Badge tone="outline">Outline</Badge>
          <Badge tone="failed">Failed</Badge>
          <Badge tone="paid">Paid</Badge>
        </div>

        <Progress label="Storage" value={64} />

        <div className="grid grid-cols-[1fr_auto] items-center gap-12">
          <AvatarGroup />
          <span className="text-caption text-muted">Avatar group</span>
        </div>
      </div>
    </Card>
  )
}
