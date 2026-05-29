'use client'

import { type ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'
import { Button, buttonVariants } from '@/components/ui/button'
import { inputVariants } from '@/components/ui/input'

const sectionCardVariants = cva(
  'flex w-full flex-col gap-6 rounded-2xl border bg-white p-[25px]',
  {
    variants: {
      variant: {
        default: 'border-gray-300 shadow-card-offset',
        consent: 'border-primary-500 shadow-card-offset-primary',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

const checkboxBoxVariants = cva(
  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border-2 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-500',
  {
    variants: {
      checked: {
        true: 'border-primary-500 bg-primary-500 text-white',
        false: 'border-gray-300 bg-white',
      },
    },
    defaultVariants: { checked: false },
  }
)

interface SectionCardProps {
  title: string
  icon: ReactNode
  children: ReactNode
  variant?: 'default' | 'consent'
}

/** Figma card — white bg, grey border, 4px offset shadow. */
export function SectionCard({ title, icon, children, variant = 'default' }: SectionCardProps) {
  return (
    <section className={sectionCardVariants({ variant })}>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-primary-50 text-primary-500">
          {icon}
        </div>
        <h2 className="text-lg font-semibold tracking-[-0.36px] text-neutral-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}

interface FieldLabelProps {
  htmlFor?: string | undefined
  children: ReactNode
  required?: boolean | undefined
}

export function FieldLabel({ htmlFor, children, required }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium tracking-[-0.28px] text-slate-500"
    >
      {children}
      {required && <span className="text-error-500"> *</span>}
    </label>
  )
}


interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | undefined
  required?: boolean | undefined
}

export function TextField({ label, error, required, id, className, ...props }: TextFieldProps) {
  const fieldId = id ?? props.name

  return (
    <div className="flex w-full flex-col gap-2">
      <FieldLabel htmlFor={fieldId} required={required}>
        {label}
      </FieldLabel>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(inputVariants({ state: error ? 'error' : 'default' }), className)}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} className="text-sm text-error-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface PhoneFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string | undefined
  error?: string | undefined
  required?: boolean | undefined
  disabled?: boolean | undefined
}

export function PhoneField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
}: PhoneFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium tracking-[-0.32px] text-slate-500"
          aria-hidden
        >
          +91
        </span>
        <input
          id={name}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
          className={cn(inputVariants({ state: error ? 'error' : 'default' }), 'pl-14')}
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="text-sm text-error-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface SelectFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string | undefined
  error?: string | undefined
  required?: boolean | undefined
  disabled?: boolean | undefined
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onChange={e => onChange(e.target.value)}
          className={cn(
            inputVariants({ state: error ? 'error' : !value ? 'placeholder' : 'default' }),
            'appearance-none pr-10'
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="text-neutral-900">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 text-slate-500"
          aria-hidden
        />
      </div>
      {error && (
        <p className="text-sm text-error-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface CheckboxFieldProps {
  label: string
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string | undefined
  disabled?: boolean | undefined
}

export function CheckboxField({
  label,
  name,
  checked,
  onChange,
  error,
  disabled,
}: CheckboxFieldProps) {
  const inputId = `checkbox-${name}`

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className={cn(
          'flex cursor-pointer items-start gap-3',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          id={inputId}
          type="checkbox"
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
          className="sr-only peer"
          aria-invalid={error ? true : undefined}
        />
        <span
          aria-hidden
          className={checkboxBoxVariants({ checked })}
        >
          {checked && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
        </span>
        <span className="text-[15px] font-medium leading-[22.5px] tracking-[-0.3px] text-neutral-900">
          {label}
        </span>
      </label>
      {error && (
        <p className="text-sm text-error-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function PillButton({ variant = 'primary', className, children, ...props }: PillButtonProps) {
  return (
    <Button
      type="button"
      variant={variant === 'primary' ? 'primary' : 'secondary'}
      size="pill"
      className={className}
      {...props}
    >
      {children}
    </Button>
  )
}
