import React from 'react'

const Total = ({ parts }) => {
  const total = parts.reduce((acc, curr) => acc + curr.exercises, 0)

  return (
    <strong>total of {total} exercises</strong>
  )
}

export default Total
