function getWeather(cityName = null) {
  let city = cityName || document.getElementById("cityInput").value;
  city = city.trim().toLowerCase();

  const apiKey = "8a34dd1f054d4133880191014252406"; // ✅ Your WeatherAPI key

  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
    .then(response => {
      if (!response.ok) throw new Error("Location not found");
      return response.json();
    })
    .then(data => {
      const name = data.location.name;
      const region = data.location.region;
      const country = data.location.country;
      const temp = data.current.temp_c;
     const condition = data.current.condition.text
         .toLowerCase()
         .split(' ')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ');


      // Set background
      let bg = 'default.jpg';
      if (condition.includes("Rain")) bg = 'rain.jpg';
      else if (condition.includes("Cloud")) bg = 'cloud.jpeg';
      else if (condition.includes("Sun") || condition.includes("clear")) bg = 'sunny.jpg';
      else if (condition.includes("Snow")) bg = 'snow.jpg';

      document.body.style.backgroundImage = `url('${bg}')`;

      // Local suggestion
      let advice = "";
      if (condition.includes("Rain")) advice = "☔ Don't forget your umbrella!";
      else if (condition.includes("Sun")) advice = "😎 It’s sunny, wear sunglasses!";
      else if (condition.includes("Cloud")) advice = "☁️ Looks cloudy, carry a light jacket.";
      else if (temp > 35) advice = "🔥 It's hot! Stay hydrated.";
      else if (temp < 10) advice = "🧥 It's cold! Wear a jacket.";
      else advice = "🌈 Have a great day!";

      // Show result
      document.getElementById("weatherResult").innerHTML =
        `📍 Location: ${name}, ${region}, ${country}<br>
         🌡 Temperature: ${temp}°C<br>
         🌥 Condition: ${condition}<br><br>
         💡 <strong>Suggestion:</strong> ${advice}`;
    })
    .catch(error => {
      document.getElementById("weatherResult").innerHTML = "❗ Location not found. Try again.";
    });
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "8a34dd1f054d4133880191014252406"; // ✅ Your WeatherAPI key

      fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`)
        .then(response => response.json())
        .then(data => getWeather(data.location.name));
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
