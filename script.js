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
      const condition = data.current.condition.text.toLowerCase();

      // Set background
      let bg = 'default.jpg';
      if (condition.includes("rain")) bg = 'rain.jpg';
      else if (condition.includes("cloud")) bg = 'cloud.jpeg';
      else if (condition.includes("sun") || condition.includes("clear")) bg = 'sunny.jpg';
      else if (condition.includes("snow")) bg = 'snow.jpg';

      document.body.style.backgroundImage = `url('${bg}')`;

      // Local suggestion
      let advice = "";
      if (condition.includes("rain")) advice = "☔ Don't forget your umbrella!";
      else if (condition.includes("sun")) advice = "😎 It’s sunny, wear sunglasses!";
      else if (condition.includes("cloud")) advice = "☁️ Looks cloudy, carry a light jacket.";
      else if (temp > 35) advice = "🔥 It's hot! Stay hydrated.";
      else if (temp < 10) advice = "🧥 It's cold! Wear a jacket.";
      else advice = "🌈 Have a great day!";

      // Show result
      document.getElementById("weatherResult").innerHTML =
        `📍 Location: ${name}, ${region}, ${country}<br>
         🌡 Temperature: ${temp}°C<br>
         🌥 Condition: ${condition}<br><br>
         💡 <strong>Suggestion:</strong> ${advice}`;

      // 🧠 GPT Suggestion (AI)
      getAISuggestion(temp, condition).then(aiAdvice => {
        document.getElementById("weatherResult").innerHTML +=
          `<br><br>🧠 <strong>GPT Suggestion:</strong> ${aiAdvice}`;
      });
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

// ✅ GPT suggestion function (calls your Replit backend)
async function getAISuggestion(temp, weather) {
  console.log("🚀 Sending GPT request with:", temp, weather);
  const response = await fetch("https://708573c4-e2df-41bf-a28d-9a0ac39895b4-00-1p31yxty7yvy2.pike.replit.dev/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temp, weather })
  });

  const data = await response.text(); // or .json() depending on backend
  console.log("📥 GPT response received:", data);
  return data;
}
