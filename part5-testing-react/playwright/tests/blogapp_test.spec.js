const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {

    beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testName',
        username: 'test_username',
        password: 'test_password',
      },
    })

    await page.goto('http://localhost:5173')
  }) 

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('test_username')
      await page.getByLabel('password').fill('test_password')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('testName logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('test_username')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByText('testName logged in')).not.toBeVisible()
    })
  })
})
