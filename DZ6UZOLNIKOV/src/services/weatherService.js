import axios from "axios";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getWeatherByCity = async (city) => {
    const geoRes = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    if (!geoRes.data.length) throw new Error("Город не найден");

    const { lat, lon } = geoRes.data[0];
    const weatherRes = await axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ru`);

    return weatherRes.data;
};