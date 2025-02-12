const apiKey = CONFIG.API_KEY;
const searchInput = document.querySelector(".input input");
const searchIcon = document.querySelector(".bx-search");
const searchFrame = document.getElementById("search_frame");
const weatherFrame = document.getElementById("weather_frame");

searchIcon.addEventListener("click", () => {
  const location = searchInput.value.trim();
  if (location !== "") {
    // e.preventDefault();

    fetchWeather(location);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const location = searchInput.value.trim();
    if (location !== "") {
      fetchWeather(location);
    }
  }
});

async function fetchWeather(city) {
  const day = 4;
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${day}&aqi=no`
    );

    if (!response.ok) throw new Error("lokasih tidak di temukan!");

    const data = await response.json();
    // console.log(data);
    displayWeather(data);
    searchFrame.style.opacity = "0";
    setTimeout(() => {
      searchFrame.style.display = "none";
      weatherFrame.style.display = "block";
      setTimeout(() => {
        weatherFrame.style.opacity = "1";
      });
    });
  } catch (error) {
    alert(error.message);
  }
}

function displayWeather(data) {
  const { location, current, forecast } = data;

  // 🔹 Cek apakah deskripsi cuaca memiliki terjemahan
  const conditionText = current.condition.text;
  const translatedCondition =
    weatherTranslations[conditionText] || conditionText;

  // 🔹 Menampilkan Cuaca Hari Ini
  document.getElementById("day-label").textContent = "Hari ini";
  document.getElementById("weather-description").textContent =
    translatedCondition;
  document.getElementById("weather-icon").src =
    "https:" + current.condition.icon;
  document.getElementById("temperature").textContent = `${current.temp_c}°C`;

  // 🔹 Menampilkan Nama Lokasi & Provinsi
  document.querySelector(".location").textContent = location.name;
  document.querySelector(
    ".provinsi"
  ).textContent = `${location.region}, ${location.country}`;

  // 🔹 Menampilkan Prakiraan Cuaca 3 Hari ke Depan
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = ""; // Bersihkan data sebelumnya

  forecast.forecastday.slice(1).forEach((day) => {
    const forecastCondition = day.day.condition.text;
    const translatedForecast =
      weatherTranslations[forecastCondition] || forecastCondition;

    const dayElement = document.createElement("div");
    dayElement.classList.add("forecast-day");

    dayElement.innerHTML = `
      <p>${formatDay(day.date)}</p>
      <img src="https:${day.day.condition.icon}" alt="Weather Icon">
      <p> ${day.day.avgtemp_c}°C</p>
    `;

    forecastContainer.appendChild(dayElement);
  });
}

// Fungsi Mengubah Format Hari (Senin, Selasa, Rabu, dll.)
function formatDay(dateString) {
  const options = { weekday: "long" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}
