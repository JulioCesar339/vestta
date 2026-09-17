import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { CatalogPage } from '../pages/CatalogPage.js'
import { CartPage } from '../pages/CartPage.js'
import { PaymentModal } from '../pages/PaymentModal.js'

test.describe('Checkout', () => {
  let loginPage: LoginPage
  let catalogPage: CatalogPage
  let cartPage: CartPage
  let paymentModal: PaymentModal

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    catalogPage = new CatalogPage(page)
    cartPage = new CartPage(page)
    paymentModal = new PaymentModal(page)

    await loginPage.goto()
    await loginPage.login('admin', 'password123')
    await page.waitForURL(/catalog/)
  })

  test('debe mostrar carrito vacío al ingresar sin productos', async () => {
    await cartPage.navigateToCart()
    await expect(cartPage.emptyMessage).toBeVisible()
  })

  test('debe mostrar productos añadidos en el carrito', async () => {
    await catalogPage.addToCart(0, 1)
    await cartPage.navigateToCart()
    const count = await cartPage.getItemCount()
    expect(count).toBeGreaterThan(0)
  })

  test('debe eliminar producto del carrito', async () => {
    await catalogPage.addToCart(0, 1)
    await cartPage.navigateToCart()
    await cartPage.removeItem(0)
    await expect(cartPage.emptyMessage).toBeVisible()
  })

  test('debe abrir modal de pago al hacer click en Pagar', async ({ page }) => {
    await catalogPage.addToCart(0, 1)
    await cartPage.navigateToCart()
    await cartPage.clickCheckout()
    await expect(page.getByText('Datos de pago')).toBeVisible()
  })

  test('debe mostrar errores con campos de tarjeta vacíos', async ({ page }) => {
    await catalogPage.addToCart(0, 1)
    await cartPage.navigateToCart()
    await cartPage.clickCheckout()
    await paymentModal.confirm()
    await expect(page.getByText('Número de tarjeta inválido')).toBeVisible()
  })

  test('debe completar el pago con datos válidos', async () => {
    await catalogPage.addToCart(0, 1)
    await cartPage.navigateToCart()
    await cartPage.clickCheckout()
    await paymentModal.fillCard(
      '1234567890123456',
      'Admin Vestta',
      '12/26',
      '123'
    )
    await paymentModal.confirm()
    const success = await paymentModal.isSuccessVisible()
    expect(success).toBe(true)
  })

  test('debe regresar al catálogo después del pago exitoso', async ({ page }) => {
    await catalogPage.addToCart(0, 1)
    await cartPage.navigateToCart()
    await cartPage.clickCheckout()
    await paymentModal.fillCard(
      '1234567890123456',
      'Admin Vestta',
      '12/26',
      '123'
    )
    await paymentModal.confirm()
    await page.waitForURL(/catalog/, { timeout: 5000 })
    await expect(page).toHaveURL(/catalog/)
  })

  test('debe vaciar el carrito después del pago', async ({ page }) => {
    await catalogPage.addToCart(0, 1)
    await cartPage.navigateToCart()
    await cartPage.clickCheckout()
    await paymentModal.fillCard(
      '1234567890123456',
      'Admin Vestta',
      '12/26',
      '123'
    )
    await paymentModal.confirm()
    await page.waitForURL(/catalog/, { timeout: 5000 })
    await cartPage.navigateToCart()
    await expect(cartPage.emptyMessage).toBeVisible()
  })
})
