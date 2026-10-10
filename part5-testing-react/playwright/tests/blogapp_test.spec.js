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
      await page.getByRole('link', { name: 'create new' }).click()

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
          await page.getByRole('link', { name: 'create new' }).click()
          await page.getByPlaceholder('write title here').fill('Blog to be liked')
          await page.getByPlaceholder('write author here').fill('test_author')
          await page.getByPlaceholder('write url here').fill('test_url.com')
          await page.getByRole('button', { name: 'create', exact: true }).click()
          await expect(page.locator('.blog-summary')).toContainText('Blog to be liked')
        })

        test('a blog can be liked', async ({ page }) => {
          await page.getByRole('link', { name: 'Blog to be liked' }).click()

          const likes = page.locator('.blog-likes')
          await expect(likes).toContainText('0 likes')

          await page.getByRole('button', { name: 'like' }).click()
          await expect(likes).toContainText('1 likes')
        })
        test('the user who added the blog can delete it', async ({ page }) => {
          page.on('dialog', async (dialog) => {
            expect(dialog.type()).toBe('confirm')
            expect(dialog.message()).toContain('Remove blog "Blog to be liked" by test_author?')
            await dialog.accept()
          })

          await page.getByRole('link', { name: 'Blog to be liked' }).click()
          await page.getByRole('button', { name: 'delete' }).click()

          await expect(
            page.locator('.blog-summary').filter({ hasText: 'Blog to be liked' })
          ).toHaveCount(0)
        })
        test('only the user who added the blog sees the delete button', async ({ page, request }) => {
          await page.getByRole('link', { name: 'Blog to be liked' }).click()
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

          await page.getByRole('link', { name: 'blogs', exact: true }).click()
          await page.getByRole('link', { name: 'Blog to be liked' }).click()
          await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
        })
      })
      describe('and several blogs exist', () => {
      beforeEach(async ({ page, request }) => {
        const loginResponse = await request.post('http://localhost:3003/api/login', {
          data: { username: 'test_username', password: 'test_password' },
        })
        const { token } = await loginResponse.json()

        const blogs = [
          { title: 'Blog with one like', author: 'Author A', url: 'a.com' },
          { title: 'Blog with three likes', author: 'Author B', url: 'b.com' },
          { title: 'Blog with two likes', author: 'Author C', url: 'c.com' },
        ]

        for (const blog of blogs) {
          await request.post('http://localhost:3003/api/blogs', {
            data: blog,
            headers: { Authorization: `Bearer ${token}` },
          })
        }

        await page.reload()
        await expect(page.locator('.blog-summary')).toHaveCount(3)
      })

      test('blogs are ordered by likes, most liked first', async ({ page }) => {
        test.setTimeout(10000)

        const likeBlog = async (title, times) => {
          await page.getByRole('link', { name: title }).click()

          const likes = page.locator('.blog-likes')
          for (let i = 1; i <= times; i++) {
            await page.getByRole('button', { name: 'like' }).click()
            await expect(likes).toContainText(`${i} likes`)
          }

          await page.getByRole('link', { name: 'blogs', exact: true }).click()
        }

        await likeBlog('Blog with one like', 1)
        await likeBlog('Blog with three likes', 3)
        await likeBlog('Blog with two likes', 2)

        await expect(page.locator('.blog-summary')).toHaveText([
          /Blog with three likes/,
          /Blog with two likes/,
          /Blog with one like/,
        ])
      })
    })
})  
})