import React from 'react'
import ReactDOM from 'react-dom'

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

const Courses = ({courses}) => {
	return (
		<div>
			{courses.map(v => <Course key={v.name} course={v} />)}
		</div>
	)
}

const App = () => {
	const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <>
      <h1>Web Development curriculum</h1>
      <Courses courses={courses} />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
