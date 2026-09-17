import { type Page, type Locator } from '@playwright/test'

export class PaymentModal {
  readonly page: Page
  readonly cardNumberInput: Locator
  readonly cardNameInput: Locator
  readonly expiryInput: Locator
  readonly cvvInput: Locator
  readonly confirmButton: Locator
  readonly cancelButton: Locator
  readonly successMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.cardNumberInput = page.getByRole('textbox', { name: 'Número de tarjeta' })
    this.cardNameInput = page.getByRole('textbox', { name: 'Nombre del titular' })
    this.expiryInput = page.getByRole('textbox', { name: 'Fecha de vencimiento' })
    this.cvvInput = page.getByRole('textbox', { name: 'CVV' })
    this.confirmButton = page.getByRole('button', { name: 'Confirmar pago' })
    this.cancelButton = page.getByRole('button', { name: 'Cancelar' })
    this.successMessage = page.getByText('¡Pago exitoso!')
  }

  async fillCard(
    number: string,
    name: string,
    expiry: string,
    cvv: string
  ) {
    await this.cardNumberInput.fill(number)
    await this.cardNameInput.fill(name)
    await this.expiryInput.fill(expiry)
    await this.cvvInput.fill(cvv)
  }

  async confirm() {
    await this.confirmButton.click()
  }

  async cancel() {
    await this.cancelButton.click()
  }

  async isSuccessVisible(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 5000 })
      return true
    } catch {
      return false
    }
  }
}
