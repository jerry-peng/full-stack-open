import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Filter from './components/Filter'
import CountryInfos from './components/CountryInfos'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')

  const initialShowCountry = { country: null }
  const [showCountry, setShowCountry] = useState(initialShowCountry)

  const fetchCountries = () => {
    axios.get('http://restcountries.eu/rest/v2/all')
      .then((res) => {
        setCountries(res.data)
      })
  }

  useEffect(fetchCountries, [])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value) 

    const filteredCountries = countries.filter(v => {
      return v.name.toLowerCase().includes(event.target.value.toLowerCase()) 
    })

		const numCountries = filteredCountries.length	

		if (numCountries === 1) {
			setShowCountry({ country: filteredCountries[0] })
		}
		else {
			setShowCountry({ country: null })
		}
  }

  return (
    <>
      <Filter
        newFilter={newFilter}
				onChange={handleFilterChange} />
      <CountryInfos
        countries={countries}
        newFilter={newFilter}
        setShowCountry={setShowCountry} />
			{showCountry.country !== null &&
				<Country country={showCountry.country} />
			}
    </>
  )
}

export default App
