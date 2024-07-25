import React from 'react'
import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = ({ courses }) => {
  return (
    <>
      <h1>Web development curriculum</h1>
      <Header courses={courses[0]} />
      <Content courses={courses[0]} />
      <Total parts={courses[0].parts} />
      <Header courses={courses[1]} />
      <Content courses={courses[1]} />
      <Total parts={courses[1].parts} />
    </>
  )
}

export default Course
