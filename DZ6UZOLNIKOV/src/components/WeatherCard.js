const WeatherCard = ({ day, temp, icon }) => {
    return (
        <div className="weather-card">
            <span className="day">{day}</span>
            <div className="weather-info">
                <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt="weather icon" />
                <span className="temp">{Math.round(temp)}°C</span>
            </div>
        </div>
    );
};

export default WeatherCard;