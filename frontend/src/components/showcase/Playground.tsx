import { AccountCard } from './AccountCard'
import { ActivityCard } from './ActivityCard'
import { CalendarCard } from './CalendarCard'
import { CommandCard } from './CommandCard'
import { ControlsCard } from './ControlsCard'
import { NotificationsCard } from './NotificationsCard'
import { ToastCard } from './ToastCard'

/*
 * Component playground: a bento grid of live demos. Everything here is
 * interactive — the copy invites the reader to actually try it.
 */
export function Playground({ onToggleTheme }: { onToggleTheme: () => void }) {
  return (
    <section
      id="components"
      aria-labelledby="components-title"
      className="mx-auto max-w-page px-16 pb-72 sm:px-24 md:px-32"
    >
      <h2
        id="components-title"
        className="border-t border-border pt-24 text-center font-mono text-eyebrow uppercase text-muted"
      >
        All components are worky, feel free to test them
      </h2>

      <div className="mt-32 grid grid-cols-1 items-stretch gap-16 sm:grid-cols-2 lg:grid-cols-3">
        <AccountCard />
        <CalendarCard />
        <div className="grid grid-rows-[1.2fr_1fr] gap-16">
          <NotificationsCard />
          <ToastCard />
        </div>
        <ActivityCard className="sm:col-span-2" />
        <CommandCard onToggleTheme={onToggleTheme} />
        <ControlsCard className="sm:col-span-2" />
      </div>
    </section>
  )
}
