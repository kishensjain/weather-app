const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loader");

const apiKey = "e9cfbc129f1810dc36bff0099ac4b303";

document.addEventListener("DOMContentLoaded",()=>{
  const lastCity = localStorage.getItem("lastCity");
  if(lastCity){
    cityInput.value=lastCity;
    getWeather(lastCity);
  }
});

searchBtn.addEventListener("click",()=>{
  const city = cityInput.value.trim();
  if(!city){
    showError("Please enter a city name");
    return;
  }
  getWeather(city)
});

cityInput.addEventListener("keypress", event =>{
  if(event.key==="Enter"){
    searchBtn.click();
  }
});

async function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  loader.classList.remove("hidden");
  weatherResult.classList.add("hidden");
  errorMessage.textContent = "";

  try{
    const response = await fetch(apiUrl);
    if(!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
    localStorage.setItem("lastCity", city);
  } catch(error){
    showError(error.message);
  } finally{
    loader.classList.add("hidden");
  }
};

function displayWeather(data){
  const cityName = data.name;
  const temperature = data.main.temp;
  const weatherDescription = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

  weatherResult.innerHTML = `
      <p><strong>City:</strong> ${cityName}</p>
      <p><strong>Temperature:</strong> ${temperature}°C</p>
      <p><strong>Weather:</strong> ${weatherDescription} <img src="${iconUrl}" alt="Weather Icon"></p>
      <p><strong>Humidity:</strong> ${humidity}%</p>
      <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
  `;
  weatherResult.style.display = "inline-block";
}

function showError(message){
  errorMessage.textContent = message;
  weatherResult.innerHTML = "";
  weatherResult.style.display = "none";
}