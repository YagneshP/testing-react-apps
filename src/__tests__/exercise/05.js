// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import Login from '../../components/login-submission'
import {handlers} from '../../test/server-handlers'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

// 🐨 get the server setup with an async function to handle the login POST request:
// 💰 here's something to get you started

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  // 🐨 uncomment this and you'll start making the request!
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  // screen.debug()
  expect(screen.getByText(username)).toBeInTheDocument()
})
test(`error when password not provided`, async () => {
  render(<Login />)
  const {username} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  // screen.debug()
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})
test(`error when username not provided`, async () => {
  render(<Login />)
  const {password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  // screen.debug()
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"username required"`,
  )
})

test(`error when server is down`, async () => {
  const testErrorMessage = 'oops!something went wrong '
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: testErrorMessage}))
      },
    ),
  )
  render(<Login />)

  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  // screen.debug()
  expect(screen.getByRole('alert').toHaveTextContent(testErrorMessage))
})

/**
 * My Notes:
 *
 * 1. server.use(...) is used to override existing request handlers in MSW (Mock Service Worker) during tests. This allows you to simulate different server responses without changing the original handlers.
 *
 * 2. In the provided code snippet, server.use(...) is employed to create a custom handler for the login POST request that simulates a server error (HTTP 500 status) with a specific error message. This is useful for testing how the application handles server errors during login attempts.
 *
 * 3.server.resetHandlers() is a method in MSW that resets all request handlers to their original state. This is particularly useful in testing scenarios where you want to ensure that any modifications made to the handlers during a test do not affect subsequent tests.
 * 4. if you move server failing test above other tests then those tests will also fail because the server will continue to use the overridden handler until resetHandlers() is called in afterEach.
 */
