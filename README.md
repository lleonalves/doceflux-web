# 🍰 DoceFlux Web

Frontend do sistema de gestão para a confeitaria Kédoce. Uma aplicação construída para ser a interface de operação local, focada em gestão de pedidos, catálogo de produtos e fluxo de caixa, consumindo a API real em Java Spring Boot.

## 🛠️ Stack Tecnológica

O projeto foi estruturado com foco em escalabilidade, arquitetura defensiva e tipagem estrita:
- **React 18** + **Vite**
- **TypeScript** (Interfaces mapeadas estritamente a partir do Swagger/OpenAPI do backend)
- **Tailwind CSS v4** (Variáveis CSS customizadas e Design System próprio)
- **TanStack React Query** (Gestão inteligente de estado do servidor, cache e refetch)
- **Axios** (Comunicação HTTP com interceptação de JWT)

## 🎨 Design System: "Cozy"

A interface não utiliza bibliotecas de componentes genéricas. A identidade visual foi desenhada do zero com a estética "Cozy", caracterizada por:
- Paleta de cores acolhedora (creme, rosê escuro, marrom).
- Sombras 2D sólidas (`--shadow-cozy`).
- Bordas espessas e cantos arredondados, evitando o aspecto frio de sistemas ERP tradicionais.

## 📂 Arquitetura (Feature-Sliced Design)

O código está organizado por módulos de negócio (Features), evitando o acoplamento excessivo:

src/
├── config/        # Configurações globais (Axios, React Query)
├── features/
│   ├── orders/    # Módulo de Pedidos (Páginas, Tipos, Serviços)
│   └── products/  # Módulo de Produtos (Catálogo, Filtros locais)
├── layouts/       # Estruturas de tela (Sidebar, Header fixo)
└── index.css      # Variáveis raiz do Tailwind v4

## ⚙️ Como Executar o Projeto

A interface **depende** do backend para funcionar corretamente. Não inicie o frontend sem a API no ar.

**1. Requisitos Prévios:**
- Backend **DoceFlux API** (Spring Boot) a rodar localmente na porta `8080`.
- PostgreSQL ativo com as credenciais configuradas na API.

**2. Instalação e Execução:**
```bash
# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
npm run dev
