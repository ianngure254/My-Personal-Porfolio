interface BadgeProps {
  label: string
  variant?: 'default' | 'primary' | 'success' | 'outline'
  size?: 'sm' | 'md'
}

const variants = {
  default: 'bg-white/5 text-(--color-muted) border border-(--color-border)',
  primary: 'bg-indigo-500/10 text-(--color-primary) border border-indigo-500/20',
  success: 'bg-emerald-500/10 text-(--color-success) border border-emerald-500/20',
  outline: 'border border-(--color-border) text-(--color-muted)',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
}

const Badge = ({ label, variant = 'default', size = 'md' }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-wide ${variants[variant]} ${sizes[size]}`}
    >
      {label}
    </span>
  )
}

export default Badge
