import { Card } from '../../../components/ui/Card'

/** Placeholder com as proporções do ProductCard. */
export function ProductSkeleton() {
  return (
    <Card tone="cream" aria-hidden="true" className="flex animate-pulse flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="h-6 w-2/3 rounded-lg bg-beige" />
        <div className="h-6 w-14 rounded-full bg-beige" />
      </div>
      <div className="h-4 w-full rounded-lg bg-beige" />
      <div className="h-4 w-3/4 rounded-lg bg-beige" />
      <div className="mt-1 h-8 w-24 rounded-lg bg-beige" />
    </Card>
  )
}
