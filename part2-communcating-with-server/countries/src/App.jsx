import axios from 'axios'
import { useState, useEffect } from 'react'
import Country from './Country'

const App = () => {
  const [listOfCountryNames, setListOfCountryNames] = useState([])
  const [countryNamesToShow, setCountryNamesToShow] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  const allUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  const countryBaseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/'

  
  useEffect( () => {
    const request = axios.get(allUrl)
    .then(response => {
      setListOfCountryNames(response.data.map(country => country.name.common))
    }).catch(error => console.log(error))
    }
  , [])

  const getOneCountry = (countryName) => {
    axios.get(countryBaseUrl+countryName).then(response => setSelectedCountry(response.data)).catch(error => console.log(error))
  }
  



  const handleSubmit = (e) => {
    e.preventDefault()    
  }

  const handleSearchBar = (e) => {
    const filteredCountries = listOfCountryNames.filter(countryName => countryName.toLowerCase().includes(e.target.value.toLowerCase()))
    setCountryNamesToShow(filteredCountries)

    if (countryNamesToShow.length === 1) {
      getOneCountry(countryNamesToShow[0])
    }
    else setSelectedCountry(null)
  }
  const handleShow = (e) => {
    getOneCountry(e.target.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        Find countries: <input type="text" onChange={handleSearchBar}/>
      </form>
      {selectedCountry ? 
      <Country selectedCountry={selectedCountry}/>:

      countryNamesToShow.length < 10 ?
        countryNamesToShow.map(countryName => <li key={countryName}>{countryName} <button value={countryName} onClick={handleShow}>Show</button></li>) 
        :<div>Too many countries, sepecify some more</div>}
      
      
    </div>
  )
}

export default App