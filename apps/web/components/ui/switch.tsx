import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

export const switchTrackVariants = cva(
  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
  {
    variants: {
      checked: {
        true: 'bg-primary-500',
        false: 'bg-neutral-200',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      checked: false,
      disabled: false,
    },
  }
)

export const switchThumbVariants = cva(
  'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
  {
    variants: {
      checked: {
        true: 'translate-x-5',
        false: 'translate-x-0.5',
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
)

interface SwitchProps extends VariantProps<typeof switchTrackVariants> {
  checked: boolean
  className?: string
}

/** Visual switch indicator — pairs with a hidden native checkbox or button. */
export function Switch({ checked, disabled, className }: SwitchProps) {
  return (
    <span className={cn(switchTrackVariants({ checked, disabled }), className)}>
      <span className={switchThumbVariants({ checked: checked ?? false })} />
    </span>
  )
}
