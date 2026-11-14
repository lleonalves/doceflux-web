import { useState } from 'react'
import { Edit2, Image, Plus } from 'lucide-react'
import { ProductForm, type ProductFormValues } from './ProductForm'

// Mock temporário, apenas para renderizar a tela.
const mockProducts = [
  {
    id: '1',
    name: 'Brigadeiro Gourmet',
    price: 4.5,
    stockQuantity: 40,
    imageUrl: '',
    active: true,
  },
  {
    id: '2',
    name: 'Bolo de Cenoura',
    price: 38,
    stockQuantity: 0,
    imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600',
    active: false,
  },
]

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function ProductCatalog() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  function handleSubmit(values: ProductFormValues) {
    console.log('Produto salvo (mock):', values)
    setIsFormOpen(false)
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-cacao">Catálogo de Produtos</h1>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-lg border-2 border-cacao bg-rose-deep px-4 py-2 font-bold text-cream shadow-cozy transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          <Plus size={18} />
          Novo Produto
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockProducts.map((product) => (
          <article
            key={product.id}
            className="flex flex-col overflow-hidden rounded-xl border-2 border-cacao bg-cream shadow-cozy"
          >
            <div className="flex h-40 items-center justify-center border-b-2 border-cacao bg-beige">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <Image size={40} className="text-cacao/50" />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-cacao">{product.name}</h3>
                <span
                  className={`shrink-0 rounded-full border-2 border-cacao px-2 py-0.5 text-xs font-bold ${
                    product.active ? 'bg-sage text-cream' : 'bg-beige text-cacao'
                  }`}
                >
                  {product.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <p className="text-xl font-bold text-rose-deep">{brl.format(product.price)}</p>

              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-sm">Estoque: {product.stockQuantity}</span>
                <button
                  type="button"
                  aria-label={`Editar ${product.name}`}
                  className="rounded-lg border-2 border-cacao bg-beige p-2 shadow-cozy-sm transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cacao/40 p-4 backdrop-blur-sm">
          <ProductForm onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
        </div>
      )}
    </section>
  )
}
