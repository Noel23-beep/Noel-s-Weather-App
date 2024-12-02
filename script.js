// OpenWeatherMap API key
const apiKey = '12bfe6e9ac08e92c9dbc3a2e2b4a9bc8';

// Function to fetch weather data for a location by name or coordinates
function fetchWeatherData(location = null, latitude = null, longitude = null) {
    let apiUrl;

    if (latitude && longitude) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    } else if (location) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;
    } else {
        alert("Please enter a location or enable location services.");
        return;

    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            document.getElementById('location-name').textContent = `${data.city.name}, ${data.city.country}`;
            displayWeatherData(data);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Could not retrieve weather data. Please try again.");
        });
}

// Function to search weather by location input
function searchWeather() {
    const location = document.getElementById('location').value;
    if (location) {
        fetchWeatherData(location);
        document.getElementById('loading-message').style.display = 'block';
        fetchWeatherData(location);
    } else {
        alert("Please enter a location.");
    }
}

// Function to display the weather data
function displayWeatherData(data) {
    const forecastContainer = document.getElementById('forecast-container');
    const currentDateEl = document.getElementById('current-date');
    const currentTempEl = document.getElementById('current-temp');
    const currentDescriptionEl = document.getElementById('current-description');
    document.getElementById('loading-message').style.display = 'none'; 


    // Clear previous forecast data
    forecastContainer.innerHTML = '';

    // Set current weather details
    const currentWeather = data.list[0];
    const currentTemp = Math.round(currentWeather.main.temp);
    const currentDate = new Date(currentWeather.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const currentDescription = currentWeather.weather[0].description;

    currentDateEl.textContent = currentDate;
    currentTempEl.textContent = `${currentTemp}°C`;
    currentDescriptionEl.textContent = currentDescription.charAt(0).toUpperCase() + currentDescription.slice(1);

    // Extract daily forecast
    const dailyData = [];
    for (let i = 0; i < data.list.length; i += 8) {
        dailyData.push(data.list[i]);
    }

    // Fetch forecast for the next 5 days
    dailyData.slice(0, 5).forEach(dayData => {
        const date = new Date(dayData.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(dayData.main.temp);
        const iconCode = dayData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const weatherDescription = dayData.weather[0].description;

        // Create forecast day element
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');

        forecastDay.innerHTML = `
            <div class="day">${dayName}</div>
            <img src="${iconUrl}" alt="${weatherDescription}" class="icon">
            <div class="temperature">${temp}°C</div>
            <div class="date">${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
        `;

        forecastContainer.appendChild(forecastDay);
    });
}

// Function to fetch weather data based on user's current location
function loadWeatherForCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(null, latitude, longitude);
            },
            error => {
                console.error("Error retrieving location:", error);
                alert("Could not retrieve location. Please enter a location manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Load weather data for the current location on page load
window.onload = loadWeatherForCurrentLocation;
