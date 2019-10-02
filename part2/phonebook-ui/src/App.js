import React, { useState, useEffect } from 'react'
import SearchFilter from './components/SearchFilter'
import PersonForm from './components/PersonForm'
import Phonebook from './components/Phonebook'
import personsService from './services/persons'
import { ConfirmNotification, ErrorNotification } from './components/Notification'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ confirmMessage, setConfirmMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  const fetchPersons = () => {
    personsService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }
  
  useEffect(fetchPersons, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <ConfirmNotification message={confirmMessage} />
      <ErrorNotification message={errorMessage} /> 
			<SearchFilter
				setNewFilter={setNewFilter}
				newFilter={newFilter} />
			<h2>Add new numbers</h2>
			<PersonForm
        persons={persons}
				newName={newName}
        newNumber={newNumber}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        setConfirmMessage={setConfirmMessage}
        setErrorMessage={setErrorMessage} />
      <h2>Numbers</h2>
      <Phonebook
        persons={persons}
        newFilter={newFilter}
        setPersons={setPersons}
        setErrorMessage={setErrorMessage} />
    </div>
  )
}

export default App
