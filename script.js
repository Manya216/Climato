const apiKey = 'ac027f4f479c20be5dc904905dbccbdc'; 

const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('errorMsg');
const forecastContainer = document.getElementById('forecastContainer');

const cityName = document.getElementById('cityName');
const weatherDesc = document.getElementById('weatherDesc');
const temp = document.getElementById('temp');
const humidity = document.getElementById('humidity');
const weatherIcon = document.getElementById('weatherIcon');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if(city === '') return;
    getWeatherData(`q=${city}`);
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        loader.classList.remove('hidden');
        navigator.geolocation.getCurrentPosition((position) => {
            getWeatherData(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        }, () => {
            showError("Location access denied.");
            loader.classList.add('hidden');
        });
    }
});

async function getWeatherData(query) {
    try {
        loader.classList.remove('hidden');
        weatherCard.classList.add('hidden');
        errorMsg.textContent = '';

        // Fetch Current Weather
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`);
        const currentData = await currentRes.json();

        // Fetch Forecast
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastRes.json();

        loader.classList.add('hidden');

        if(currentData.cod === "404") {
            showError('City not found!');
            return;
        }

        displayWeather(currentData);
        displayForecast(forecastData);

    } catch (error) {
        loader.classList.add('hidden');
        showError('Error connecting to API.');
    }
}

function displayWeather(data) {
    weatherCard.classList.remove('hidden');
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherDesc.textContent = data.weather[0].description;
    temp.textContent = Math.round(data.main.temp);
    humidity.textContent = data.main.humidity;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    updateBackground(data.weather[0].main);
}

function displayForecast(data) {
    forecastContainer.innerHTML = '';
    
    // Filter to get only one reading per day (at 12:00 PM)
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const icon = day.weather[0].icon;
        const temp = Math.round(day.main.temp);

        const card = `
            <div class="forecast-card">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
                <p>${temp}°C</p>
            </div>
        `;
        forecastContainer.innerHTML += card;
    });
}

function showError(message) {
    errorMsg.textContent = message;
    weatherCard.classList.add('hidden');
}

function updateBackground(weather) {
    let bg;
    switch(weather.toLowerCase()) {
        case 'clear': bg = 'linear-gradient(to bottom, #fceabb, #f8b500)'; break;
        case 'clouds': bg = 'linear-gradient(to bottom, #d7d2cc, #304352)'; break;
        case 'rain':
        case 'drizzle': bg = 'linear-gradient(to bottom, #4e54c8, #8f94fb)'; break;
        default: bg = 'linear-gradient(to bottom, #74ebd5, #ACB6E5)';
    }
    document.body.style.background = bg;
}
