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
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('test_username')
      await page.getByLabel('password').fill('test_password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('testName logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByPlaceholder('write title here').fill('Test_title')
      await page.getByPlaceholder('write author here').fill('Test_author')
      await page.getByPlaceholder('write url here').fill('test_url.com')
      await page.getByRole('button', { name: 'create', exact: true }).click()

      const blogSummary = page.locator('.blog-summary')
      await expect(blogSummary).toContainText('Test_title')
      await expect(blogSummary).toContainText('Test_author')
  })
    describe('and a blog exists', () => {
        beforeEach(async ({ page }) => {
          await page.getByRole('button', { name: 'new blog' }).click()
          await page.getByPlaceholder('write title here').fill('Blog to be liked')
          await page.getByPlaceholder('write author here').fill('test_author')
          await page.getByPlaceholder('write url here').fill('test_url.com')
          await page.getByRole('button', { name: 'create', exact: true }).click()
          await expect(page.locator('.blog-summary')).toContainText('Blog to be liked')
        })

        test('a blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()

          const likes = page.locator('.blog-likes')
          await expect(likes).toContainText('0')

          await page.getByRole('button', { name: 'like' }).click()
          await expect(likes).toContainText('1')
        })
        test('the user who added the blog can delete it', async ({ page }) => {
          page.on('dialog', async (dialog) => {
            expect(dialog.type()).toBe('confirm')
            expect(dialog.message()).toContain('Remove blog "Blog to be liked" by test_author?')
            await dialog.accept()
          })

          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'delete' }).click()

          await expect(
            page.locator('.blog-summary').filter({ hasText: 'Blog to be liked' })
          ).toHaveCount(0)
        })
        test('only the user who added the blog sees the delete button', async ({ page, request }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

          await request.post('http://localhost:3003/api/users', {
            data: {
              name: 'otherName',
              username: 'other_username',
              password: 'other_password',
            },
          })

          await page.getByRole('button', { name: 'logout' }).click()
          await page.getByLabel('username').fill('other_username')
          await page.getByLabel('password').fill('other_password')
          await page.getByRole('button', { name: 'login' }).click()
          await expect(page.getByText('otherName logged in')).toBeVisible()

          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
        })
      })
  
})
})
