import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

export const buttonVariants = cva(
  'inline-flex min-h-touch items-center justify-center gap-2 rounded-button text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50',
        ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100',
      },
      size: {
        default: 'px-6 py-3',
        sm: 'px-4 py-2',
        pill: 'h-[54px] flex-1 rounded-button border px-4 text-base tracking-[-0.32px]',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        size: 'pill',
        className:
          'border-primary-500 bg-white text-primary-500 shadow-card-offset-primary hover:bg-primary-50',
      },
      {
        variant: 'secondary',
        size: 'pill',
        className: 'border-gray-300 text-slate-500 shadow-card-offset hover:bg-neutral-50',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/** shadcn-style button primitive — extends design tokens via cva. */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
