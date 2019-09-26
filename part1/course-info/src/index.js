import React from 'react'
import ReactDOM from 'react-dom'

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exerCount}
    </p>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.names[0]} exerCount={props.exerCounts[0]} />
      <Part name={props.names[1]} exerCount={props.exerCounts[1]} />
      <Part name={props.names[2]} exerCount={props.exerCounts[2]} />
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const names = ['Fundamentals of React', 'Using props to pass data', 'State of a component']
  const exerCounts = [10, 7, 14]

  return (
    <div>
      <h1>{course}</h1>
      <Content names={names} exerCounts={exerCounts} />
      <p>Number of exercises {exerCounts.reduce((acc, val) => acc + val)}</p>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
