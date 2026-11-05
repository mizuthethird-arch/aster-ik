import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { usePrefersReducedMotion } from './use-prefers-reduced-motion'

/*
 * One motion provider for the app: the DOM animation feature set (not the full
 * bundle) and the reader's reduced-motion preference, read once here and passed
 * to Motion explicitly so `prefers-reduced-motion` is honoured at runtime.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>{children}</MotionConfig>
    </LazyMotion>
  )
}
