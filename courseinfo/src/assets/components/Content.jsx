import React from 'react'
import Part from './Part'

const Content = ({ courses }) => {
  return (
    <>
      {courses.parts.map(partes => <Part part={partes} key={partes.id} />)}
    </>
  )
}

export default Content
