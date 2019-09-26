import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const getRandomAnec = () => {
  const max = anecdotes.length
  return Math.floor(Math.random() * Math.floor(max));
}

const MostVote = ({points}) => {
  const index = points.indexOf(Math.max(...points))
  return (
    <div>
      <p>{anecdotes[index]}</p>
      <p>has {points[index]} votes</p>
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(getRandomAnec())
  const [points, setPoints] = useState(anecdotes.map(v => 0))

  const vote = (selected) => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>
        {props.anecdotes[selected]}
      </div>
      <div>
        <button onClick={() => vote(selected)}>vote</button>
        <button onClick={() => setSelected(getRandomAnec())}>next anecdote</button>
      </div>
      <h1>Anecdote with most votes</h1>
      <MostVote points={points} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
