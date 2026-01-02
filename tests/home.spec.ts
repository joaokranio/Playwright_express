import { test, expect } from '@playwright/test'

test('Weapp deve estar online', async ({ page }) => {
    await page.goto('http://192.168.18.32:8080')
    await expect(page).toHaveTitle('Gerencie suas tarefas com Mark L')
})