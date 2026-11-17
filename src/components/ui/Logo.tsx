import logo from '@/assets/logo.png'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  light?: boolean
  className?: string
}

const sizes = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
}

export default function Logo({ size = 'md', showWordmark = true, light = false, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src={logo} alt="TALEMTUMCLASS" className={`${sizes[size]} rounded-xl object-contain`} />
      {showWordmark && (
        <span className={`font-700 tracking-tight ${light ? 'text-white' : 'text-[#221A3A]'}`}>
          TALEMTUMCLASS
        </span>
      )}
    </span>
  )
}
