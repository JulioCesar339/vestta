import { type Page, type Locator } from '@playwright/test'

export class CartPage {
  readonly page: Page
  readonly cartItems: Locator
  readonly totalAmount: Locator
  readonly checkoutButton: Locator
  readonly continueButton: Locator
  readonly emptyMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.cartItems = page.locator('[class*="item"]')
    this.totalAmount = page.locator('[class*="total"]').last()
    this.checkoutButton = page.getByRole('button', { name: 'Pagar' })
    this.continueButton = page.getByRole('button', { name: 'Seguir comprando' })
    this.emptyMessage = page.getByText('Tu carrito está vacío')
  }

  async navigateToCart() {
    await this.page.getByRole('button', { name: 'Carrito' }).click()
    await this.page.waitForURL(/cart/)
  }

  async goto() {
    await this.page.goto('/cart')
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count()
  }

  async removeItem(index: number) {
    const item = this.cartItems.nth(index)
    await item.getByRole('button', { name: 'Eliminar' }).click()
  }

  async clickCheckout() {
    await this.checkoutButton.click()
  }

  async getTotal(): Promise<string> {
    return this.totalAmount.innerText()
  }
}
