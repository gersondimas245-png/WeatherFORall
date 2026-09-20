/* =====================================================
   ELEMENTS
===================================================== */

const cityInput =
    document.getElementById("cityInput");

const searchButton =
    document.getElementById("searchButton");

const searchResults =
    document.getElementById("searchResults");

const message =
    document.getElementById("message");

const weatherContent =
    document.getElementById("weatherContent");

const themeButton =
    document.getElementById("themeButton");


/* =====================================================
   WEATHER CODE INFORMATION
===================================================== */

const weatherCodes = {

    0: {
        text: "Clear sky",
        icon: "☀️"
    },

    1: {
        text: "Mainly clear",
        icon: "🌤️"
    },

    2: {
        text: "Partly cloudy",
        icon: "⛅"
    },

    3: {
        text: "Cloudy",
        icon: "☁️"
    },

    45: {
        text: "Fog",
        icon: "🌫️"
    },

    48: {
        text: "Fog",
        icon: "🌫️"
    },

    51: {
        text: "Light drizzle",
        icon: "🌦️"
    },

    53: {
        text: "Drizzle",
        icon: "🌦️"
    },

    55: {
        text: "Heavy drizzle",
        icon: "🌧️"
    },

    61: {
        text: "Light rain",
        icon: "🌦️"
    },

    63: {
        text: "Rain",
        icon: "🌧️"
    },

    65: {
        text: "Heavy rain",
        icon: "🌧️"
    },

    71: {
        text: "Light snow",
        icon: "🌨️"
    },

    73: {
        text: "Snow",
        icon: "❄️"
    },

    75: {
        text: "Heavy snow",
        icon: "❄️"
    },

    80: {
        text: "Rain showers",
        icon: "🌦️"
    },

    81: {
        text: "Rain showers",
        icon: "🌧️"
    },

    82: {
        text: "Heavy showers",
        icon: "⛈️"
    },

    95: {
        text: "Thunderstorm",
        icon: "⛈️"
    },

    96: {
        text: "Thunderstorm with hail",
        icon: "⛈️"
    },

    99: {
        text: "Severe thunderstorm",
        icon: "⛈️"
    }

};


/* =====================================================
   GET WEATHER INFORMATION
===================================================== */

function getWeatherInfo(code) {

    return (
        weatherCodes[code] ||
        {
            text: "Weather unavailable",
            icon: "🌡️"
        }
    );

}


/* =====================================================
   CITY SEARCH
===================================================== */

async function searchCities() {

    const city =
        cityInput.value.trim();


    if (city.length < 2) {

        searchResults.innerHTML = "";

        return;

    }


    try {

        const url =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" +
            encodeURIComponent(city) +
            "&count=8" +
            "&language=en" +
            "&format=json";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Could not search for the city."
            );

        }


        const data =
            await response.json();


        displayCityResults(
            data.results || []
        );

    }

    catch (error) {

        console.error(error);

        searchResults.innerHTML =
            "<div class='search-result'>Unable to search cities.</div>";

    }

}


/* =====================================================
   DISPLAY SEARCH RESULTS
===================================================== */

function displayCityResults(cities) {

    searchResults.innerHTML = "";


    if (cities.length === 0) {

        searchResults.innerHTML = `

            <div class="search-result">
                No city found
            </div>

        `;

        return;

    }


    cities.forEach(function (city) {

        const item =
            document.createElement("div");


        item.className =
            "search-result";


        const region =
            city.admin1
                ? `${city.admin1}, `
                : "";


        item.innerHTML = `

            <strong>
                ${city.name}
            </strong>

            <span>
                ${region}${city.country}
            </span>

        `;


        item.addEventListener(
            "click",
            function () {

                selectCity(city);

            }
        );


        searchResults.appendChild(
            item
        );

    });

}


/* =====================================================
   SELECT CITY
===================================================== */

function selectCity(city) {

    cityInput.value =
        city.name;


    searchResults.innerHTML = "";


    getWeather(city);

}


/* =====================================================
   GET WEATHER
===================================================== */

async function getWeather(city) {

    showLoading();


    try {

        const latitude =
            city.latitude;

        const longitude =
            city.longitude;


        const weatherUrl =

            "https://api.open-meteo.com/v1/forecast" +

            `?latitude=${latitude}` +

            `&longitude=${longitude}` +

            "&current=" +

            "temperature_2m," +
            "relative_humidity_2m," +
            "apparent_temperature," +
            "precipitation," +
            "weather_code," +
            "wind_speed_10m," +
            "wind_direction_10m" +

            "&hourly=" +

            "temperature_2m," +
            "weather_code," +
            "precipitation_probability" +

            "&daily=" +

            "weather_code," +
            "temperature_2m_max," +
            "temperature_2m_min," +
            "precipitation_probability_max" +

            "&timezone=auto" +

            "&forecast_days=7";


        const response =
            await fetch(weatherUrl);


        if (!response.ok) {

            throw new Error(
                "Could not get weather."
            );

        }


        const weather =
            await response.json();


        displayCurrentWeather(
            city,
            weather
        );


        displayHourlyForecast(
            weather
        );


        displayDailyForecast(
            weather
        );


        message.classList.add(
            "hidden"
        );


        weatherContent.classList.remove(
            "hidden"
        );

    }

    catch (error) {

        console.error(error);


        weatherContent.classList.add(
            "hidden"
        );


        message.classList.remove(
            "hidden"
        );


        message.textContent =
            "Weather information could not be loaded. Please try again.";

    }

}


/* =====================================================
   CURRENT WEATHER
===================================================== */

function displayCurrentWeather(
    city,
    weather
) {

    const current =
        weather.current;


    const info =
        getWeatherInfo(
            current.weather_code
        );


    document.getElementById(
        "cityName"
    ).textContent =
        city.name;


    const region =
        city.admin1
            ? `${city.admin1}, `
            : "";


    document.getElementById(
        "locationText"
    ).textContent =
        `${region}${city.country}`;


    document.getElementById(
        "temperature"
    ).textContent =
        Math.round(
            current.temperature_2m
        );


    document.getElementById(
        "weatherIcon"
    ).textContent =
        info.icon;


    document.getElementById(
        "weatherDescription"
    ).textContent =
        info.text;


    document.getElementById(
        "feelsLike"
    ).textContent =
        Math.round(
            current.apparent_temperature
        );


    document.getElementById(
        "humidity"
    ).textContent =
        `${current.relative_humidity_2m}%`;


    document.getElementById(
        "windSpeed"
    ).textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    document.getElementById(
        "precipitation"
    ).textContent =
        `${current.precipitation} mm`;


    document.getElementById(
        "windDirection"
    ).textContent =
        `${Math.round(
            current.wind_direction_10m
        )}°`;


    const date =
        new Date(current.time);


    document.getElementById(
        "currentTime"
    ).textContent =
        "Local time: " +
        date.toLocaleString(
            [],
            {
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =====================================================
   HOURLY FORECAST
===================================================== */

function displayHourlyForecast(
    weather
) {

    const container =
        document.getElementById(
            "hourlyForecast"
        );


    container.innerHTML = "";


    const currentTime =
        new Date(
            weather.current.time
        );


    let added =
        0;


    weather.hourly.time.forEach(
        function (time, index) {

            const date =
                new Date(time);


            if (
                date >= currentTime &&
                added < 12
            ) {

                const info =
                    getWeatherInfo(
                        weather.hourly
                            .weather_code[index]
                    );


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "hour-card";


                card.innerHTML = `

                    <p class="time">

                        ${
                            added === 0
                                ? "Now"
                                : date.toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }
                                )
                        }

                    </p>


                    <div class="icon">

                        ${info.icon}

                    </div>


                    <strong>

                        ${Math.round(
                            weather.hourly
                                .temperature_2m[index]
                        )}°

                    </strong>


                    <p class="time">

                        💧 ${
                            weather.hourly
                                .precipitation_probability[index]
                        }%

                    </p>

                `;


                container.appendChild(
                    card
                );


                added++;

            }

        }
    );

}


/* =====================================================
   DAILY FORECAST
===================================================== */

function displayDailyForecast(
    weather
) {

    const container =
        document.getElementById(
            "dailyForecast"
        );


    container.innerHTML = "";


    weather.daily.time.forEach(
        function (time, index) {

            const date =
                new Date(
                    time + "T12:00:00"
                );


            const info =
                getWeatherInfo(
                    weather.daily
                        .weather_code[index]
                );


            const dayName =
                index === 0
                    ? "Today"
                    : date.toLocaleDateString(
                        [],
                        {
                            weekday: "long"
                        }
                    );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "daily-card";


            card.innerHTML = `

                <strong>

                    ${dayName}

                </strong>


                <div class="daily-icon">

                    ${info.icon}

                </div>


                <div class="daily-description">

                    ${info.text}

                    <br>

                    💧 ${
                        weather.daily
                            .precipitation_probability_max[index]
                    }%

                </div>


                <div class="daily-temperature">

                    ${Math.round(
                        weather.daily
                            .temperature_2m_max[index]
                    )}°

                    /

                    ${Math.round(
                        weather.daily
                            .temperature_2m_min[index]
                    )}°

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   LOADING
===================================================== */

function showLoading() {

    weatherContent.classList.add(
        "hidden"
    );


    message.classList.remove(
        "hidden"
    );


    message.textContent =
        "Loading weather...";

}


/* =====================================================
   SEARCH BUTTON
===================================================== */

searchButton.addEventListener(
    "click",
    searchCities
);


/* =====================================================
   SEARCH WHILE TYPING
===================================================== */

let searchTimer;


cityInput.addEventListener(
    "input",
    function () {

        clearTimeout(
            searchTimer
        );


        searchTimer =
            setTimeout(
                searchCities,
                400
            );

    }
);


/* =====================================================
   ENTER KEY
===================================================== */

cityInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchCities();

        }

    }
);


/* =====================================================
   CLOSE RESULTS
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".search-section"
            )
        ) {

            searchResults.innerHTML =
                "";

        }

    }
);


/* =====================================================
   DARK MODE
===================================================== */

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            themeButton.textContent =
                "☀️";

        }

        else {

            themeButton.textContent =
                "🌙";

        }

    }
);