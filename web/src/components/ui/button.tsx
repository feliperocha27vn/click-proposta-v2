import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center font-medium rounded-xl border transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  ],
  variants: {
    variant: {
      primary:
        'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
      secondary:
        'border-border bg-secondary text-secondary-foreground hover:bg-muted',
      ghost:
        'border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-raised',
      destructive:
        'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
    size: {
      sm: 'h-8 px-3 gap-1.5 text-xs [&_svg]:size-3',
      md: 'h-11 px-6 gap-2 text-sm [&_svg]:size-4',
      lg: 'h-14 px-4 gap-2 text-base [&_svg]:size-5',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      data-slot="button"
      data-disabled={disabled ? '' : undefined}
      className={twMerge(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
