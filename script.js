function getWeather(cityName = null) {
  let city = cityName || document.getElementById("cityInput").value;
  city = city.trim().toLowerCase(); // lowercase and remove extra spaces

  const apiKey = "a3b844712f6b388574ac3732c97747d1";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const name = data.name;
      const temp = data.main.temp;
      const weather = data.weather[0].description;
      const main = data.weather[0].main.toLowerCase();

      // Set background image based on weather
      let bg = 'default.jpg';
      if (main.includes("rain")) bg = 'rain.jpg';
      else if (main.includes("cloud")) bg = 'cloud.jpeg';
      else if (main.includes("clear")) bg = 'sunny.jpg';
      else if (main.includes("snow")) bg = 'snow.jpg';

      document.body.style.backgroundImage = `url('${bg}')`;

      let advice = "";
      if (weather.includes("rain")) advice = "☔ Don't forget your umbrella!";
      else if (weather.includes("clear")) advice = "😎 It’s sunny, wear sunglasses!";
      else if (weather.includes("cloud")) advice = "☁️ Looks cloudy, carry a light jacket.";
      else if (temp > 35) advice = "🔥 It's hot! Stay hydrated.";
      else if (temp < 10) advice = "🧥 It's cold! Wear a jacket.";
      else advice = "🌈 Have a great day!";

      document.getElementById("weatherResult").innerHTML =
        `🌍 City: ${name}<br>🌡 Temperature: ${temp}°C<br>🌥 Weather: ${weather}<br><br>💡 <strong>Suggestion:</strong> ${advice}`;
    })
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = "City not found 😢";
    });
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "a3b844712f6b388574ac3732c97747d1";

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => getWeather(data.name));
    });
  } else {
    alert("Geolocation not supported by your browser.");
  }
}

function startVoiceInput() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function(event) {
    const citySpoken = event.results[0][0].transcript;
    document.getElementById("cityInput").value = citySpoken;
    getWeather(citySpoken);
  };

  recognition.onerror = function(event) {
    alert("Voice recognition error: " + event.error);
  };
}
