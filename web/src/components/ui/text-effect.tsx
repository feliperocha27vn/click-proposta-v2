import { cn } from '@/lib/utils'
import React from 'react'

export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide'

export type PerType = 'word' | 'char' | 'line'

export type TextEffectProps = {
  children: string
  per?: PerType
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  preset?: PresetType
  delay?: number
  speedReveal?: number
  speedSegment?: number
  trigger?: boolean
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
  segmentWrapperClassName?: string
  style?: React.CSSProperties
}

const splitText = (text: string, per: PerType) => {
  if (per === 'line') return text.split('\n')
  return text.split(/(\s+)/)
}

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  className,
  segmentWrapperClassName,
  style,
}: TextEffectProps) {
  const segments = splitText(children, per)
  const Tag = as as keyof React.JSX.IntrinsicElements

  const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block'

  return (
    // render statically without animations
    // keep structure so callers don't need changes
    React.createElement(
      Tag,
      { className, style },
      per !== 'line'
        ? React.createElement('span', { className: 'sr-only' }, children)
        : null,
      segments.map((segment, index) => {
        const key = `${per}-${index}-${segment}`
        if (!segmentWrapperClassName) {
          return (
            <span key={key} className={defaultWrapperClassName}>
              {segment}
            </span>
          )
        }

        return (
          <span
            key={key}
            className={cn(defaultWrapperClassName, segmentWrapperClassName)}
          >
            {segment}
          </span>
        )
      })
    )
  )
}
