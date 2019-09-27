import React from 'react'

const Phonebook = ({persons, newFilter}) => {
	const filterName = (v) => {
		return v.name.toLowerCase().includes(newFilter.toLowerCase())
	}
  return (
    <div>
      {persons.filter(filterName).map(v => <p key={v.name}>{v.name} {v.number}</p>)}
    </div>
  )
}

export default Phonebook
