import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { CatalogPage } from '../pages/CatalogPage.js'

test.describe('Catálogo', () => {
  let loginPage: LoginPage
  let catalogPage: CatalogPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    catalogPage = new CatalogPage(page)

    await loginPage.goto()
    await loginPage.login('admin', 'password123')
    await page.waitForURL(/catalog/)
    await catalogPage.waitForProducts()
  })

  test('debe mostrar productos en el catálogo', async () => {
    const count = await catalogPage.getProductCount()
    expect(count).toBeGreaterThan(0)
  })

  test('debe filtrar productos por nombre', async () => {
    await catalogPage.search('Camiseta')
    const count = await catalogPage.getProductCount()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThan(10)
  })

  test('debe mostrar cero productos con búsqueda sin resultados', async () => {
    await catalogPage.search('xyzproductoquenoexiste')
    const count = await catalogPage.getProductCount()
    expect(count).toBe(0)
  })

  test('debe mostrar todos los productos al limpiar búsqueda', async () => {
    await catalogPage.search('Camiseta')
    await catalogPage.clearSearch()
    const count = await catalogPage.getProductCount()
    expect(count).toBe(10)
  })

  test('debe mostrar badge en navbar al añadir producto', async () => {
    await catalogPage.addToCart(0, 1)
    await expect(catalogPage.cartBadge).toBeVisible()
    const badge = await catalogPage.getCartBadgeCount()
    expect(Number(badge)).toBeGreaterThan(0)
  })

  test('debe navegar a la vista de detalle al hacer click en Ver más', async ({ page }) => {
    await catalogPage.clickViewMore(0)
    await expect(page).toHaveURL(/product\/\d+/)
  })
})
