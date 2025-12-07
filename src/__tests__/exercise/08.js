// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

// 🐨 create a simple function component that uses the useCounter hook
function Counter() {
  const {count, increment, decrement} = useCounter()
  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}

test('exposes the count and increment/decrement functions', async () => {
  render(<Counter />)
  const count = screen.getByText(/Count:/)
  const incrementButton = screen.getByText('Increment')
  const decrementButton = screen.getByText('Decrement')

  expect(count).toHaveTextContent('Count: 0')

  await userEvent.click(incrementButton)
  expect(count).toHaveTextContent('Count: 1')

  await userEvent.click(decrementButton)
  expect(count).toHaveTextContent('Count: 0')
})

/* eslint no-unused-vars:0 */
