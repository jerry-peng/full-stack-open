import React from 'react'

const Header = ({course}) => <h2>{course.name}</h2>

const Part = (props) => <p>{props.name} {props.exercises}</p>

const Content = ({course}) => {
  return (
    <div>
			{course.parts.map(v => <Part key={v.id} name={v.name} exercises={v.exercises} />)}
    </div>
  )
}

const Total = ({course}) =>
	<p>
		Number of exercises {course.parts.map(v => v.exercises).reduce((acc, val) => acc + val)}
	</p>

const Course = ({course}) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default Course
