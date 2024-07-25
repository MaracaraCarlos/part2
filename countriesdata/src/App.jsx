import axios from 'axios'
import { useEffect, useState } from 'react'

const API_COUNTRIES = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const API_KEY = import.meta.env.VITE_KEY_API
let urlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&lang=es`
const cityUrl = '&q='
const urlIcon = 'http://openweathermap.org/img/w/'

const Filter = ({ filteredCountries, SelectOneContry, getLocationWeather, weather }) => {
  return (
    <>
      {
        filteredCountries.length > 10
          ? (<p>Too many matches, specify another filter</p>)
          : filteredCountries.length === 1
            ? <ACountryShown
                filteredCountries={filteredCountries}
                getLocationWeather={getLocationWeather}
                weather={weather}
              />
            : <ListOfContries
                filteredCountries={filteredCountries}
                SelectOneContry={SelectOneContry}
              />
      }
    </>
  )
}

const ACountryShown = ({ filteredCountries, getLocationWeather, weather }) => {
  return (
    <>
      {
        filteredCountries.map(countries =>
          <div key={countries.name.common}>
            <p>capital: {countries.capital[0]}</p>
            <p>{countries.area}</p>
            <strong>languages:</strong>
            <ul>
              {Object.values(countries.languages).map(lan => <li key={lan}>{lan}</li>)}
            </ul>
            <img src={countries.flags.svg} alt={countries.flags.alt} height='80' />
            <h2>Weather in {countries.capital[0]}</h2>
            <button onClick={() => getLocationWeather(countries.capital[0])}>See weather</button>
            {
              weather &&
                <>
                  <p>temperature: {weather.main.temp}</p>
                  <img src={urlIcon + weather.weather[0].icon + '.png'} alt='icono' />
                  <p>wind: {weather.wind.speed} m/s</p>
                </>
            }
          </div>
        )
      }
    </>
  )
}

const ListOfContries = ({ filteredCountries, SelectOneContry }) => {
  return (
    <div>
      {
        filteredCountries.map(countries =>
          <p key={countries.name.common}>{countries.name.common} <button onClick={() => SelectOneContry(countries.name.common)}>show</button></p>
        )
      }
    </div>
  )
}

function App () {
  const [countries, setCountries] = useState()
  const [searchCountry, setSearchCountry] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState()

  useEffect(() => {
    console.log('effect')
    axios
      .get(API_COUNTRIES)
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      }).catch(error => {
        console.log('cannot find the API', error.message)
        window.alert('cannot find the API')
      })
  }, [])

  const handleSearchCountries = (e) => {
    setSearchCountry(e.target.value)

    const filterCountries = countries.filter(country =>
      country.name.common.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
    )
    setFilteredCountries(filterCountries)
  }

  const SelectOneContry = (name) => {
    const findCountry = filteredCountries.filter(country =>
      country.name.common === name
    )

    setFilteredCountries(findCountry)
    setSearchCountry('')
  }

  const getLocationWeather = (loc) => {
    setLocation(loc)

    urlWeather = urlWeather + cityUrl + loc

    axios
      .get(urlWeather)
      .then(response => {
        console.log('promise of weather fulfilled')
        setWeather(response.data)
      }).catch(error => {
        console.log('Cannot find the API Weather', error.message)
        window.alert('Cannot find the API Weather')
      })
  }

  return (
    <>
      <div>
        find countries {' '} <input value={searchCountry} onChange={handleSearchCountries} />
      </div>
      <Filter
        filteredCountries={filteredCountries}
        SelectOneContry={SelectOneContry}
        getLocationWeather={getLocationWeather}
        weather={weather}
      />
    </>
  )
}

export default App
