import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'

test.describe('Autenticación', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('debe mostrar el formulario de login', async ({ page }) => {
    await expect(page).toHaveTitle(/Vestta|frontend/i)
    await expect(loginPage.usernameInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.submitButton).toBeVisible()
  })

  test('debe mostrar error con campos vacíos', async () => {
    await loginPage.submitButton.click()
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.errorMessage).toContainText('completa todos los campos')
  })

  test('debe mostrar error con credenciales incorrectas', async () => {
    await loginPage.login('admin', 'wrongpassword')
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 8000 })
    await expect(loginPage.errorMessage).toContainText('incorrectos')
  })

  test('debe redirigir al catálogo con credenciales correctas', async ({ page }) => {
    await loginPage.login('admin', 'password123')
    await expect(page).toHaveURL(/catalog/)
  })

  test('no debe acceder al catálogo sin autenticación', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page).toHaveURL('/')
  })
})
