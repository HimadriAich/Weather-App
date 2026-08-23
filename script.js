/* =========================================================
   SKYSCAN WEATHER APP
   Current weather + 7-day forecast + location detection
   ========================================================= */

const weatherCodeMap = {
    0: ["Clear Sky", "sun.png"],
    1: ["Mainly Clear", "sun.png"],
    2: ["Partly Cloudy", "cloudy.png"],
    3: ["Overcast", "overcast.png"],
    45: ["Fog", "fog.png"],
    48: ["Depositing Rime Fog", "fog.png"],
    51: ["Light Drizzle", "rain.png"],
    53: ["Moderate Drizzle", "rain.png"],
    55: ["Dense Drizzle", "rain.png"],
    56: ["Light Freezing Drizzle", "rain.png"],
    57: ["Dense Freezing Drizzle", "rain.png"],
    61: ["Slight Rain", "rain.png"],
    63: ["Moderate Rain", "rain.png"],
    65: ["Heavy Rain", "rain.png"],
    66: ["Light Freezing Rain", "rain.png"],
    67: ["Dense Freezing Rain", "rain.png"],
    71: ["Light Snow", "snow.png"],
    73: ["Moderate Snow", "snow.png"],
    75: ["Heavy Snow", "snow.png"],
    77: ["Snow Grains", "snow.png"],
    80: ["Slight Rain Showers", "rain.png"],
    81: ["Moderate Rain Showers", "rain.png"],
    82: ["Violent Rain Showers", "rain.png"],
    85: ["Slight Snow Showers", "snow.png"],
    86: ["Heavy Snow Showers", "snow.png"],
    95: ["Thunderstorm", "thunderstorm.png"],
    96: ["Thunderstorm With Slight Hail", "thunderstorm.png"],
    99: ["Thunderstorm With Heavy Hail", "thunderstorm.png"]
};

/* Get references to important HTML elements */
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const locationButton = document.getElementById("location-button");
const searchResults = document.getElementById("search-results");

const cityElement = document.getElementById("city");
const dateElement = document.getElementById("date");
const weatherImage = document.getElementById("weather-image");
const temperatureElement = document.getElementById("temperature");
const weatherConditionElement = document.getElementById("weather-condition");

const windSpeedElement = document.getElementById("wind-speed");
const humidityElement = document.getElementById("humidity");
const feelsLikeElement = document.getElementById("feels-like");

const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error-message");
const forecastContainer = document.getElementById("forecast-container");

/* Search button */
searchButton.addEventListener("click", getWeather);

/* Enter key search */
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

/* Browser geolocation */
locationButton.addEventListener("click", getCurrentLocation);


/* =========================================================
   SEARCH CITY
   ========================================================= */

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    showLoading();
    hideError();
    searchResults.innerHTML = "";

    try {
        /* Geocoding converts the city name into coordinates */
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`We couldn't find "${city}". Please check the spelling and try again.`);
        }

        /* Show choices when multiple locations have the same name */
        if (geoData.results.length > 1) {
            hideLoading();
            displaySearchResults(geoData.results);
        } else {
            await loadWeatherForLocation(geoData.results[0]);
        }

    } catch (error) {
        console.error("Weather App Error:", error);
        showError(error.message || "Something went wrong. Please try again.");
        hideLoading();
    }
}


/* =========================================================
   DISPLAY MULTIPLE SEARCH RESULTS
   ========================================================= */

function displaySearchResults(results) {
    searchResults.innerHTML = "";

    results.forEach(function(location) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "list-group-item list-group-item-action text-start";

        const admin = location.admin1 ? `, ${location.admin1}` : "";
        const country = location.country || "Unknown country";

        button.textContent = `${location.name}${admin}, ${country}`;

        button.addEventListener("click", function() {
            searchResults.innerHTML = "";
            cityInput.value = location.name;
            loadWeatherForLocation(location);
        });

        searchResults.appendChild(button);
    });
}


/* =========================================================
   LOAD WEATHER
   ========================================================= */

async function loadWeatherForLocation(location) {
    try {
        showLoading();
        hideError();

        const latitude = location.latitude;
        const longitude = location.longitude;
        const country = location.country;
        const locationName = location.name;

        /*
           current = current conditions
           daily = 7-day forecast data
        */
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,precipitation,wind_speed_10m,wind_direction_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Unable to retrieve weather data right now.");
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current) {
            throw new Error("Current weather information is unavailable.");
        }

        const current = weatherData.current;

        /* Extract current weather values */
        const temperature = current.temperature_2m;
        const feelsLike = current.apparent_temperature;
        const humidity = current.relative_humidity_2m;
        const windSpeed = current.wind_speed_10m;
        const windDirection = current.wind_direction_10m;
        const precipitation = current.precipitation;
        const cloudCover = current.cloud_cover;
        const weatherCode = current.weather_code;
        const isDay = current.is_day;

        const weatherInfo = weatherCodeMap[weatherCode];
        const weatherCondition = weatherInfo ? weatherInfo[0] : "Unknown";
        const weatherImagePath = weatherInfo ? weatherInfo[1] : "";

        /* Location */
        cityElement.textContent = country && locationName !== country
            ? `${locationName}, ${country}`
            : locationName;

        /* Current weather */
        temperatureElement.textContent = temperature;
        weatherConditionElement.textContent = weatherCondition;

        if (weatherImagePath) {
            weatherImage.src = weatherImagePath;
            weatherImage.alt = weatherCondition;
        }

        /* Weather details */
        windSpeedElement.textContent = windSpeed;
        humidityElement.textContent = humidity;
        feelsLikeElement.textContent = feelsLike;

        document.getElementById("wind-direction").textContent = getWindDirectionName(windDirection);
        document.getElementById("wind-direction-degree").textContent = `${Math.round(windDirection)}°`;
        document.getElementById("precipitation").textContent = precipitation;
        document.getElementById("cloud-cover").textContent = cloudCover;

        /* Use the searched location's timezone */
        const currentDate = new Date(current.time);

        const formattedDate = currentDate.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        dateElement.textContent = `${formattedDate} • ${isDay === 1 ? "Daytime" : "Nighttime"}`;

        /* Change page background based on weather */
        updateWeatherTheme(weatherCode, isDay);

        /* Create 7-day forecast cards */
        displayForecast(weatherData.daily);

    } catch (error) {
        console.error("Weather App Error:", error);
        showError(error.message || "Something went wrong. Please try again.");
    } finally {
        hideLoading();
    }
}


/* =========================================================
   7-DAY FORECAST
   ========================================================= */

function displayForecast(dailyData) {
    forecastContainer.innerHTML = "";

    const dates = dailyData.time;
    const weatherCodes = dailyData.weather_code;
    const maxTemperatures = dailyData.temperature_2m_max;
    const minTemperatures = dailyData.temperature_2m_min;

    dates.forEach(function(date, index) {
        const weatherInfo = weatherCodeMap[weatherCodes[index]];
        const condition = weatherInfo ? weatherInfo[0] : "Unknown";
        const image = weatherInfo ? weatherInfo[1] : "";

        const forecastDate = new Date(`${date}T00:00:00`);

        const dayName = index === 0
            ? "Today"
            : forecastDate.toLocaleDateString("en-IN", { weekday: "short" });

        const cardColumn = document.createElement("div");
        cardColumn.className = "col";

        cardColumn.innerHTML = `
            <div class="forecast-card">
                <p class="forecast-day">${dayName}</p>
                <img src="${image}" alt="${condition}" class="forecast-icon">
                <p class="forecast-condition">${condition}</p>
                <p class="forecast-temperature mb-0">
                    ${Math.round(maxTemperatures[index])}°C
                    <span class="forecast-low">${Math.round(minTemperatures[index])}°C</span>
                </p>
            </div>
        `;

        forecastContainer.appendChild(cardColumn);
    });
}


/* =========================================================
   DYNAMIC WEATHER BACKGROUND
   ========================================================= */

function updateWeatherTheme(code, isDay) {
    document.body.className = "";

    if (code === 0 || code === 1) {
        document.body.classList.add(isDay === 1 ? "clear-day" : "clear-night");
    } else if (code === 2 || code === 3) {
        document.body.classList.add("cloudy");
    } else if (code === 45 || code === 48) {
        document.body.classList.add("foggy");
    } else if (code >= 51 && code <= 67) {
        document.body.classList.add("rainy");
    } else if (code >= 71 && code <= 86) {
        document.body.classList.add("snowy");
    } else if (code >= 95) {
        document.body.classList.add("stormy");
    }
}


/* =========================================================
   USE MY LOCATION
   ========================================================= */

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    showLoading();
    hideError();

    /*
       Browser gives us latitude + longitude.
       We then send those coordinates directly to Open-Meteo.
    */
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                name: "Your Location",
                country: ""
            };

            loadWeatherForLocation(location);
        },
        function(error) {
            hideLoading();

            if (error.code === error.PERMISSION_DENIED) {
                showError("Location permission was denied. Please allow location access and try again.");
            } else {
                showError("Unable to determine your location. Please search for a city instead.");
            }
        }
    );
}


/* =========================================================
   WIND DIRECTION
   ========================================================= */

function getWindDirectionName(degrees) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.floor((degrees + 22.5) / 45) % 8;

    return directions[index];
}


/* =========================================================
   LOADING + ERROR FUNCTIONS
   ========================================================= */

function showLoading() {
    loadingElement.classList.remove("d-none");
    searchButton.disabled = true;
    locationButton.disabled = true;
    searchButton.textContent = "Searching...";
}

function hideLoading() {
    loadingElement.classList.add("d-none");
    searchButton.disabled = false;
    locationButton.disabled = false;
    searchButton.textContent = "Search";
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove("d-none");
}

function hideError() {
    errorElement.classList.add("d-none");
}


/* const weatherCodeMap = {             // this is the map for the weather codes, used to identify the weather condition based on the numbers
    0: ["Clear Sky", "sun.png"],
    1: ["Mainly Clear", "sun.png"],
    2: ["Partly Cloudy", "cloudy.png"],
    3: ["Overcast", "overcast.png"],
    45: ["Fog", "fog.png"],
    48: ["Depositing Rime Fog", "fog.png"],
    51: ["Light Drizzle", "rain.png"],
    53: ["Moderate Drizzle", "rain.png"],
    55: ["Dense Drizzle", "rain.png"],
    56: ["Light Freezing Drizzle", "rain.png"],
    57: ["Dense Freezing Drizzle", "rain.png"],
    61: ["Slight Rain", "rain.png"],
    63: ["Moderate Rain", "rain.png"],
    65: ["Heavy Rain", "rain.png"],
    66: ["Light Freezing Rain", "rain.png"],
    67: ["Dense Freezing Rain", "rain.png"],
    71: ["Light Snow", "snow.png"],
    73: ["Moderate Snow", "snow.png"],
    75: ["Heavy Snow", "snow.png"],
    77: ["Snow Grains", "snow.png"],
    80: ["Slight Rain Showers", "rain.png"],
    81: ["Moderate Rain Showers", "rain.png"],
    82: ["Violent Rain Showers", "rain.png"],
    85: ["Slight Snow Showers", "snow.png"],
    86: ["Heavy Snow Showers", "snow.png"],
    95: ["Thunderstorm", "thunderstorm.png"],
    96: ["Thunderstorm With Slight Hail", "thunderstorm.png"],
    99: ["Thunderstorm With Heavy Hail", "thunderstorm.png"]
};
/* ************************************************************************* 

const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", getWeather);

async function getWeather() {
    // Geo location API
    const city = cityInput.value.trim();   // Remove leading/trailing spaces. To get the  value from an input bar we need to use .value
    console.log(city);

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`  // this is the url for the geocoding api(endpoint)
// note- always paste these urls inside backticks and not quotes. 
// Note: we added the name=${city} in the url because we need to pass the city name in the url to get its latitude and longitude and its country

    const geoResponse = await fetch(geoUrl);    // always use await keyword with fetch

    const geoData = await geoResponse.json();   // just converting the response to json format
    console.log(geoData);

    //now we need to get the latitude and longitude and country from the geoData
    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const country = geoData.results[0].country;
// we need the latitude and longitude and country because we need to use them in the weather api
// we will pass the latitude and longitude values in the weather api url to get the weather of that location

    // Weather API, at the end of the url we need to add the latitude and longitude values, along with the other parameters we need such as temperature, weather condition and wind speed, separated using commas and & symbol
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,windspeed_10m&current_weather=true&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    console.log(weatherData);

    const temperature = weatherData.current_weather.temperature;
    const weatherCode = weatherData.current_weather.weathercode;
    const windSpeed = weatherData.current_weather.windspeed;

    const[weatherCondition, weatherImage] = weatherCodeMap[weatherCode];   // this is the map for the weather codes, used to identify the weather condition based on the numbers
// what the above line is doing is that it is assigning the weather condition and weather image to the weatherCondition and weatherImage variables respectively

    if (country && city != country) {     //if country is undefined and city name is not same as the country name, then print normally city and country
        document.getElementById("city").innerText = `${city}, ${country}`;
    }

    else {   // else, if city and country is same (like in case of Singapore), then print only city
        document.getElementById("city").innerText = `${city}`;
    }

    // now we need to display the weather data on the webpage
    //(we are putting this line in if block) document.getElementById("city").innerText = `${city}, ${country}`;
    document.getElementById("weather-image").src = weatherImage;
    document.getElementById("temperature").innerText = temperature;
    document.getElementById("weather-condition").textContent = weatherCondition;
    document.getElementById("wind-speed").innerText = windSpeed;

}

*/

