import { type Page, type Locator } from '@playwright/test'

export class CatalogPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly productCards: Locator
  readonly cartBadge: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.getByPlaceholder('Buscar productos...')
    this.productCards = page.locator('[data-testid="product-card"]')
    this.cartBadge = page.locator('[class*="badge"]')
  }

  async goto() {
    await this.page.goto('/catalog')
  }

  async waitForProducts() {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 8000 })
  }

  async search(text: string) {
    await this.searchInput.fill(text)
  }

  async clearSearch() {
    await this.searchInput.clear()
  }

  async addToCart(productIndex: number, quantity: number = 1) {
    const card = this.productCards.nth(productIndex)
    const qtyInput = card.locator('input[type="number"]')
    const addButton = card.getByRole('button', { name: 'Añadir' })
    await qtyInput.fill(String(quantity))
    await addButton.click()
  }

  async clickViewMore(productIndex: number) {
    const card = this.productCards.nth(productIndex)
    await card.getByRole('button', { name: 'Ver más' }).click()
  }

  async getProductName(productIndex: number): Promise<string> {
    const card = this.productCards.nth(productIndex)
    return card.locator('[class*="name"]').innerText()
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count()
  }

  async getCartBadgeCount(): Promise<string> {
    return this.cartBadge.innerText()
  }
}
