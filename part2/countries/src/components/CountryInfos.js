import React from 'react'

const CountryInfos = ({countries, newFilter, setShowCountry}) => {
  const filteredCountries = countries.filter(v => {
    return v.name.toLowerCase().includes(newFilter.toLowerCase()) 
  })

  const numCountries = filteredCountries.length

  const handleShowClick = (country) => () => {
    setShowCountry({ country: country })
  }

  if (numCountries > 10) {
      return (
        <>
          {newFilter.length !== 0 &&
            <p>Too many matches, specify another filter</p> 
          }
        </>
      )
  }
  else if (numCountries > 1 && numCountries <= 10) {
    return (
      <div>
        {filteredCountries.map(v=> {
          return (
            <p key={v.name}>
              {v.name}
              <span><button onClick={handleShowClick(v)}>
                show 
              </button></span>
            </p>
          )
        })} 
      </div>
    ) 
  }

  return null
}

export default CountryInfos
