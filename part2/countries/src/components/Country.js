import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Country = ({country}) => {
  const weatherstack_key = process.env.REACT_APP_WEATHERSTACK_API_KEY
  const flagAltText = `${country.name} flag`
  const weatherIconAltText = `${country.capital} weather`
	const [weather, setWeather] = useState({})

  const fetchWeather = () => {
    setWeather({})
    axios.get('http://api.weatherstack.com/current', {
        params: {
          access_key: weatherstack_key,
          query: country.capital
        } 
      })
      .then((res) => {
        console.log(res.data)
				setWeather(res.data)
      })
  }

  useEffect(fetchWeather, [country])
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
          {Object.entries(weather).length !== 0&&
            <>
              <h2>Weather in {country.capital}</h2>
              <p><b>Temperature: </b>{weather.current.temperature} Celsius</p>
              <img src={weather.current.weather_icons[0]} alt={weatherIconAltText} />
              <p><b>wind: </b>{weather.current.wind_speed} kph direction {weather.current.wind_dir}</p>
            </>
          }
        </>
      }
    </div>
  )
}

export default Country
