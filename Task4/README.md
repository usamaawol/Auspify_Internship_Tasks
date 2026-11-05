# WeatherNow — Current Weather App

**Internship Task 4** is a responsive weather lookup page that finds a city and displays its current conditions using the public Open-Meteo geocoding and forecast APIs.

## Project overview

WeatherNow lets a visitor enter a city name and see a current-weather summary for a matching location. It solves the small but practical problem of turning a city search into readable local conditions without requiring an account or an API key.

The app runs entirely in the browser. It first resolves the city to coordinates, then requests the forecast for those coordinates. The page identifies Open-Meteo as its data source and notes that weather can differ from local observations.

## Objectives

- Build a responsive search-to-result experience using browser APIs.
- Practice asynchronous JavaScript, `fetch`, and JSON response handling.
- Convert API weather codes and wind direction into readable UI values.
- Communicate loading, success, and error states accessibly.

## Features and functionality

- **City search:** A required text field accepts a city name up to 100 characters.
- **Geocoding:** Searches Open-Meteo's geocoding endpoint and prefers an exact case-insensitive name match among returned results; otherwise, it uses the first result.
- **Current conditions:** Requests temperature, apparent temperature, humidity, day/night, weather code, wind speed, and wind direction.
- **Readable weather summary:** Displays location details, local observation time, temperature in Celsius, “feels like” temperature, humidity, wind speed, and compass direction.
- **Weather code mapping:** `getWeatherInfo()` maps common Open-Meteo codes to descriptions and emoji icons. Clear-sky icons account for the API's day/night value.
- **Status and errors:** The search button is disabled and changes to “Searching...” while requests run. The status region reports progress, success, or a helpful error.
- **Responsive result card:** Weather details display in a three-column row on wider layouts and a stacked layout on narrow screens.

The app presents current conditions only; it does not include forecasts, saved locations, geolocation, a map, or severe-weather alerts.

## Technologies and external data

| Technology/service | Use |
|---|---|
| HTML5 | Search form, result structure, status region, and footer |
| CSS3 | Weather-card design, responsive layout, and focus styling |
| Vanilla JavaScript | Form handling, API requests, code conversion, and DOM updates |
| Open-Meteo Geocoding API | City-name lookup and coordinates |
| Open-Meteo Forecast API | Current weather variables |

The requests use `fetch` from the client. No API key, server, database, or third-party JavaScript library is configured. A working internet connection is required for live results.

## Architecture and data flow

The page structure lives in `index.html`, visual rules in `style.css`, and all behavior in `script.js`. The script selects the form and output elements, then handles the flow:

1. Trim and validate the entered city.
2. Call `findCity(city)` and select a matching result.
3. Pass its latitude and longitude to `getWeather(latitude, longitude)`.
4. Pass both responses to `displayWeather(place, data)`.
5. Format fields and reveal the previously hidden result section.

Network and response errors are thrown from the request helpers and caught by the form handler, which displays a status message and restores the search button in `finally`.

```text
Task4/
├── index.html
├── script.js
├── style.css
└── README.md
```

### Data presentation helpers

- `getWeatherInfo(code, isDay)` maps code groups such as fog, drizzle, rain, snow, and thunderstorm to labels and icons.
- `getCompassDirection(degrees)` rounds wind bearing to one of eight compass directions and returns `N/A` for a non-finite value.
- `displayWeather(place, data)` safely assigns API-derived strings to text content, rounds temperatures, formats wind speed, and formats the API timestamp using the returned timezone.

The UI uses `textContent` for response values rather than treating API strings as markup.

## UI and responsive design

The interface uses a restrained blue and slate palette, a centered content width, a prominent search area, and a white current-weather card with a large temperature and icon. Humidity, wind speed, and wind direction are presented in smaller detail cards. Focus outlines are visible for keyboard users, and reduced-motion preferences disable transitions.

Below 520px, the form stacks vertically, the result heading and date stack, and weather details become compact rows. No separate mobile application or navigation is needed.

## How to see/open the project
The page can be opened directly as `index.html`; use the server when testing the site at a consistent browser origin.

## How to use

1. Enter a city, for example **Addis Ababa**.
2. Select **Search** and wait for the progress message to finish.
3. Review the resolved location, local time, current conditions, and detail cards.
4. Search another city to replace the displayed result.
5. Try an unknown city or disconnect from the network to observe the error message.

## Testing and verification

No automated test or build scripts are included. Manual checks:

- Search a known city and check that all fields appear.
- Search a name that may match multiple locations and verify a valid result is selected.
- Search an unrecognized name to check the “City not found” error.
- Inspect that the button is disabled while a request is in progress and re-enabled afterward.
- Check temperature, wind-speed formatting, compass conversion, and local time display.
- Test with a narrow viewport and verify the result cards stack.
- Use browser developer tools to inspect failed network requests if live data does not load.

## Challenges and implementation decisions

- **City names need coordinates before a forecast request:** The app separates geocoding and forecast requests so the second request uses the selected place's latitude/longitude.
- **API responses can fail or be empty:** The helpers check HTTP status and required result fields; the submit handler turns failures into visible status text.
- **Weather codes are not user-facing descriptions:** A local mapping function converts common codes into short labels and icons.
- **Location time differs from the visitor's time:** The forecast response's timezone is used when formatting the current observation timestamp.

## Learning outcomes

The project demonstrates asynchronous `fetch`, URL query construction with `URLSearchParams`, API response validation, chained requests, `try/catch/finally`, conditional rendering, and data formatting. It also illustrates that an external API dependency introduces network availability and response-shape considerations even when no backend is present.

## Future improvements

- Add a multi-day forecast or recently searched cities.
- Add geolocation only with a clear permission explanation and fallback.
- Add request cancellation or stale-response handling for rapid repeated searches.
- Add automated tests for weather-code mapping and compass conversion.
- Add caching or stronger validation if usage grows.

## Conclusion

WeatherNow is a small API-driven application that connects a city-name search to current weather data and presents the result in a clear responsive interface. Its two-step API flow is a practical example of integrating public data into a vanilla JavaScript frontend.
