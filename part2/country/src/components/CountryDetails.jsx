import {useEffect, useState} from "react"
import weatherService from "../services/weather"

const CountryDetails = ({country}) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital?.[0]
  const languages = country.languages ? Object.values(country.languages) : []

  useEffect(() => {
    if (!capital) return

    weatherService
      .getByCity(capital)
      .then((data) => setWeather(data))
      .catch((err) => {
        console.log("weather fetch failed:", err)
        setWeather(null)
      })
  }, [capital])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {capital}</div>
      <div>Area {country.area}</div>

      <h2>Languages</h2>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags?.png}
        alt={`Flag of ${country.name.common}`}
        width="200"
      />

      <h2>Weather in {capital}</h2>

      {!weather ? (
        <div>Loading weather...</div>
      ) : (
        <div>
          <div>Temperature {weather.main.temp} Celsius</div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <div>Wind {weather.wind.speed} m/s</div>
        </div>
      )}
    </div>
  )
}

export default CountryDetails
