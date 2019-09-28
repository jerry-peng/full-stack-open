import React from 'react'

const SearchFilter = ({newFilter, setNewFilter}) => {

	const handleFilterChange = (event) => {
		setNewFilter(event.target.value)
	}

	return (
		<div>
			<p>filter shown with</p>
			<input value={newFilter} onChange={handleFilterChange}/>
		</div>
	)
}

export default SearchFilter
