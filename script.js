/* =========================================================
   SKYSCAN WEATHER APP

   1. Search using the button
   2. Search using the Enter key
   3. Prevent empty searches
   4. Show loading state
   5. Disable search button while loading
   6. Handle invalid cities
   7. Handle API errors
   8. Handle unexpected data
   9. Clear old errors
   10. Use the new "weather-image" ID

   ========================================================= */
/* =========================================================
   WEATHER CODE MAP
   ---------------------------------------------------------
   Open-Meteo returns a numerical weather code.
   We convert that numerical code into:
   1. A readable weather condition
   2. An appropriate image
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

/* GET HTML ELEMENTS
   ---------------------------------------------------------
   Instead of repeatedly writing:
   document.getElementById(...)
   throughout our code, we store references to the elements
   in variables.
   ========================================================= */

const cityInput = document.getElementById("city-input");

const searchButton = document.getElementById("search-button");

const cityElement = document.getElementById("city");

const dateElement = document.getElementById("date");

const weatherImage = document.getElementById("weather-image");

const temperatureElement = document.getElementById("temperature");

const weatherConditionElement =
    document.getElementById("weather-condition");

const windSpeedElement =
    document.getElementById("wind-speed");

const humidityElement =
    document.getElementById("humidity");

const feelsLikeElement =
    document.getElementById("feels-like");

const loadingElement =
    document.getElementById("loading");

const errorElement =
    document.getElementById("error-message");

/* EVENT LISTENERS */
/*
   When the user clicks the Search button, we call getWeather().
*/

searchButton.addEventListener("click", getWeather);

/*Allow the user to press ENTER instead of clicking Search. keydown fires whenever a key is pressed.
*/

cityInput.addEventListener("keydown", function (event) {
    /*
       Check whether the pressed key was Enter.
    */

    if (event.key === "Enter") {        // .key is a property that returns the key that was pressed
        getWeather();
    }

});

/* MAIN WEATHER FUNCTION */
/* =========================================================
   GET WEATHER
   ---------------------------------------------------------
   This function:

   1. Gets the city entered by the user
   2. Finds its latitude and longitude
   3. Requests current weather data
   4. Extracts the required weather information
   5. Displays everything on the webpage
   ========================================================= */

async function getWeather() 
{

    // Get user input
    const city = cityInput.value.trim();

    /*
       Don't make an API request if the user didn't
       enter anything.
    */

    if (!city) {
        showError("Please enter a city name.");
        return;

    }

    // START LOADING
    showLoading();      // show the loading spinner when a search is started

    hideError();          // hide the error message when a new search is started

    /*
       try/catch handles possible API or JavaScript errors.
    */

    try {
        /*GEOCODING API*/

        /*
           Convert city name into:

           latitude
           longitude
           country
           location name
        */

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;

        const geoResponse = await fetch(geoUrl);

        /*
           Check whether the request was successful.
        */

        if (!geoResponse.ok) {
            throw new Error(
                "Unable to connect to the location service."
            );

        }
        const geoData = await geoResponse.json();

        // CHECK IF CORRECT INPUT HAS BEEN ENTERED
        if (!geoData.results || geoData.results.length === 0) 
        {
            throw new Error(
                `We couldn't find "${city}". Please check the spelling and try again.`
            );

        }

        // GET LOCATION
        const location = geoData.results[0];

        const latitude = location.latitude;

        const longitude = location.longitude;

        const country = location.country;

        const locationName = location.name;

        // WEATHER API
        /*
           Here we request several CURRENT weather variables.

           current= means:
           "Give me the current value of these variables."

           timezone=auto means:
           "Return the time according to the searched
            location's timezone."
        */

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,precipitation,wind_speed_10m,wind_direction_10m,is_day` +
            `&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        /*
           Check whether weather request succeeded.
        */

        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to retrieve weather data right now."
            );

        }



        /*
           Convert response to JSON.
        */

        const weatherData =
            await weatherResponse.json();



        /* =================================================
           CHECK CURRENT WEATHER DATA
           ================================================= */

        if (!weatherData.current) {

            throw new Error(
                "Current weather information is unavailable."
            );

        }



        /* =================================================
           GET CURRENT WEATHER OBJECT
           ================================================= */

        const currentWeather =
            weatherData.current;



        /* =================================================
           EXTRACT WEATHER VALUES
           ================================================= */

        /*
           Current temperature
        */

        const temperature =
            currentWeather.temperature_2m;

        
        const feelsLike =
            currentWeather.apparent_temperature;

        /*
           Relative humidity
        */

        const humidity = currentWeather.relative_humidity_2m;

        /*
           Wind speed
        */

        const windSpeed =
            currentWeather.wind_speed_10m;

        /*
           Wind direction in degrees.

           Example:

           0°   = North
           90°  = East
           180° = South
           270° = West
        */

        const windDirection =
            currentWeather.wind_direction_10m;

        /*
           Precipitation in millimetres.
        */

        const precipitation =
            currentWeather.precipitation;

        /*
           Percentage of cloud cover.
        */

        const cloudCover =
            currentWeather.cloud_cover;

        /*
           Weather code.
        */

        const weatherCode =
            currentWeather.weather_code;



        /*
           is_day:

           1 = daytime
           0 = nighttime
        */

        const isDay =
            currentWeather.is_day;



        /* =================================================
           GET WEATHER CONDITION + IMAGE
           ================================================= */

        const weatherInfo =
            weatherCodeMap[weatherCode];



        /*
           If we don't recognize the weather code,
           use a safe fallback.
        */

        const weatherCondition =
            weatherInfo
                ? weatherInfo[0]
                : "Unknown";



        const weatherImagePath =
            weatherInfo
                ? weatherInfo[1]
                : "";



        /* =================================================
           DISPLAY LOCATION
           ================================================= */

        if (
            country &&
            locationName !== country
        ) {

            cityElement.textContent =
                `${locationName}, ${country}`;

        } else {

            cityElement.textContent =
                locationName;

        }



        /* =================================================
           DISPLAY MAIN WEATHER
           ================================================= */

        temperatureElement.textContent =
            temperature;



        weatherConditionElement.textContent =
            weatherCondition;



        /* =================================================
           DISPLAY WEATHER IMAGE
           ================================================= */

        if (weatherImagePath) {

            weatherImage.src =
                weatherImagePath;

        }



        /*
           Update the image's alt text dynamically.

           This is better for accessibility than always
           having:

           alt="Weather condition"
        */

        weatherImage.alt =
            weatherCondition;



        /* =================================================
           DISPLAY WEATHER DETAILS
           ================================================= */

        /*
           Wind speed
        */

        windSpeedElement.textContent =
            windSpeed;



        /*
           Humidity
        */

        humidityElement.textContent =
            humidity;



        /*
           Feels-like temperature
        */

        feelsLikeElement.textContent =
            feelsLike;



        /*
           Wind direction
        */

        document.getElementById(
            "wind-direction"
        ).textContent =
            getWindDirectionName(windDirection);



        /*
           Wind direction in degrees

           Example:

           NE (45°)
        */

        document.getElementById(
            "wind-direction-degree"
        ).textContent =
            `${Math.round(windDirection)}°`;



        /*
           Precipitation
        */

        document.getElementById(
            "precipitation"
        ).textContent =
            precipitation;



        /*
           Cloud cover
        */

        document.getElementById(
            "cloud-cover"
        ).textContent =
            cloudCover;



        /* =================================================
           DISPLAY DATE
           ================================================= */

        /*
           Open-Meteo gives us the timezone of the searched
           location.        */

        const today =
            new Date();

        const formattedDate =
            today.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

        dateElement.textContent =
            formattedDate;

        /* =================================================
           DAY / NIGHT
           ================================================= */

        /*
           Change the text below the condition depending
           on whether it is currently day or night.

           We will improve this UI later.
        */

        if (isDay === 1) {

            dateElement.textContent +=
                " • Daytime";

        } else {

            dateElement.textContent +=
                " • Nighttime";

        }



    } catch (error) {


        /* =================================================
           ERROR HANDLING
           ================================================= */

        console.error(
            "Weather App Error:",
            error
        );



        showError(
            error.message ||
            "Something went wrong. Please try again."
        );



    } finally {


        /* =================================================
           STOP LOADING
           ================================================= */

        hideLoading();

    }

}

/* CONVERT WIND DIRECTION DEGREES INTO A COMPASS DIRECTION
   

   0°   → N
   45°  → NE
   90°  → E
   135° → SE
   180° → S
   225° → SW
   270° → W
   315° → NW

   Instead of showing only: 45° we'll show: NE and then display: 45° next to it.
   ========================================================= */

function getWindDirectionName(degrees) {
    /*
       Array containing the eight major compass directions.
    */

    const directions = ["N","NE","E","SE","S","SW","W","NW"];

    /*
       Each compass direction covers 45 degrees.

       Adding 22.5 makes the boundaries line up correctly.

       Math.floor() gives us the appropriate array index.
    */

    const index = Math.floor((degrees + 22.5) / 45) % 8;
    /*
       Return the appropriate direction.
    */

    return directions[index];

}

/* =========================================================
   LOADING FUNCTIONS
   ========================================================= */

/*
   Show the loading spinner.
*/

function showLoading() {
    /*
       Bootstrap's "d-none" class hides an element.
       Remove it to make the loading section visible.
    */

    loadingElement.classList.remove("d-none");

    /*
       Disable the Search button while the request is
       running.
       This prevents accidental repeated API requests.
    */

    searchButton.disabled = true;

    /*
       Change the button text so the user knows what
       is happening.
    */

    searchButton.textContent = "Searching...";

}

/*
   Hide the loading spinner.
*/

function hideLoading() {

    /*
       Add Bootstrap's d-none class again.
    */

    loadingElement.classList.add("d-none");

    /*
       Re-enable Search button.
    */
    searchButton.disabled = false;

    /*
       Restore original button text.
    */

    searchButton.textContent = "Search";

}

/* ERROR FUNCTIONS */

/*
   Display an error message.
*/

function showError(message) {

    /*
       Put the message inside the Bootstrap alert.
    */

    errorElement.textContent = message;

    /*
       Remove d-none so the alert becomes visible.
    */
    errorElement.classList.remove("d-none");

}

/*
   Hide an existing error message.
*/

function hideError() {

    errorElement.classList.add("d-none");

}

/* * *********************************************************/


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

