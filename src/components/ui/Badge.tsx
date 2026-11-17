import type { ReactNode } from 'react'

type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const variants: Record<Variant, string> = {
  primary: 'bg-indigo-50 text-[#5548C8] border-indigo-100',
  success: 'bg-green-50 text-green-700 border-green-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-red-50 text-red-700 border-red-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
  neutral: 'bg-gray-100 text-gray-600 border-[#E4DAC6]',
}

interface Props {
  children: ReactNode
  variant?: Variant
  dot?: boolean
  className?: string
}

export default function Badge({ children, variant = 'neutral', dot = false, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-500 ${variants[variant]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}
