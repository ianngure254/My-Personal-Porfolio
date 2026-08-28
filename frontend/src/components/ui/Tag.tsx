interface TagProps {
  label: string
  onClick?: () => void
  active?: boolean
}

const Tag = ({ label, onClick, active = false }: TagProps) => {
  const isInteractive = !!onClick

  return (
    <span
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? (e) => e.key === 'Enter' && onClick?.() : undefined}
      style={
        active
          ? {
              background: 'var(--orange)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 2px 12px rgba(249,115,22,0.3)',
            }
          : {
              background: 'var(--surface-2)',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
            }
      }
      className={`
        inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-mono font-medium
        transition-all duration-150 select-none whitespace-nowrap
        ${isInteractive ? 'cursor-pointer hover:border-(--orange) hover:text-(--orange)' : ''}
      `}
    >
      {label}
    </span>
  )
}

export default Tag
