// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'

test('submitting the form calls onSubmit with username and password', async () => {
  let submittedData

  const handleSubmit = data => (submittedData = data)

  render(<Login onSubmit={handleSubmit} />)

  const usernameField = screen.getByLabelText(/username/i)
  const passwordField = screen.getByLabelText(/password/i)
  const username = 'my-username'
  const password = 'my-password'
  await userEvent.type(usernameField, username)
  await userEvent.type(passwordField, password)
  const submitButton = screen.getByRole('button', {name: /submit/i})
  await userEvent.click(submitButton)

  expect(submittedData).toEqual({
    username,
    password,
  })
  // 💰 use `toEqual` from Jest: 📜 https://jestjs.io/docs/en/expect#toequalvalue
})

/*
eslint
  no-unused-vars: "off",
*/
