import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  subtitle?: string
  action?: ReactNode
  className?: string
  children?: ReactNode
}

/* Surface for the component playground: title, optional subtitle and an
   optional action slot on the same row, then the body. */
export function Card({ title, subtitle, action, className = '', children }: CardProps) {
  const titleId = title ? `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-title` : undefined

  return (
    <section
      aria-labelledby={titleId}
      className={`flex flex-col rounded-xl border border-border bg-card p-16 ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            {title && (
              <h3 id={titleId} className="text-title text-fg">
                {title}
              </h3>
            )}
            {subtitle && <p className="mt-4 text-caption text-muted">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  )
}
