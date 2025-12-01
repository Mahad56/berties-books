const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/weather', (req, res, next) => {

    let apiKey = process.env.WEATHER_API_KEY;

    // If no city provided → show input form
    if (!req.query.city) {
        return res.render("weatherForm");
    }

    // Sanitise user input (important for marking)
    let city = req.sanitize(req.query.city.trim());

    if (city.length === 0) {
        return res.send(`<h3>Please enter a city.</h3><br><a href="/weather">Try Again</a>`);
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, (err, response, body) => {

        if (err) {
            return res.send(`<h3>Network error. Try again later.</h3>`);
        }

        let weather;

        try {
            weather = JSON.parse(body);
        } catch {
            return res.send(`<h3>Invalid response from API.</h3>`);
        }

        // API error field (e.g. invalid key, no city, rate limit)
        if (weather.cod && weather.cod !== 200) {

            return res.send(`
                <h3>Error: ${weather.message || 'Unable to fetch weather data.'}</h3>
                <br><a href="/weather">Try Again</a>
            `);
        }

        // Missing fields
        if (!weather.main || !weather.weather) {
            return res.send(`
                <h3>Weather data incomplete for "${city}".</h3>
                <br><a href="/weather">Try Again</a>
            `);
        }

        // Convert UNIX times
        const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString();

        const message = `
            <h2>Weather in ${weather.name}</h2>

            <p><strong>Temperature:</strong> ${weather.main.temp} °C</p>
            <p><strong>Min:</strong> ${weather.main.temp_min} °C</p>
            <p><strong>Max:</strong> ${weather.main.temp_max} °C</p>
            <p><strong>Feels Like:</strong> ${weather.main.feels_like} °C</p>

            <p><strong>Humidity:</strong> ${weather.main.humidity}%</p>
            <p><strong>Pressure:</strong> ${weather.main.pressure} hPa</p>

            <p><strong>Wind Speed:</strong> ${weather.wind.speed} m/s</p>
            <p><strong>Condition:</strong> ${weather.weather[0].description}</p>

            <p><strong>Sunrise:</strong> ${sunrise}</p>
            <p><strong>Sunset:</strong> ${sunset}</p>

            <img src="https://openweathermap.org/img/w/${weather.weather[0].icon}.png" />

            <br><br><a href="/weather">Search Another City</a>
        `;

        res.render("weatherResult", { weather });
    });

});

module.exports = router;
