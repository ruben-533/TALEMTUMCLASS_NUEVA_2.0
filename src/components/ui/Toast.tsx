interface Props {
  message: string
  variant?: 'success' | 'error' | 'info'
}

const styles = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-gray-900',
}

export default function Toast({ message, variant = 'success' }: Props) {
  return (
    <div
      role="status"
      className={`fixed left-1/2 top-5 z-[110] -translate-x-1/2 animate-fade-up rounded-xl px-4 py-3 text-sm font-500 text-white shadow-lg ${styles[variant]}`}
    >
      {message}
    </div>
  )
}
