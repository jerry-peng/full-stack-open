import React from 'react'
import personsService from '../services/persons'

const PersonForm = ({persons, newName, newNumber, setPersons, setNewName,
  setNewNumber, setConfirmMessage, setErrorMessage}) => {

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleNotification = (setMessage, message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null) 
    }, 5000)
  }

  const addPerson = event => {
    event.preventDefault()
		const personObject = {
			name: newName,
			number: newNumber
		}

      /*if (!formIsValid()) {
      return
    }*/

    const confirmText = `${newName} is already added to phonebook, ` + 
        `replace the old number with a new one?`

    if (persons.map(v => v.name).includes(newName) && window.confirm(confirmText)) {
      personsService
        .update(persons.find(v => v.name === newName).id, personObject)
        .then(updatedPerson => {
          setPersons(persons.map(v => v.id === updatedPerson.id ? updatedPerson : v))
          const successMessage = `Updated ${personObject.name}'s number to ${personObject.number}`
          handleNotification(setConfirmMessage, successMessage)
        })
        .catch(err => {
          const name = personObject.name
          const errorMessage = `Information of ${name} has already been removed from server, creating new information instead`
          setErrorMessage(errorMessage)
          setTimeout(() => {
            setErrorMessage(null) 
          }, 5000)

          personsService
            .create(personObject) 
            .then(newPerson => {
              setPersons(persons.filter(v => v.name !== newName).concat(newPerson))
            })
            .catch(error => {
              console.log(error.response.data)     
            })
        })
        .finally(() => {
          setNewName('')
          setNewNumber('')
        })

    } 
    else {
      personsService
        .create(personObject) 
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          const successMessage = `Added ${personObject.name}`
          handleNotification(setConfirmMessage, successMessage)
        })
        .catch(error => {
          handleNotification(setErrorMessage, error.response.data.error)
        })
        .finally(() => {
          setNewName('')
          setNewNumber('')
        })
    }
  }

	const formIsValid = () => {
		let valid = true
		let alertText = ''

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
