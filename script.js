function getWeather(cityName = null) { let city = cityName || document.getElementById("cityInput").value; city = city.trim().toLowerCase();

const apiKey = "a3b844712f6b388574ac3732c97747d1";

fetch(https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric) .then(response => { if (!response.ok) throw new Error("City not found"); return response.json(); }) .then(data => { const name = data.name; const temp = data.main.temp; const weather = data.weather[0].description; const main = data.weather[0].main.toLowerCase();

let bg = 'default.jpg';
  if (main.includes("rain")) bg = 'rain.jpg';
  else if (main.includes("cloud")) bg = 'cloud.jpg';
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
    `<strong>📍 Location:</strong> ${name}<br>
     <strong>🌡 Temperature:</strong> ${temp}°C<br>
     <strong>🌥 Condition:</strong> ${weather}<br><br>
     <strong>💡 Suggestion:</strong> ${advice}`;

  // Call AI suggestion
  getAISuggestion(temp, weather).then(aiAdvice => {
    document.getElementById("weatherResult").innerHTML += `<br><br><strong>🧠 GPT Suggestion:</strong> ${aiAdvice}`;
  });
})
.catch(error => {
  document.getElementById("weatherResult").innerHTML = "❗ Could not find that location. Please try again.";
});

}

function getLocationWeather() { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(position => { const lat = position.coords.latitude; const lon = position.coords.longitude; const apiKey = "a3b844712f6b388574ac3732c97747d1";

fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => getWeather(data.name));
});

} else { alert("Geolocation not supported by your browser."); } }

function startVoiceInput() { const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)(); recognition.lang = "en-US"; recognition.start();

recognition.onresult = function(event) { const citySpoken = event.results[0][0].transcript; document.getElementById("cityInput").value = citySpoken; getWeather(citySpoken); };

recognition.onerror = function(event) { alert("Voice recognition error: " + event.error); }; }

async function getAISuggestion(temp, weather) { const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Authorization": Bearer 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, // Replace this with your actual OpenAI API key "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [ { role: "system", content: "You are a friendly weather assistant that gives short, smart suggestions about what people should wear or do based on weather and temperature." }, { role: "user", content: It's ${temp}°C with ${weather}. What should I do or wear today? } ], temperature: 0.7 }) });

const data = await response.json(); return data.choices[0].message.content; }

                                                                                                                            
