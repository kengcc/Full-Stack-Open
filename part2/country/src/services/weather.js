import axios from "axios"

const apiKey = import.meta.env.VITE_WEATHER_API_KEY
const baseUrl = "https://api.openweathermap.org/data/2.5/weather"

const getByCity = (city) => {
  const params = {
    q: city,
    appid: apiKey,
    units: "metric",
  }
  // console.log(params)

  return axios.get(baseUrl, {params}).then((res) => res.data)
}

export default {getByCity}
