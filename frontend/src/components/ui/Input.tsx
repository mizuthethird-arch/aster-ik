import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  error?: string
}

/* Labelled text field with the page's hairline focus border and an inline
   error that is announced through aria-invalid/aria-describedby. */
export function Input({ id, label, error, className = '', ...props }: InputProps) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="grid gap-6">
      <label htmlFor={id} className="text-caption text-fg">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`h-control w-full rounded-input border bg-transparent px-10 text-body text-fg transition-ui placeholder:text-muted focus-visible:outline-none ${
          error
            ? 'border-danger focus-visible:border-danger'
            : 'border-border focus-visible:border-fg'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-caption text-danger-text">
          {error}
        </p>
      )}
    </div>
  )
}
