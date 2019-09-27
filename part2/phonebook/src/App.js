import React, { useState } from 'react'

const Phonebook = ({persons}) => {
  return (
    <div>
      {persons.map(v => <p key={v.name}>{v.name}</p>)}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState(
    [
      { name: 'Arto Hellas' }
    ]
  ) 
  const [ newName, setNewName ] = useState('')

  const handleInputChange = (event) => {
    setNewName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(v => v.name).includes(newName)) {
      alert(`${newName} is already added to the phonebook`)
    }
    else {
      setPersons(persons.concat({ name: newName }))
      setNewName('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleInputChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Phonebook persons={persons} />
    </div>
  )
}

export default App
