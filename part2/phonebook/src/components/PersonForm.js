import React from 'react'

const PersonForm = ({persons, newName, newNumber, setPersons, setNewName,
  setNewNumber}) => {

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
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
		<form onSubmit={addPerson}>
			<div>
				name: <input value={newName} onChange={handleNameChange}/>
			</div>
			<div>
				number: <input value={newNumber} onChange={handleNumberChange}/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

export default PersonForm
