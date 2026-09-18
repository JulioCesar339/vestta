# Vestta — QA Automation Portfolio

Aplicación de venta de ropa construida como proyecto de portafolio para demostrar habilidades de QA Automation en un entorno full-stack real.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + TypeScript strict |
| Backend | Node.js + Express + TypeScript strict |
| Base de datos | SQLite (node:sqlite nativo) |
| Autenticación | JWT + bcrypt |
| Estilos | CSS Modules |
| Estado global | Zustand |
| HTTP client | Axios |

## Herramientas de QA

| Herramienta | Propósito |
|-------------|-----------|
| Playwright | Tests E2E con Page Object Model |
| k6 | Tests de carga y rendimiento |
| Allure Report | Reportes visuales de tests |
| Supertest | Tests de API (en progreso) |
| TypeScript strict | Tipado estático en todos los tests |

## Calidad de código

| Herramienta | Propósito |
|-------------|-----------|
| ESLint v9 | Análisis estático de código |
| Husky | Git hooks pre-commit |
| lint-staged | ESLint solo en archivos modificados |
| pnpm workspaces | Monorepo con 3 sub-proyectos |
| GitHub Actions | CI/CD pipeline automático |

## Estructura del proyectovestta/
├── apps/
│ ├── frontend/ # React + Vite
│ └── backend/ # Express API
└── tests/
├── e2e/ # Playwright E2E tests
└── k6/ # Load tests  
## Estructura del proyecto

## Funcionalidades

- **Login** — autenticación con JWT, validación de formulario, mensajes de error
- **Catálogo** — listado de productos con buscador en tiempo real
- **Detalle de producto** — vista ampliada con descripción
- **Carrito** — añadir productos, eliminar, badge con contador
- **Checkout** — modal de pago con validación de tarjeta
- **Stock en tiempo real** — se actualiza al completar una compra

## Tests E2E — Playwright

19 tests automatizados organizados por flujo:

- `auth.spec.ts` — login, validación, redirección, protección de rutas
- `catalog.spec.ts` — listado, búsqueda, filtrado, badge del carrito
- `checkout.spec.ts` — carrito, modal de pago, flujo completo de compra

### Correr los tests

```bash
# Instalar dependencias
pnpm install

# Arrancar el backend
cd apps/backend && pnpm seed && pnpm dev

# Arrancar el frontend (otra terminal)
cd apps/frontend && pnpm dev

# Correr los tests E2E (otra terminal)
cd tests/e2e && pnpm test

# Ver reporte de Playwright
cd tests/e2e && pnpm report:pw

# Generar y ver reporte de Allure (requiere Java)
cd tests/e2e && pnpm report:allure
```

## Tests de carga — k6

3 scripts de carga para los endpoints principales:

```bash
# Test de autenticación (5 usuarios simultáneos)
k6 run tests/k6/auth.load.js

# Test de productos (10 usuarios simultáneos)
k6 run tests/k6/products.load.js

# Test de checkout (3 usuarios simultáneos)
k6 run tests/k6/checkout.load.js
```

### Resultados de carga

| Endpoint | p(95) | Umbral | Resultado |
|----------|-------|--------|-----------|
| POST /api/auth/login | 1.21s | < 2s | ✅ |
| GET /api/products | 6.39ms | < 500ms | ✅ |
| POST /api/cart/checkout | 221ms | < 3s | ✅ |

## CI/CD — GitHub Actions

El pipeline corre automáticamente en cada push a `main`:

1. Lint con ESLint
2. Typecheck con TypeScript
3. Tests E2E con Playwright
4. Publicación de reportes como artifacts

## Credenciales de prueba
Usuario: admin
Contraseña: password123
## Autor

— QA Automation Engineer  
GitHub: [@JulioCesar339](https://github.com/JulioCesar339)
