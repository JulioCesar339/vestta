# Vestta — QA Automation Portfolio

Aplicación de venta de ropa construida como proyecto de portafolio para demostrar habilidades de **QA Automation** en un entorno full-stack.

## Stack tecnológico

| Capa          | Tecnología                            |
| ------------- | ------------------------------------- |
| Frontend      | React 19 + Vite + TypeScript strict   |
| Backend       | Node.js + Express + TypeScript strict |
| Base de datos | SQLite (`node:sqlite` nativo)         |
| Autenticación | JWT + bcrypt                          |
| Estilos       | CSS Modules                           |
| Estado global | Zustand                               |
| HTTP Client   | Axios                                 |

## Herramientas de QA

| Herramienta       | Propósito                       |
| ----------------- | ------------------------------- |
| Playwright        | Tests E2E con Page Object Model |
| k6                | Tests de carga y rendimiento    |
| Allure Report     | Reportes visuales de tests      |
| Supertest         | Tests de API                    |
| TypeScript strict | Tipado estático en los tests    |

## Calidad de código

| Herramienta     | Propósito                                   |
| --------------- | ------------------------------------------- |
| ESLint v9       | Análisis estático de código                 |
| Husky           | Git hooks pre-commit                        |
| lint-staged     | Ejecución de ESLint en archivos modificados |
| pnpm workspaces | Gestión del monorepo                        |
| GitHub Actions  | CI/CD y validaciones automáticas            |

## Estructura del proyecto

```text
vestta/
├── apps/
│   ├── frontend/          # React + Vite
│   └── backend/           # Express API
├── tests/
│   ├── e2e/               # Playwright E2E tests
│   └── k6/                # Load & performance tests
├── .github/
│   └── workflows/         # GitHub Actions
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Funcionalidades

* **Login** — autenticación con JWT, validación de formulario y mensajes de error.
* **Catálogo** — listado de productos con búsqueda en tiempo real.
* **Detalle de producto** — visualización ampliada de la información del producto.
* **Carrito** — agregar productos, eliminar productos y contador de artículos.
* **Checkout** — modal de pago con validación de tarjeta.
* **Stock en tiempo real** — actualización del stock después de completar una compra.

## Cobertura de pruebas

### Autenticación

* Login exitoso.
* Credenciales incorrectas.
* Validación de campos obligatorios.
* Manejo de errores `401`.
* Protección de rutas.
* Persistencia de sesión.

### Catálogo

* Listado de productos.
* Búsqueda.
* Filtrado.
* Consulta del detalle de producto.
* Estado del stock.

### Checkout

* Agregar productos al carrito.
* Eliminar productos.
* Validación del carrito.
* Validación del pago.
* Creación de órdenes.
* Actualización del stock.

### API

* Validación de status codes.
* Autenticación mediante JWT.
* Validación de respuestas.
* Casos positivos y negativos.

### Performance

* Login.
* Consulta de productos.
* Checkout.

## Tests E2E — Playwright

Los tests E2E están organizados mediante **Page Object Model (POM)** y cubren los principales flujos funcionales de la aplicación.

### Suites

* `auth.spec.ts` — login, validaciones, redirección y protección de rutas.
* `catalog.spec.ts` — listado, búsqueda, filtrado y carrito.
* `checkout.spec.ts` — carrito, modal de pago y flujo completo de compra.

### Ejecutar los tests

Instalar dependencias:

```bash
pnpm install
```

Arrancar el backend:

```bash
cd apps/backend
pnpm seed
pnpm dev
```

En otra terminal, arrancar el frontend:

```bash
cd apps/frontend
pnpm dev
```

Ejecutar los tests E2E:

```bash
cd tests/e2e
pnpm test
```

Abrir el reporte de Playwright:

```bash
cd tests/e2e
pnpm report:pw
```

Abrir el reporte de Allure:

```bash
cd tests/e2e
pnpm report:allure
```

## Tests de carga — k6

Se utilizan scripts de k6 para validar el comportamiento de los principales endpoints bajo carga controlada.

```text
tests/k6/
├── auth.load.js
├── products.load.js
└── checkout.load.js
```

Escenarios configurados:

* `auth.load.js` — hasta 5 VUs.
* `products.load.js` — hasta 10 VUs.
* `checkout.load.js` — hasta 3 VUs.

### Resultados de carga

| Endpoint                  |  p(95) |  Umbral | Resultado |
| ------------------------- | -----: | ------: | --------- |
| `POST /api/auth/login`    |  1.21s |    < 2s | ✅         |
| `GET /api/products`       | 6.39ms | < 500ms | ✅         |
| `POST /api/cart/checkout` |  221ms |    < 3s | ✅         |

> **Nota:** Los resultados corresponden a ejecuciones realizadas en un entorno local y bajo los escenarios configurados. Estos valores no representan la capacidad máxima de producción.

## CI/CD — GitHub Actions

El pipeline ejecuta validaciones automáticas en cada `push` a `main`.

### Pipeline

1. ESLint
2. Typecheck
3. Playwright E2E
4. Generación y almacenamiento de reportes

El objetivo es detectar errores de calidad, tipado y regresiones funcionales antes de integrar cambios.

## Base de datos

La aplicación utiliza **SQLite** mediante el módulo nativo `node:sqlite` de Node.js.

El modelo incluye:

* `users`
* `products`
* `orders`
* `order_items`

La base de datos contiene datos de prueba utilizados por los tests automatizados.

## Credenciales de prueba

```text
Usuario: admin
Password: password123
```

> Estas credenciales son exclusivamente para el entorno de prueba local.

## Autor

**Julio César Cabrera Hernández**

QA Automation Engineer

GitHub: [@JulioCesar339](https://github.com/JulioCesar339)
