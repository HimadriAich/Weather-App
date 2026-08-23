# 🌤️ SkyScan - Weather App

SkyScan is a responsive weather application built using **HTML, CSS, JavaScript, and Bootstrap**. It uses the **Open-Meteo APIs** to fetch real-time weather information and a 7-day forecast for cities around the world.

The project started as a simple weather app and was gradually enhanced with a responsive UI, dynamic weather backgrounds, location detection, multiple-city search, detailed weather information, and a 7-day forecast.

---

## 🚀 Features

- 🔍 Search weather by city name
- 📍 Get weather using your current location
- 🌍 Handle multiple locations with the same city name
- 🌡️ Display current temperature
- 🥵 Display feels-like temperature
- 💧 Display humidity
- 💨 Display wind speed
- 🧭 Display wind direction
- 🌧️ Display precipitation
- ☁️ Display cloud cover
- ☀️ Detect day/night
- 🌤️ Dynamic weather icons
- 🎨 Dynamic background based on weather conditions
- 📅 7-day weather forecast
- ⏳ Loading indicator while fetching data
- ❌ User-friendly error messages
- 📱 Responsive design for desktop, tablet, and mobile
- ⌨️ Search using the Enter key

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.8

### APIs

- Open-Meteo Weather Forecast API
- Open-Meteo Geocoding API

### Browser APIs

- Geolocation API
- Fetch API

---

## 📂 Project Structure

```text
SkyScan/
│
├── index.html              # Main HTML structure
├── style.css               # Custom styling and responsive design
├── script.js               # Weather API logic and application functionality
│
├── weather-app.png             # Website favicon
│
├── sun.png                 # Clear weather icon
├── cloudy.png              # Partly cloudy icon
├── overcast.png            # Overcast weather icon
├── fog.png                 # Fog icon
├── rain.png                 # Rain icon
├── snow.png                 # Snow icon
└── thunderstorm.png        # Thunderstorm icon
```

---

## 🌐 APIs Used

### Open-Meteo Geocoding API

The Geocoding API converts a city name entered by the user into geographic coordinates such as:

- Latitude
- Longitude
- Country
- Location name

These coordinates are then used to request weather information.

### Open-Meteo Weather API

The Weather API provides the actual weather information for the selected location.

SkyScan currently uses data such as:

- Temperature
- Apparent temperature
- Relative humidity
- Weather code
- Cloud cover
- Precipitation
- Wind speed
- Wind direction
- Day/night status
- Daily maximum temperature
- Daily minimum temperature

---

## ⚙️ How It Works

The application follows this basic flow:

```text
User enters a city
        ↓
Open-Meteo Geocoding API
        ↓
Latitude + Longitude
        ↓
Open-Meteo Weather API
        ↓
Current Weather + 7-Day Forecast
        ↓
JavaScript processes the response
        ↓
Weather information displayed in the UI
```

For the **Use My Location** feature:

```text
User clicks "Use My Location"
        ↓
Browser Geolocation API
        ↓
Latitude + Longitude
        ↓
Open-Meteo Weather API
        ↓
Weather information displayed
```

---

## 🎨 UI & Design

SkyScan uses **Bootstrap** for the responsive layout and custom CSS for additional styling.

Some of the UI features include:

- Responsive Bootstrap grid
- Weather detail cards
- Hover animations
- Responsive mobile layout
- Dynamic weather backgrounds
- Weather-specific icons
- Loading spinner
- Error alerts
- Multiple-location results
- 7-day forecast cards

The background changes depending on the current weather condition.

For example:

```text
Clear Day       → Bright gradient
Clear Night     → Dark night gradient
Cloudy          → Gray gradient
Rain            → Blue/dark gradient
Snow            → Cool snowy gradient
Thunderstorm    → Dark storm gradient
Fog             → Gray gradient
```

---

## 📱 Responsive Design

SkyScan is designed to work across different screen sizes.

### Desktop

The weather information is displayed inside a centered weather card with a multi-column layout.

### Mobile

The layout automatically adapts to smaller screens using Bootstrap's responsive grid and custom media queries.

---

## 🔎 Multiple City Search

Sometimes multiple cities can have the same name.

For example, searching for:

```text
Springfield
```

may return multiple locations.

Instead of automatically choosing the first result, SkyScan displays the available matching locations so the user can select the correct one.

---

## 📍 Location Detection

SkyScan can also use the browser's built-in Geolocation API.

When the user clicks:

```text
📍 Use My Location
```

the browser requests permission to access the user's location.

If permission is granted, the latitude and longitude are sent to Open-Meteo to retrieve the weather.

> Note: Browser location access may require permission and generally works best when the application is served through a local development server or HTTPS.

---

## ⏳ Error & Loading Handling

The application includes basic error handling for situations such as:

- Empty city search
- City not found
- API connection failure
- Weather data unavailable
- Location permission denied
- Browser not supporting geolocation

While an API request is running:

- A loading spinner is displayed
- The Search button is disabled
- The location button is disabled
- The user is shown a "Searching..." state

---

## 🖥️ Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/HimadriAich/Weather-App.git
```

### 2. Navigate into the project

```bash
cd Weather-App
```

### 3. Open the project

You can open the project using **VS Code**.

For the best development experience, use the **Live Server** extension or another local development server.

Then open the local URL provided by the server in your browser.

---

## 📦 No API Key Required

One of the advantages of this project is that it uses **Open-Meteo**, so no API key is required for the current implementation.

This makes the project simple to set up and suitable for learning frontend API integration.

---

## 🧠 What I Learned

This project helped me practice several important frontend development concepts.

### HTML

- Semantic HTML structure
- Forms and input elements
- Bootstrap components
- Responsive layouts

### CSS

- CSS gradients
- Flexbox
- Responsive media queries
- Transitions and hover effects
- Dynamic page themes
- Card-based UI design

### JavaScript

- DOM manipulation
- Event listeners
- Functions
- Objects and arrays
- `async/await`
- `fetch()`
- Promises
- API requests
- JSON data handling
- Error handling with `try/catch`
- Dynamic HTML generation
- Browser Geolocation API
- Template literals
- Conditional logic

### API Integration

I learned how to:

1. Take user input
2. Send it to a Geocoding API
3. Extract latitude and longitude
4. Use those coordinates with a Weather API
5. Process the JSON response
6. Display the information dynamically on a webpage

---

## 🔮 Future Improvements

Some features that could be added in future versions:

- ⭐ Favorite cities
- 🕐 Hourly weather forecast
- 🌅 Sunrise and sunset times
- 🌡️ Temperature unit toggle (°C / °F)
- 🌙 More advanced day/night themes
- 📊 Weather charts
- 🔄 Auto-refresh weather data
- 🕘 Recently searched cities
- 🔔 Severe weather alerts
- 🌐 More language options
- 💾 Save favorite locations using Local Storage
- 🎨 Improved animations and transitions

---

## 👨‍💻 Author

**Himadri Aich**

This project was created as a frontend development project to practice working with APIs, JavaScript, responsive UI design, and Bootstrap.

---

## 📄 License

This project is open-source and available for educational and learning purposes.

---

## 🙏 Acknowledgements

- [Open-Meteo](https://open-meteo.com/) for providing the weather and geocoding APIs.
- [Bootstrap](https://getbootstrap.com/) for the responsive UI framework.






