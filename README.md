# Vestta — QA Automation Portfolio

[![CI](https://github.com/JulioCesar339/vestta/actions/workflows/ci.yml/badge.svg)](https://github.com/JulioCesar339/vestta/actions/workflows/ci.yml)
![Playwright](https://img.shields.io/badge/Playwright-19%2F19-brightgreen)
![Vitest](https://img.shields.io/badge/Vitest-22%2F22-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![k6](https://img.shields.io/badge/k6-load%20tested-violet)

Aplicación de venta de ropa construida como proyecto de portafolio para demostrar habilidades de **QA Automation** en un entorno full-stack real con arquitectura de microservicios.

---

## ¿Qué demuestra este proyecto?

Este proyecto demuestra experiencia práctica en:

- Automatización E2E con Playwright y Page Object Model.
- Pruebas de API con Supertest y Vitest.
- Pruebas de carga y rendimiento con k6.
- Automatización del pipeline de calidad mediante CI/CD con GitHub Actions.
- Detección, análisis, corrección y regresión de defectos.
- Validación de integridad de datos mediante SQLite.
- Desarrollo de pruebas con TypeScript strict mode.
- Generación de reportes de ejecución con Allure y Playwright.
- Arquitectura de microservicios (NestJS + Go).

---

## Arquitectura

```text
Frontend (React)
      ↓
Backend NestJS (productos, carrito, órdenes)
      ↓
Microservicio Auth Go (login, validación JWT)
      ↓
SQLite
```

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19 + Vite + TypeScript strict |
| Backend principal | NestJS + TypeScript strict |
| Backend original | Express + TypeScript strict |
| Microservicio Auth | Go + net/http |
| Base de datos | SQLite (`node:sqlite` nativo) |
| Autenticación | JWT + bcrypt |
| Estilos | CSS Modules |
| Estado global | Zustand |
| HTTP Client | Axios |

## Herramientas de QA

| Herramienta | Propósito |
| --- | --- |
| Playwright | Tests E2E con Page Object Model |
| k6 | Tests de carga y rendimiento |
| Allure Report | Reportes visuales de tests |
| Supertest | Tests de API |
| Vitest | Runner de tests unitarios y de API |
| TypeScript strict | Tipado estático en todos los tests |

## Calidad de código

| Herramienta | Propósito |
| --- | --- |
| ESLint v9 | Análisis estático de código |
| Husky | Git hooks pre-commit |
| lint-staged | Ejecución de ESLint en archivos modificados |
| pnpm workspaces | Gestión del monorepo |
| GitHub Actions | CI/CD y validaciones automáticas |

---

## Estructura del proyecto

```text
vestta/
├── apps/
│   ├── frontend/          # React + Vite
│   ├── backend/           # Express API + tests de API (Supertest)
│   ├── nestjs-backend/    # NestJS API (principal)
│   └── auth-service/      # Microservicio Auth en Go
├── tests/
│   ├── e2e/               # Playwright E2E tests
│   └── k6/                # Load & performance tests
├── .github/
│   └── workflows/         # GitHub Actions CI
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## Funcionalidades

* **Login** — autenticación con JWT via microservicio Go, validación de formulario y mensajes de error.
* **Catálogo** — listado de productos con búsqueda en tiempo real.
* **Detalle de producto** — visualización ampliada de la información del producto.
* **Carrito** — agregar productos, eliminar productos y contador de artículos.
* **Checkout** — modal de pago con validación de datos simulados y transacción atómica en SQLite.
* **Actualización de stock** — el stock disminuye correctamente después de completar una compra.

---

## Cobertura de pruebas

### Implementado y verificado

**Autenticación**
- Login exitoso.
- Credenciales incorrectas.
- Validación de campos obligatorios.
- Manejo de errores `401`.
- Protección de rutas sin token.

**Catálogo**
- Listado de productos.
- Búsqueda y filtrado en tiempo real.
- Consulta de producto por ID.
- Producto inexistente devuelve `404`.

**Carrito y Checkout**
- Agregar y eliminar productos del carrito.
- Validación de carrito vacío.
- Validación de `quantity` negativa, decimal y cero.
- Validación de stock insuficiente.
- Creación de órdenes con transacción atómica.
- Actualización de stock post-compra.
- Validación de datos de pago simulados.

**API**
- Validación de status codes.
- Autenticación mediante JWT.
- Casos positivos y negativos.
- Cálculo correcto de totales.

**Performance**
- Login, productos y checkout bajo carga controlada.

---

## Defectos encontrados

Durante el desarrollo y la ejecución de las pruebas se identificaron y corrigieron los siguientes defectos:

| ID | Defecto | Detectado por | Severidad | Corrección | Regresión |
| --- | --- | --- | --- | --- | --- |
| BUG-001 | Consulta de producto por ID devuelve 404 debido a dependencia de IDs dinámicos en los tests | Supertest | Alta | Tests actualizados para obtener IDs dinámicamente desde el setup | ✅ |
| BUG-002 | Checkout devuelve 404 con `productId: 1` después del seed por IDs regenerados | Supertest | Alta | Se corrigió la dependencia entre seed y datos usados por los tests | ✅ |
| BUG-003 | Interceptor 401 redirigía a `/` antes de que el mensaje de error fuera visible en el login | Playwright | Media | El interceptor ahora solo redirige cuando existe un token guardado (sesión expirada) | ✅ |
| BUG-004 | El carrito no persistía al navegar entre páginas mediante `goto()` | Playwright | Alta | Se corrigió la navegación para usar la navbar en lugar de `goto()`, preservando el estado | ✅ |
| BUG-005 | Selector de CVV ambiguo — `getByPlaceholder('123')` resolvía dos elementos | Playwright | Media | Selector actualizado a `getByRole('textbox', { name: 'CVV' })` con `htmlFor` en el label | ✅ |
| BUG-006 | El checkout no era atómico — una falla en un `INSERT` podía dejar la orden parcialmente creada | Revisión de código | Alta | Se implementó `BEGIN / COMMIT / ROLLBACK` para garantizar integridad transaccional | ✅ |
| BUG-007 | La API aceptaba `quantity` con valores negativos, decimales o cero sin error | Revisión de código | Media | Se agregaron validaciones explícitas: entero positivo mayor a 0 | ✅ |

**Resumen:**
- Defectos encontrados: 7
- Defectos corregidos: 7
- Defectos verificados por regresión: 7

---

## Tests E2E — Playwright

Organizados con **Page Object Model (POM)** y selectores semánticos (`role`, `label`, `data-testid`).

### Suites

* `auth.spec.ts` — login, validaciones, redirección y protección de rutas.
* `catalog.spec.ts` — listado, búsqueda, filtrado y carrito.
* `checkout.spec.ts` — carrito, modal de pago y flujo completo de compra.

### Ejecutar

```bash
# Seed de la base de datos
cd apps/backend && pnpm seed

# Terminal 1 — microservicio de auth
cd apps/auth-service && DB_PATH=../backend/vestta.db ./auth-service

# Terminal 2 — backend Express
cd apps/backend && pnpm dev

# Terminal 3 — frontend
cd apps/frontend && pnpm dev

# Terminal 4 — tests E2E
cd tests/e2e && pnpm test

# Reporte Playwright
cd tests/e2e && pnpm report:pw

# Reporte Allure (requiere Java)
cd tests/e2e && pnpm report:allure
```

---

## Tests de API — Supertest + Vitest

```bash
cd apps/backend && pnpm test
```

**Resultado:** 22/22 tests — 3 suites: `auth`, `products`, `cart`.

---

## Tests de carga — k6

```bash
k6 run tests/k6/auth.load.js
k6 run tests/k6/products.load.js
k6 run tests/k6/checkout.load.js
```

### Resultados

| Endpoint | VUs | Duración | p(95) | Error rate | Umbral | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| `POST /auth/login` | 5 | 40s | 1.21s | 0% | < 2s | ✅ |
| `GET /products` | 10 | 50s | 6.39ms | 0% | < 500ms | ✅ |
| `POST /cart/checkout` | 3 | 40s | 221ms | 0% | < 3s | ✅ |

> Resultados obtenidos en entorno local. No representan la capacidad máxima de producción.

---

## CI/CD — GitHub Actions

Pipeline ejecutado automáticamente en cada `push` a `main`:

1. ESLint
2. Typecheck
3. API Tests (Supertest + Vitest) — 22/22 ✅
4. E2E Tests (Playwright) — 19/19 ✅
5. Publicación de reportes como artifacts

---

## Microservicio de Auth — Go

| Endpoint | Método | Descripción |
| --- | --- | --- |
| `/auth/login` | POST | Genera token JWT |
| `/auth/validate` | GET | Valida token JWT |
| `/health` | GET | Health check |

Características:
- Graceful shutdown con `SIGTERM`.
- Timeouts configurados (`ReadTimeout`, `WriteTimeout`, `IdleTimeout`).
- CORS habilitado.

---

## Base de datos

SQLite mediante `node:sqlite` nativo de Node.js:

- `users`
- `products`
- `orders`
- `order_items`

El checkout usa **transacciones atómicas** (`BEGIN / COMMIT / ROLLBACK`) para garantizar la integridad de los datos ante cualquier fallo durante la operación.

---

## Credenciales de prueba

```text
Usuario: admin
Password: password123
```

> Exclusivamente para el entorno de prueba local.

---

## Autor

**Julio César Cabrera Hernández**

QA Automation Engineer

GitHub: [@JulioCesar339](https://github.com/JulioCesar339)
