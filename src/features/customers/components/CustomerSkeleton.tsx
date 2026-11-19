import { Card } from '../../../components/ui/Card'

export function CustomerSkeleton() {
  return (
    <Card tone="cream" aria-hidden="true" className="flex animate-pulse flex-col gap-2">
      <div className="h-6 w-2/3 rounded-lg bg-beige" />
      <div className="h-5 w-1/2 rounded-lg bg-beige" />
      <div className="h-4 w-3/4 rounded-lg bg-beige" />
    </Card>
  )
}
