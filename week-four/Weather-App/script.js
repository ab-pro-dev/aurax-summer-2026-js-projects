// ========================================
// Weather App - JavaScript
// ========================================

// API Key from OpenWeatherMap
const API_KEY = '2f02facba7e322bc3a4d3a53d06765ce';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const resultsDiv = document.getElementById('weather-results');

// ----------------------------------------
// Event Listener - Form Submit
// ----------------------------------------
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    const city = cityInput.value.trim();
    if (!city) return;

    // Show loading state
    showLoading();

    try {
        // Fetch weather data from API
        const weatherData = await fetchWeather(city);
        // Display the results
        displayWeather(weatherData);
    } catch (error) {
        // Show error message
        showError(error.message);
    }
});

// ----------------------------------------
// Fetch Weather Data from API
// ----------------------------------------
async function fetchWeather(city) {
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    // Handle HTTP errors (like city not found = 404)
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please check the spelling.');
        }
        throw new Error('Something went wrong. Please try again.');
    }

    return await response.json();
}

// ----------------------------------------
// Display Weather Data in the UI
// ----------------------------------------
function displayWeather(data) {
    const cityName = data.name;
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    resultsDiv.innerHTML = `
        <h2 class="city-name">${cityName}</h2>
        <img class="weather-icon" src="${iconUrl}" alt="${condition}">
        <p class="temperature">${temp}°C</p>
        <p class="condition">${condition}</p>
    `;
}

// ----------------------------------------
// Show Loading State
// ----------------------------------------
function showLoading() {
    resultsDiv.innerHTML = '<p class="loading">Loading...</p>';
}

// ----------------------------------------
// Show Error State
// ----------------------------------------
function showError(message) {
    resultsDiv.innerHTML = `<p class="error">${message}</p>`;
}