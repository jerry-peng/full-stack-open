import React from 'react'

const SearchFilter = ({newFilter, onFilterChange}) => {
	return (
		<div>
			<p>filter shown with</p>
			<input value={newFilter} onChange={onFilterChange}/>
		</div>
	)
}

export default SearchFilter
