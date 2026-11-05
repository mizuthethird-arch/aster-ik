import { useState } from 'react'
import { Card } from '../ui/Card'
import { Toggle } from '../ui/Toggle'

export function NotificationsCard({ className = '' }: { className?: string }) {
  const [push, setPush] = useState(true)
  const [digest, setDigest] = useState(false)

  return (
    <Card title="Notifications" subtitle="Choose what reaches you." className={className}>
      <div className="mt-16 grid gap-16">
        <Toggle label="Push" description="On this device" checked={push} onChange={setPush} />
        <Toggle
          label="Weekly digest"
          description="By email"
          checked={digest}
          onChange={setDigest}
        />
      </div>
    </Card>
  )
}
