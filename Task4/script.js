
"use strict";

// Select page elements
const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const statusMessage = document.getElementById("status-message");
const weatherResult = document.getElementById("weather-result");

const cityName = document.getElementById("city-name");
const locationDetails = document.getElementById("location-details");
const weatherDate = document.getElementById("weather-date");
const weatherDescription = document.getElementById("weather-description");
const weatherIcon = document.getElementById("weather-icon");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const windDirection = document.getElementById("wind-direction");

// Display a status or error message
function showStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.classList.toggle("error", isError);
}

// Describe common Open-Meteo weather codes
function getWeatherInfo(code, isDay) {
    if (code === 0) {
        return {
            description: "Clear sky",
            icon: isDay ? "☀️" : "🌙"
        };
    }

    if (code === 1) {
        return {
            description: "Mainly clear",
            icon: isDay ? "🌤️" : "🌙"
        };
    }

    if (code === 2) {
        return {
            description: "Partly cloudy",
            icon: "⛅"
        };
    }

    if (code === 3) {
        return {
            description: "Overcast",
            icon: "☁️"
        };
    }

    if ([45, 48].includes(code)) {
        return {
            description: "Foggy",
            icon: "🌫️"
        };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return {
            description: "Drizzle",
            icon: "🌦️"
        };
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return {
            description: "Rain",
            icon: "🌧️"
        };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return {
            description: "Snow",
            icon: "❄️"
        };
    }

    if ([95, 96, 99].includes(code)) {
        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        description: "Unknown conditions",
        icon: "🌡️"
    };
}

// Convert wind direction degrees to a compass direction
function getCompassDirection(degrees) {
    if (!Number.isFinite(degrees)) {
        return "N/A";
    }

    const directions = [
        "N", "NE", "E", "SE",
        "S", "SW", "W", "NW"
    ];

    const index = Math.round(degrees / 45) % 8;

    return directions[index];
}

// Search the geocoding API for a city
async function findCity(city) {
    const url = new URL(
        "https://geocoding-api.open-meteo.com/v1/search"
    );

    url.search = new URLSearchParams({
        name: city,
        count: "10",
        language: "en",
        format: "json"
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to search for this city.");
    }

    const data = await response.json();

    if (!Array.isArray(data.results) || data.results.length === 0) {
        throw new Error(
            "City not found. Check the spelling and try again."
        );
    }

    // Prefer an exact city-name match when available
    const match = data.results.find(function (place) {
        return place.name.toLowerCase() === city.toLowerCase();
    });

    return match || data.results[0];
}

// Request current weather using latitude and longitude
async function getWeather(latitude, longitude) {
    const url = new URL(
        "https://api.open-meteo.com/v1/forecast"
    );

    url.search = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m"
        ].join(","),
        timezone: "auto"
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Weather data is temporarily unavailable."
        );
    }

    const data = await response.json();

    if (!data.current) {
        throw new Error("No current weather data was returned.");
    }

    return data;
}

// Display the weather information
function displayWeather(place, data) {
    const current = data.current;

    cityName.textContent = place.name;

    const locationParts = [
        place.admin1,
        place.country
    ].filter(Boolean);

    locationDetails.textContent = locationParts.join(", ");

    const info = getWeatherInfo(
        current.weather_code,
        current.is_day === 1
    );

    weatherDescription.textContent = info.description;
    weatherIcon.textContent = info.icon;

    temperature.textContent = Math.round(current.temperature_2m);
    feelsLike.textContent = Math.round(current.apparent_temperature);
    humidity.textContent = current.relative_humidity_2m;

    windSpeed.textContent =
        Number(current.wind_speed_10m).toFixed(1);

    windDirection.textContent = getCompassDirection(
        current.wind_direction_10m
    );

    // Display the API's local time for the selected location
    const localTime = new Date(current.time);

    weatherDate.textContent = Number.isNaN(localTime.getTime())
        ? current.time
        : localTime.toLocaleString("en", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: data.timezone
        });

    weatherResult.hidden = false;
}

// Handle the search form
weatherForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showStatus("Please enter a city name.", true);
        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Searching...";
    showStatus("Finding the city and checking its weather...");

    try {
        const place = await findCity(city);

        const data = await getWeather(
            place.latitude,
            place.longitude
        );

        displayWeather(place, data);

        showStatus("Weather updated successfully.");
    } catch (error) {
        showStatus(
            error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.",
            true
        );
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
});
