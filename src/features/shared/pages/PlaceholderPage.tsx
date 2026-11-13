import { Card } from '../../../components/ui/Card'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-6xl">
      <Card tone="beige">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-cacao/80">Esta área ainda será implementada.</p>
      </Card>
    </div>
  )
}
