import React, { useEffect } from 'react'
import axios from 'axios'

const Country = ({country}) => {
  const flagAltText = `${country.name} flag`

  const fetchWeather = () => {
    axios.get(('http://api.weatherstack.com/current') => {
    })
  }

  useEffect(fetchWeather, [])
  return (
    <div>
      {country &&
        <>
          <h1>{country.name}</h1> 
          <p>capital {country.capital}</p>
          <p>population {country.population}</p>
          <h2>languages</h2>
          <ul>
            {country.languages.map(v => {
              return <li key={v.name}>{v.name}</li> 
            })}
          </ul>
          <img className="flags" src={country.flag} alt={flagAltText}/>
        </>
      }
    </div>
  )
}

export default Country
