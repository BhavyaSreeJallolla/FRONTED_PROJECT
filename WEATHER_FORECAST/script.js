const api = {
    key: "d91c9d94618bba90b5c3331927bc10d2",                
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode === 13) {
        getResults(searchbox.value);
    }
}

function getResults(query) {
    fetch(`${api.base}forecast?q=${query}&units=metric&appid=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the entire response data
            displayCurrentWeather(data);
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayCurrentWeather(data) {
    const weather = data.list[0]; // Current weather is the first item in the list

    let city = document.querySelector('.location .city');
    city.innerText = `${data.city.name}, ${data.city.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

    // Update background image based on weather
    updateBackground(weather.weather[0].main);
}

function displayForecast(data) {
    const forecastList = data.list;
    const forecastContainer = document.querySelector('.forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecasts

    // Group forecast data by day
    const days = {};
    forecastList.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(item);
    });

    // Limit to 5 days
    let dayCount = 0;
    for (const [date, items] of Object.entries(days)) {
        if (dayCount >= 5) break;
        
        const mainItem = items[0];
        const weather = mainItem.weather[0];
        const temp = Math.round(mainItem.main.temp);
        const icon = getWeatherIcon(weather.main); // Get the icon URL

        const forecastElement = document.createElement('div');
        forecastElement.classList.add('day-forecast');
        forecastElement.innerHTML = `
            <div class="day">${date}</div>
            <div class="weather-icon">
                <img src="${icon}" alt="${weather.main}">
            </div>
            <div class="weather">${weather.main}</div>
            <div class="temp">${temp}°c</div>
        `;
        forecastContainer.appendChild(forecastElement);

        dayCount++;
    }
}

function getWeatherIcon(weatherCondition) {
    const weatherIcons = {
        clear: 'https://cdn.pixabay.com/photo/2012/04/18/13/21/clouds-37009_640.png',
        sunny: 'https://openweathermap.org/img/wn/01d.png',
        rain: 'https://openweathermap.org/img/wn/09d.png',
        drizzle: 'https://openweathermap.org/img/wn/09d.png',
        clouds: 'https://openweathermap.org/img/wn/03d.png',
        snow: 'https://openweathermap.org/img/wn/13d.png',
        storm: 'https://openweathermap.org/img/wn/11d.png',
        thunderstorm: 'https://openweathermap.org/img/wn/11d.png',
    };
    
    return weatherIcons[weatherCondition.toLowerCase()] || 'https://openweathermap.org/img/wn/01d.png'; // Default icon
}

function updateBackground(weatherCondition) {
    const body = document.body;
    let backgroundImage = 'url("https://images.pexels.com/photos/1406866/pexels-photo-1406866.jpeg?auto=compress&cs=tinysrgb&w=600")'; // Default image

    switch (weatherCondition.toLowerCase()) {
        case 'clear':
        case 'sunny':
            backgroundImage = 'url("https://media.istockphoto.com/id/1007768414/photo/blue-sky-with-bright-sun-and-clouds.jpg?s=1024x1024&w=is&k=20&c=P68MuQDaXK7NM55yd1ivyrW7NZ2CokCNSfDcXe8BdH0=")';
            break;
        case 'rain':
            backgroundImage = 'url("https://media.istockphoto.com/id/1475010821/video/torrential-rain-on-floor.jpg?s=640x640&k=20&c=DFwjLxAOEQQh0bshWzGZ8X7VbCDf268aBTGUimlt-vQ=")';
            break;
        case 'drizzle':
            backgroundImage = 'url("https://th.bing.com/th?id=OIP.C2Asz6OR33h_v5j6L1J-JwHaJ4&w=216&h=288&c=8&rs=1&qlt=90&r=0&o=6&pid=3.1&rm=2")';
            break;
        case 'clouds':
            backgroundImage = 'url("https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=600")';
            break;
        case 'snow':
            backgroundImage = 'url("https://images.pexels.com/photos/15334588/pexels-photo-15334588/free-photo-of-a-lone-tree-in-the-snow-with-stars-in-the-sky.jpeg?auto=compress&cs=tinysrgb&w=600")';
            break;
        case 'storm':
        case 'thunderstorm':
            backgroundImage = 'url("https://images.pexels.com/photos/2258536/pexels-photo-2258536.jpeg?auto=compress&cs=tinysrgb&w=600")';
            break;
        default:
            backgroundImage = 'url("https://images.pexels.com/photos/870802/pexels-photo-870802.jpeg?auto=compress&cs=tinysrgb&w=600")'; // Fallback image
            break;
    }

    body.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), ${backgroundImage}`;
}

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}
