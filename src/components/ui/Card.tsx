import type { ComponentPropsWithoutRef } from 'react'

type CardTone = 'cream' | 'beige'

interface CardProps extends ComponentPropsWithoutRef<'section'> {
  tone?: CardTone
}

const tones: Record<CardTone, string> = {
  cream: 'bg-cream',
  beige: 'bg-beige',
}

export function Card({ tone = 'cream', className = '', ...props }: CardProps) {
  return (
    <section
      className={`w-full min-w-0 rounded-2xl border-2 border-cacao p-5 shadow-cozy ${tones[tone]} ${className}`}
      {...props}
    />
  )
}
