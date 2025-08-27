const apiKey = 'ac027f4f479c20be5dc904905dbccbdc'; 

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const cityName = document.getElementById('cityName');
const weatherDesc = document.getElementById('weatherDesc');
const temp = document.getElementById('temp');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const weatherIcon = document.getElementById('weatherIcon');
const errorMsg = document.getElementById('errorMsg');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if(city === '') return;
    getWeather(city);
});

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        
        if(data.cod === "404") {
            weatherCard.classList.add('hidden');
            errorMsg.textContent = 'City not found!';
            return;
        }

        errorMsg.textContent = '';
        weatherCard.classList.remove('hidden');

        cityName.textContent = data.name + ', ' + data.sys.country;
        weatherDesc.textContent = data.weather[0].description;
        temp.textContent = data.main.temp;
        humidity.textContent = data.main.humidity;
        wind.textContent = data.wind.speed;
        weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        updateBackground(data.weather[0].main);

    } catch (error) {
        console.log(error);
        errorMsg.textContent = 'Error fetching weather data!';
    }
}

function updateBackground(weather) {
    let bg;
    switch(weather.toLowerCase()) {
        case 'clear':
            bg = 'linear-gradient(to bottom, #fceabb, #f8b500)'; 
            break;
        case 'clouds':
            bg = 'linear-gradient(to bottom, #d7d2cc, #304352)'; 
            break;
        case 'rain':
        case 'drizzle':
            bg = 'linear-gradient(to bottom, #4e54c8, #8f94fb)'; 
            break;
        case 'snow':
            bg = 'linear-gradient(to bottom, #e6e9f0, #eef1f5)';
            break;
        case 'thunderstorm':
            bg = 'linear-gradient(to bottom, #141e30, #243b55)'; 
            break;
        default:
            bg = 'linear-gradient(to bottom, #74ebd5, #ACB6E5)'; 
    }
    document.body.style.background = bg;
}
