// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {renderHook, act} from '@testing-library/react'
import useCounter from '../../components/use-counter'

test('exposes the count and increment/decrement functions', async () => {
  const {result} = renderHook(() => useCounter())
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('allows customization of the initial count', async () => {
  const {result} = renderHook(() => useCounter({initialCount: 2}))
  expect(result.current.count).toBe(2)
  act(() => result.current.increment())
  expect(result.current.count).toBe(3)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(2)
})

test('allows customization of the step', async () => {
  const {result, rerender} = renderHook(() =>
    useCounter({initialCount: 3, step: 2}),
  )
  expect(result.current.count).toBe(3)
  act(() => result.current.increment())
  expect(result.current.count).toBe(5)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(3)
})

// test('allows step to change', async () => {
//   const {result, rerender} = renderHook(() =>
//     useCounter({initialCount: 3, step: 2}),
//   )
//   expect(result.current.count).toBe(3)
//   act(() => result.current.increment())
//   expect(result.current.count).toBe(5)
//   rerender({step: 1})
//   act(() => result.current.decrement())
//   expect(result.current.count).toBe(4)
// })
/* eslint no-unused-vars:0 */
