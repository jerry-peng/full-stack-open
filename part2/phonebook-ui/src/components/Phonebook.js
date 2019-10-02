import React from 'react'
import personsService from '../services/persons'

const Phonebook = ({persons, newFilter, setPersons, setErrorMessage}) => {
  const handleRemovePerson = id => () => {
    const name = persons.find(v => v.id === id).name
    if (window.confirm(`Delete ${name}`))
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(v => v.id !== id))
        })
        .catch(err => {
          const errorMessage = `Information of ${name} has already been removed from server`
          setErrorMessage(errorMessage)
          setTimeout(() => {
            setErrorMessage(null) 
          }, 5000)
          setPersons(persons.filter(v => v.id !== id))
        })
  }

	const filterName = (v) => {
		return v.name.toLowerCase().includes(newFilter.toLowerCase())
	}

  return (
    <div>
      {persons.filter(filterName).map(v => {
        return (
          <p key={v.name}>
            {v.name} {v.number}
            <span><button onClick={handleRemovePerson(v.id)}>delete</button></span>
          </p>
        )
      })}
    </div>
  )
}

export default Phonebook
