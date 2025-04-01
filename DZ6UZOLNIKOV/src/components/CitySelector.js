import { useState } from "react";

const CitySelector = ({ onCitySelect }) => {
    const [city, setCity] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onCitySelect(city);
            setCity("");
        }
    };

    return (
        <form className="city-selector" onSubmit={handleSubmit}>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Поиск..." />
            <button type="submit">GO</button>
        </form>
    );
};

export default CitySelector;