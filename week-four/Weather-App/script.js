// ========================================
// Weather App - JavaScript
// ========================================

// API Key from OpenWeatherMap
const API_KEY = '2f02facba7e322bc3a4d3a53d06765ce';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM Elements
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const resultsDiv = document.getElementById('weather-results');
const locationBtn = document.getElementById('location-btn');
const suggestionsList = document.getElementById('suggestions-list');

// ----------------------------------------
// Autocomplete — Debounce timer
// ----------------------------------------
let debounceTimer = null;

// ----------------------------------------
// Autocomplete — Country code → full name map
// Common codes only; unknown codes fall back to the code itself.
// ----------------------------------------
const COUNTRY_NAMES = {
    AF:'Afghanistan',AL:'Albania',DZ:'Algeria',AR:'Argentina',AU:'Australia',
    AT:'Austria',BD:'Bangladesh',BE:'Belgium',BO:'Bolivia',BR:'Brazil',
    BG:'Bulgaria',KH:'Cambodia',CM:'Cameroon',CA:'Canada',CL:'Chile',
    CN:'China',CO:'Colombia',CR:'Costa Rica',HR:'Croatia',CU:'Cuba',
    CZ:'Czech Republic',DK:'Denmark',EC:'Ecuador',EG:'Egypt',SV:'El Salvador',
    ET:'Ethiopia',FI:'Finland',FR:'France',DE:'Germany',GH:'Ghana',
    GR:'Greece',GT:'Guatemala',HN:'Honduras',HK:'Hong Kong',HU:'Hungary',
    IS:'Iceland',IN:'India',ID:'Indonesia',IR:'Iran',IQ:'Iraq',
    IE:'Ireland',IL:'Israel',IT:'Italy',JM:'Jamaica',JP:'Japan',
    JO:'Jordan',KZ:'Kazakhstan',KE:'Kenya',KR:'South Korea',KW:'Kuwait',
    LA:'Laos',LB:'Lebanon',LY:'Libya',MY:'Malaysia',MX:'Mexico',
    MA:'Morocco',MZ:'Mozambique',MM:'Myanmar',NP:'Nepal',NL:'Netherlands',
    NZ:'New Zealand',NI:'Nicaragua',NG:'Nigeria',NO:'Norway',OM:'Oman',
    PK:'Pakistan',PA:'Panama',PY:'Paraguay',PE:'Peru',PH:'Philippines',
    PL:'Poland',PT:'Portugal',QA:'Qatar',RO:'Romania',RU:'Russia',
    SA:'Saudi Arabia',SN:'Senegal',RS:'Serbia',SG:'Singapore',SK:'Slovakia',
    SI:'Slovenia',ZA:'South Africa',ES:'Spain',LK:'Sri Lanka',SD:'Sudan',
   SE:'Sweden',CH:'Switzerland',SY:'Syria',TW:'Taiwan',TZ:'Tanzania',
    TH:'Thailand',TN:'Tunisia',TR:'Turkey',UG:'Uganda',UA:'Ukraine',
    AE:'United Arab Emirates',GB:'United Kingdom',US:'United States',
    UY:'Uruguay',UZ:'Uzbekistan',VE:'Venezuela',VN:'Vietnam',YE:'Yemen',
    ZW:'Zimbabwe'
};

// ----------------------------------------
// Autocomplete — Listen to input changes
// Debounce: wait 350ms after user stops typing
// Only fetch after 2+ characters
// ----------------------------------------
cityInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = cityInput.value.trim();

    if (query.length < 2) {
        hideSuggestions();
        return;
    }

    debounceTimer = setTimeout(() => {
        fetchSuggestions(query);
    }, 350);
});

// ----------------------------------------
// Autocomplete — Close dropdown on outside click
// ----------------------------------------
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        hideSuggestions();
    }
});

// ----------------------------------------
// Autocomplete — Keyboard navigation
// Arrow keys to move, Enter to select, Escape to close
// ----------------------------------------
cityInput.addEventListener('keydown', (e) => {
    const items = suggestionsList.querySelectorAll('li');
    if (!items.length) return;

    const activeItem = suggestionsList.querySelector('.active-item');
    let index = Array.from(items).indexOf(activeItem);

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeItem) activeItem.classList.remove('active-item');
        index = (index + 1) % items.length;
        items[index].classList.add('active-item');
        items[index].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeItem) activeItem.classList.remove('active-item');
        index = (index - 1 + items.length) % items.length;
        items[index].classList.add('active-item');
        items[index].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && activeItem) {
        e.preventDefault();
        selectSuggestion(activeItem.dataset.city);
    } else if (e.key === 'Escape') {
        hideSuggestions();
    }
});

// ----------------------------------------
// Autocomplete — Fetch city suggestions from Geocoding API
// ----------------------------------------
async function fetchSuggestions(query) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&lang=en&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            showSuggestions(data);
        } else {
            hideSuggestions();
        }
    } catch (error) {
        hideSuggestions();
    }
}

// ----------------------------------------
// Autocomplete — Render the dropdown items
// Shows full country name, state when available,
// and sorts exact-prefix matches to the top.
// ----------------------------------------
function showSuggestions(cities) {
    const query = cityInput.value.trim().toLowerCase();

    // Sort: cities whose name starts with the query come first
    const sorted = [...cities].sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(query);
        const bStarts = b.name.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
    });

    suggestionsList.innerHTML = sorted.map(city => {
        const code = city.country || '';
        const fullName = COUNTRY_NAMES[code] || code; // fallback to code if unknown
        const state = city.state ? `, ${city.state}` : '';
        const label = `${city.name}${state}`;

        return `<li data-city="${city.name}">${label}<span class="suggestion-country">${fullName}</span></li>`;
    }).join('');

    suggestionsList.classList.add('active');

    suggestionsList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            selectSuggestion(li.dataset.city);
        });
    });
}

// ----------------------------------------
// Autocomplete — Hide dropdown
// ----------------------------------------
function hideSuggestions() {
    suggestionsList.classList.remove('active');
    suggestionsList.innerHTML = '';
}

// ----------------------------------------
// Autocomplete — User selected a suggestion
// ----------------------------------------
function selectSuggestion(city) {
    cityInput.value = city;
    hideSuggestions();
    loadWeatherByCity(city);
}

// ===========================================
// Auto-Correct: Levenshtein Distance
// Counts how many single-character edits
// (insert, delete, substitute) are needed
// to turn string A into string B.
// ===========================================
function levenshtein(a, b) {
    const matrix = [];

    // Build a matrix of size (a.length+1) × (b.length+1)
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1]; // no cost — characters match
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitute
                    matrix[i][j - 1] + 1,     // insert
                    matrix[i - 1][j] + 1      // delete
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// ----------------------------------------
// Auto-Correct: List of ~80 major world cities
// Used as a fallback when the API returns no results.
// ----------------------------------------
const MAJOR_CITIES = [
    'Abidjan','Abu Dhabi','Accra','Addis Ababa','Aleppo','Alexandria',
    'Algiers','Amman','Amsterdam','Ankara','Bangkok','Barcelona',
    'Beijing','Beirut','Berlin','Bogota','Buenos Aires','Cairo',
    'Calgary','Cape Town','Casablanca','Chongqing','Colombo','Dakar',
    'Dallas','Dhaka','Dubai','Dublin','Durban','Fukuoka',
    'Guangzhou','Guatemala City','Haifa','Hamburg','Havana','Helsinki',
    'Ho Chi Minh City','Hong Kong','Houston','Hyderabad','Istanbul',
    'Jakarta','Jeddah','Johannesburg','Kabul','Kampala','Kathmandu',
    'Khartoum','Kigali','Kinshasa','Kolkata','Kuala Lumpur','Kuwait City',
    'Lagos','Lahore','Lima','Lisbon','London','Los Angeles',
    'Luanda','Lusaka','Madrid','Manila','Melbourne','Mexico City',
    'Miami','Milan','Minsk','Monterrey','Montreal','Moscow',
    'Mumbai','Munich','Nairobi','Naples','Nashville','New York',
    'Osaka','Oslo','Panama City','Paris','Perth','Philadelphia',
    'Phoenix','Port-au-Prince','Prague','Quebec City','Rio de Janeiro',
    'Riyadh','Rome','Salt Lake City','San Francisco','Santiago','Sao Paulo',
    'Seoul','Shanghai','Shenzhen','Singapore','Stockholm','Sydney',
    'Taipei','Tashkent','Tbilisi','Tehran','Tokyo','Toronto',
    'Tripoli','Tunis','Ulan Bator','Vienna','Warsaw','Washington D.C.',
    'Yerevan','Zurich'
];

// ----------------------------------------
// Auto-Correct: Find closest city name from the list
// Returns the best match if distance ≤ 2, otherwise null.
// ----------------------------------------
function findClosestCity(input) {
    const lower = input.toLowerCase();
    let best = null;
    let bestDist = Infinity;

    for (const city of MAJOR_CITIES) {
        const dist = levenshtein(lower, city.toLowerCase());
        if (dist < bestDist) {
            bestDist = dist;
            best = city;
        }
    }

    // Only accept a match if it's reasonably close (max 2 edits)
    return bestDist <= 2 ? { name: best, distance: bestDist } : null;
}

// ----------------------------------------
// Helper: safely set text on an element by ID.
// Logs a warning instead of crashing if missing.
// ----------------------------------------
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    } else {
        console.warn(`Element #${id} not found — cannot set textContent.`);
    }
}

// ----------------------------------------
// Helper: safely set src on an image by ID.
// ----------------------------------------
function setImageSrc(id, src) {
    const el = document.getElementById(id);
    if (el) {
        el.src = src;
    } else {
        console.warn(`Element #${id} not found — cannot set src.`);
    }
}

// ----------------------------------------
// Event Listener - Form Submit
// ----------------------------------------
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    await loadWeatherByCity(city);
});

// ----------------------------------------
// Event Listener - Use My Location
// ----------------------------------------
locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await loadWeatherByCoords(latitude, longitude);
        },
        () => {
            showError('Unable to get your location. Please allow location access.');
        },
        { enableHighAccuracy: true }
    );
});

// ----------------------------------------
// Load Weather by City Name
// If the initial search fails, try auto-correct.
// ----------------------------------------
async function loadWeatherByCity(city) {
    showLoading();
    let correctionNote = null;

    try {
        let data;
        let correctedCity = city;

        try {
            // Step 1: Try the search as-is
            data = await fetchWeatherByCity(city);
        } catch (e) {
            // Step 2: City not found — try fuzzy match against local list
            const match = findClosestCity(city);
            if (match) {
                correctedCity = match.name;
                correctionNote = { corrected: match.name, original: city };
                data = await fetchWeatherByCity(correctedCity);
            } else {
                // No close match found — re-throw the original error
                throw e;
            }
        }

        // Forecast is optional — don't let it break the whole app
        let forecastData = null;
        try {
            forecastData = await fetchForecastByCity(correctedCity);
        } catch (e) {
            console.warn('Forecast unavailable:', e.message);
        }

        console.log('Weather data:', data);
        displayWeather(data, null, correctionNote);

        if (forecastData) {
            displayForecast(forecastData);
        }
        saveLastCity(correctedCity);
    } catch (error) {
        showError(error.message);
    }
}

// ----------------------------------------
// Load Weather by Coordinates
// ----------------------------------------
async function loadWeatherByCoords(lat, lon) {
    try {
        const data = await fetchWeatherByCoords(lat, lon);

        let forecastData = null;
        try {
            forecastData = await fetchForecastByCoords(lat, lon);
        } catch (e) {
            console.warn('Forecast unavailable:', e.message);
        }

        const locationName = await reverseGeocode(lat, lon);

        displayWeather(data, locationName);

        if (forecastData) {
            displayForecast(forecastData);
        }
        saveLastCity(data.name);
    } catch (error) {
        showError(error.message);
    }
}

// ----------------------------------------
// Reverse Geocode - Get city name from coordinates
// ----------------------------------------
async function reverseGeocode(lat, lon) {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
        return data[0].name;
    }
    return null;
}

// ----------------------------------------
// Fetch Weather by City Name
// FIX: encode city name so spaces/special chars don't break the URL
// ----------------------------------------
async function fetchWeatherByCity(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    return await fetchWeatherData(url);
}

// ----------------------------------------
// Fetch Weather by Coordinates
// ----------------------------------------
async function fetchWeatherByCoords(lat, lon) {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return await fetchWeatherData(url);
}

// ----------------------------------------
// Fetch Forecast by City Name
// FIX: encode city name for same reason as above
// ----------------------------------------
async function fetchForecastByCity(city) {
    const url = `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Forecast unavailable');
    return await response.json();
}

// ----------------------------------------
// Fetch Forecast by Coordinates
// ----------------------------------------
async function fetchForecastByCoords(lat, lon) {
    const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Forecast unavailable');
    return await response.json();
}

// ----------------------------------------
// Core Fetch Logic
// ----------------------------------------
async function fetchWeatherData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please check the spelling.');
        }
        throw new Error('Something went wrong. Please try again.');
    }

    return await response.json();
}

// ----------------------------------------
// Get Weather Icon URL (large size)
// ----------------------------------------
function getWeatherEmoji(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

// ----------------------------------------
// Display Weather Data in the UI
// FIX: Rebuilds the full HTML structure first, THEN sets values.
// This avoids the NULL crash caused by showLoading() destroying
// the DOM elements that displayWeather() later tries to update.
// correctionNote: { corrected, original } or null
// ----------------------------------------
function displayWeather(data, locationName = null, correctionNote = null) {
    const cityName = locationName || data.name;
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // m/s → km/h
    const precipitation = Math.min(data.clouds.all, 100);

    // Build correction banner HTML (only shown when a correction was made)
    const correctionHTML = correctionNote
        ? `<p class="correction-note">Showing results for "<strong>${correctionNote.corrected}</strong>" (searched: ${correctionNote.original})</p>`
        : '';

    // Step 1: Rebuild the full card structure so all elements exist
    resultsDiv.innerHTML = `
        <!-- Auto-correct note -->
        ${correctionHTML}

        <!-- Main Weather Card -->
        <div class="glass-card main-card">
            <p class="city-name" id="city-name"></p>
            <p class="weather-condition" id="weather-condition"></p>
            <div class="weather-icon-container">
                <img class="weather-icon" id="weather-icon" src="" alt="weather icon">
            </div>
            <p class="temperature" id="temperature"></p>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
            <div class="glass-card stat-card">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <p class="stat-value" id="humidity"></p>
                <p class="stat-label">Humidity</p>
            </div>
            <div class="glass-card stat-card">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                </svg>
                <p class="stat-value" id="wind"></p>
                <p class="stat-label">Wind</p>
            </div>
            <div class="glass-card stat-card">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
                    <polyline points="13 11 9 17 15 17 11 23"></polyline>
                </svg>
                <p class="stat-value" id="precipitation"></p>
                <p class="stat-label">Precipitation</p>
            </div>
        </div>

        <!-- Hourly Forecast -->
        <div class="glass-card forecast-card">
            <h3 class="forecast-title">Hourly Forecast</h3>
            <div class="forecast-scroll" id="forecast-scroll"></div>
        </div>
    `;

    // Step 2: Now safely set values — elements are guaranteed to exist
    setText('city-name', cityName);
    setText('weather-condition', condition);
    setImageSrc('weather-icon', getWeatherEmoji(iconCode));
    setText('temperature', `${temp}°`);
    setText('humidity', `${humidity}%`);
    setText('wind', `${windSpeed} km/h`);
    setText('precipitation', `${precipitation}%`);
}

// ----------------------------------------
// Display Hourly Forecast
// ----------------------------------------
function displayForecast(data) {
    const forecastScroll = document.getElementById('forecast-scroll');
    if (!forecastScroll) {
        console.warn('Element #forecast-scroll not found — cannot display forecast.');
        return;
    }

    forecastScroll.innerHTML = '';

    // Get next 8 items (each 3 hours apart = 24 hours total)
    const forecastItems = data.list.slice(0, 8);

    forecastItems.forEach(item => {
        const time = new Date(item.dt * 1000);
        const hours = time.getHours();
        const timeStr = hours === 0 ? '12 AM' :
                        hours === 12 ? '12 PM' :
                        hours > 12 ? `${hours - 12} PM` : `${hours} AM`;
        const temp = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <p class="forecast-time">${timeStr}</p>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="weather">
            <p class="forecast-temp">${temp}°</p>
        `;
        forecastScroll.appendChild(forecastItem);
    });
}

// ----------------------------------------
// Show Loading State
// ----------------------------------------
function showLoading() {
    resultsDiv.innerHTML = `
        <div class="glass-card main-card">
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading weather data...</p>
            </div>
        </div>
    `;
}

// ----------------------------------------
// Show Error State
// ----------------------------------------
function showError(message) {
    resultsDiv.innerHTML = `
        <div class="glass-card main-card">
            <div class="error">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 16px; opacity: 0.5;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <p>${message}</p>
            </div>
        </div>
    `;
}

// ----------------------------------------
// LocalStorage - Remember Last City
// ----------------------------------------
function saveLastCity(city) {
    localStorage.setItem('lastCity', city);
}

function getLastCity() {
    return localStorage.getItem('lastCity');
}

// ----------------------------------------
// Auto-load last city on page refresh
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const lastCity = getLastCity();
    if (lastCity) {
        cityInput.value = lastCity;
        loadWeatherByCity(lastCity);
    }
});