import React from 'react'

const Filter = ({newFilter, onChange}) => {
  return (
    <div>
      find countries
      <input value={newFilter} onChange={onChange} />
    </div>
  )
}

export default Filter
