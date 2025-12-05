// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'
import {build, fake} from '@jackfranklin/test-data-bot'

// Creating a test data builder for login form
// to generate realistic username and password
// you can use now https://github.com/Stivooo/mimicry-js
// @jackfranklin/test-data-bot is not maintained anymore
const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})
// function buildLoginForm(overrides) {
//   return {
//     username: faker.internet.userName(),
//     password: faker.internet.password(),
//     ...overrides, // allows us to override defaults like buildLoginForm({username: 'yagnesh'})
//   }
// }
test('submitting the form calls onSubmit with username and password', async () => {
  //mocking function using jest
  const handleSubmit = jest.fn()

  render(<Login onSubmit={handleSubmit} />)

  const usernameField = screen.getByLabelText(/username/i)
  const passwordField = screen.getByLabelText(/password/i)
  const {username, password} = buildLoginForm()
  await userEvent.type(usernameField, username)
  await userEvent.type(passwordField, password)
  const submitButton = screen.getByRole('button', {name: /submit/i})
  await userEvent.click(submitButton)

  expect(handleSubmit).toHaveBeenCalledWith({
    username,
    password,
  })
  expect(handleSubmit).toHaveBeenCalledTimes(1)
  // 💰 use `toEqual` from Jest: 📜 https://jestjs.io/docs/en/expect#toequalvalue
})

/*
eslint
  no-unused-vars: "off",
*/

/**
 * My Learning Notes:
 *
 * - This exercise demonstrates how to test form submissions in React components using React Testing Library and Jest.
 * - The test simulates user interactions by typing into input fields and clicking the submit button.
 * - The `userEvent` library is used to mimic real user behavior more closely than the basic `fireEvent`.
 * - After submitting the form, the test checks that the `onSubmit` handler was called with the correct data.
 * - The `toEqual` matcher from Jest is used to compare objects for deep equality.
 * - screen.debug() can be used to print the current state of the DOM for debugging purposes.
 * - kent used crome extension for selecting the elements
 */
