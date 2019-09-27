import React, { useState } from 'react'
import SearchFilter from './components/SearchFilter'
import PersonForm from './components/PersonForm'
import Phonebook from './components/Phonebook'

const App = () => {
  const [ persons, setPersons] = useState(
		[
			{ name: 'Arto Hellas', number: '040-123456' },
			{ name: 'Ada Lovelace', number: '39-44-5323523' },
			{ name: 'Dan Abramov', number: '12-43-234345' },
			{ name: 'Mary Poppendieck', number: '39-23-6423122' }
		]
  ) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

	const handleFilterChange = (event) => {
		setNewFilter(event.target.value)
	}

  const addPerson = (event) => {
    event.preventDefault()
		const personObject = {
			name: newName,
			number: newNumber
		}
		if (formIsValid()) {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

	const formIsValid = () => {
		let valid = true
		let alertText = ''

		if (persons.map(v => v.name).includes(newName)) {
			alertText += `${newName} is already added to the phonebook.\n`
			valid = false
		}
		if (newName === '') {
			alertText += 'Name field cannot be empty.\n'
			valid = false
		}
		if (newNumber === '') {
			alertText += 'Number field cannot be empty.\n'
			valid = false
		}

		if (!valid) {
			alert(alertText)
			return false
		}

		return true
	}

  return (
    <div>
      <h2>Phonebook</h2>
			<SearchFilter
				onFilterChange={handleFilterChange}
				newFilter={newFilter}/>
			<h2>Add new numbers</h2>
			<PersonForm
				onSubmit={addPerson}
				onNameChange={handleNameChange}
				onNumberChange={handleNumberChange}
				newName={newName}
				newNumber={newNumber} />
      <h2>Numbers</h2>
      <Phonebook persons={persons} newFilter={newFilter}/>
    </div>
  )
}

export default App
