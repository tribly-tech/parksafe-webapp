import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

export const inputVariants = cva(
  'h-[52px] w-full rounded-md border bg-white px-3 text-base font-medium tracking-[-0.32px] text-neutral-900 shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-gray-300',
        error: 'border-error-500 focus:border-error-500',
        placeholder: 'text-gray-400',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

/** shadcn-style input primitive — token-based borders and focus rings. */
export function Input({ className, state, ...props }: InputProps) {
  return <input className={cn(inputVariants({ state }), className)} {...props} />
}
