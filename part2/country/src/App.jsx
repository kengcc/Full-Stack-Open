import {useState, useEffect} from "react"
import Filter from "./components/Filter"
import CountryList from "./components/CountryList"
import CountryDetails from "./components/CountryDetails"
import countryService from "./services/countries"

const api_key = import.meta.env.VITE_WEATHER_API_KEY

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    countryService.getAll().then((allCountries) => {
      setCountries(allCountries ?? [])
    })
  }, [])

  const handleShowCountry = (countryName) => {
    setFilter(countryName)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filtered = countries.filter((c) =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  let content = null

  if (filter.trim() === "") {
    content = null
  } else if (filtered.length > 10) {
    content = <div>Too many matches, specify another filter</div>
  } else if (filtered.length > 1) {
    content = <CountryList countries={filtered} onShow={handleShowCountry} />
  } else if (filtered.length === 1) {
    content = <CountryDetails country={filtered[0]} />
  } else {
    content = <div>No matches</div>
  }

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange} />
      {content}
    </div>
  )
}

export default App
