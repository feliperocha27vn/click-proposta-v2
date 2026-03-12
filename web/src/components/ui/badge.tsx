import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv, type VariantProps } from 'tailwind-variants'

export const badgeVariants = tv({
  base: [
    'inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  ],
  variants: {
    variant: {
      primary: 'border-transparent bg-primary text-primary-foreground',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      outline: 'border-border text-foreground',
    },
  },
  defaultVariants: { variant: 'primary' },
})

export interface BadgeProps
  extends ComponentProps<'div'>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={twMerge(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}
