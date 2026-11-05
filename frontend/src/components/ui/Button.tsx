import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'default'

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-inv text-inv-fg hover:opacity-90',
  secondary: 'border border-border bg-transparent text-fg hover:bg-subtle',
  outline: 'border border-fg/40 bg-transparent text-fg hover:bg-subtle',
  ghost: 'bg-transparent text-muted hover:bg-subtle hover:text-fg',
  destructive: 'bg-danger text-on-danger hover:opacity-90',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-control-sm px-12 text-label',
  default: 'h-control px-16 text-body-medium',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'default',
  size = 'sm',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-grid grid-flow-col auto-cols-max items-center justify-center gap-6 rounded-md font-medium transition-ui disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  )
}
