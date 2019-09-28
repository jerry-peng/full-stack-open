import React, { useState, useEffect } from 'react'
import axios from 'axios'
import SearchFilter from './components/SearchFilter'
import PersonForm from './components/PersonForm'
import Phonebook from './components/Phonebook'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  const fetchPersons = () => {
    axios.get('http://localhost:3001/persons') 
      .then((res) => {
        setPersons(res.data) 
      })
  }
  
  useEffect(fetchPersons, [])

  return (
    <div>
      <h2>Phonebook</h2>
			<SearchFilter
				setNewFilter={setNewFilter}
				newFilter={newFilter}/>
			<h2>Add new numbers</h2>
			<PersonForm
        persons={persons}
				newName={newName}
        newNumber={newNumber}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <Phonebook persons={persons} newFilter={newFilter}/>
    </div>
  )
}

export default App
