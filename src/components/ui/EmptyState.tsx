import type { ReactNode } from 'react'

interface Props {
  icon: string
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({ icon, title, description, action, className = '' }: Props) {
  return (
    <div className={`rounded-2xl border border-[#EAE1CD] bg-[#FFFDF8] px-6 py-14 text-center ${className}`}>
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F3E9] text-2xl">
        {icon}
      </div>
      <h3 className="font-700 text-[#221A3A]">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
