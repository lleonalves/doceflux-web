import { Card } from '../../../components/ui/Card'

/** Placeholder com as proporções do OrderCard. */
export function OrderSkeleton() {
  return (
    <Card tone="cream" aria-hidden="true" className="flex animate-pulse flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="h-6 w-1/2 rounded-lg bg-beige" />
        <div className="h-6 w-20 rounded-full bg-beige" />
      </div>
      <div className="h-4 w-1/3 rounded-lg bg-beige" />
      <div className="h-4 w-3/4 rounded-lg bg-beige" />
      <div className="h-20 rounded-xl bg-beige" />
      <div className="mt-1 flex justify-between border-t-2 border-cacao/20 pt-3">
        <div className="h-5 w-12 rounded-lg bg-beige" />
        <div className="h-7 w-24 rounded-lg bg-beige" />
      </div>
    </Card>
  )
}
