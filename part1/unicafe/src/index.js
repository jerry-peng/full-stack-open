import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const Button = ({onClick, value}) => {
  return (
    <button onClick={onClick}>{value}</button>
  )
}

const Statistic = ({text, value}) => {
  return (
    <tr>
    <td>{text}</td>
    <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const noFeedback = good === 0 && neutral === 0 && bad === 0
  if (noFeedback) {
    return (
      <p>No feedback given</p>
    )
  }

  const average = (good - bad) / (good + neutral + bad)
  const positive = good * 100 / (good + neutral + bad)
  return (
    <table>
      <Statistic text='good' value={good} />
      <Statistic text='neutral' value={neutral} />
      <Statistic text='bad' value={bad} />
      <Statistic text='average' value={average} />
      <Statistic text='positive' value={positive} />
    </table>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} value='good' />
      <Button onClick={() => setNeutral(neutral + 1)} value='neutral' />
      <Button onClick={() => setBad(bad + 1)} value='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
