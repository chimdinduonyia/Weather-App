
const cityNameInput = document.querySelector("input#cityName");
const notification = document.querySelector(".notification");
const getWeatherBtn = document.querySelector("#getWeatherBtn");
const cityDisplay = document.querySelector("#city");
const countryDisplay = document.querySelector("#country");
const tempDisplay = document.querySelector("#temperature");
const descriptionDisplay = document.querySelector("#remark");
const humidityValue = document.querySelector(".humidityValue");
const windSpeedValue = document.querySelector(".windSpeedValue");
const emojiDisplay = document.querySelector("#weatherEmojiDisplay");

const apiKey = "ffe438652c7faa9d913562b0f733d8de";

cityNameInput.addEventListener("keydown", async (event) => {

    if(event.key == "Enter"){

        event.preventDefault();

        const city = getCityName(event);

        const cityCoordinatesObject = await fetchCityCoordinates(city);

        const {lat: cityLatitude, lon: cityLongitude, name:cityName, country:cityCountry} = cityCoordinatesObject[0];

        renderCityName(cityName, cityCountry);

        const weatherObject = await getWeatherData(cityLongitude, cityLatitude);

        const {main:{temp:cityTemp, humidity:cityHumidity}, weather:[{id:weatherId, description:weatherDesc}], wind:{speed:windSpeed}} = weatherObject;

        renderWeatherData(cityTemp, cityHumidity, weatherId, weatherDesc, windSpeed);
    }

}
)

getWeatherBtn.addEventListener("click", async (event) => {

    const city = getCityName(event);

    const cityCoordinatesObject = await fetchCityCoordinates(city);

    const {lat: cityLatitude, lon: cityLongitude, name:cityName, country:cityCountry} = cityCoordinatesObject[0];

    renderCityName(cityName, cityCountry);

    const weatherObject = await getWeatherData(cityLongitude, cityLatitude);

    const {main:{temp:cityTemp, humidity:cityHumidity}, weather:[{id:weatherId, description:weatherDesc}], wind:{speed:windSpeed}} = weatherObject;

    renderWeatherData(cityTemp, cityHumidity, weatherId, weatherDesc, windSpeed);

});


function getCityName(event){

    event.preventDefault();

    let cityName = cityNameInput.value;

    if(cityNameInput.value == ""){

        cityNameInput.style = "border-bottom: 1px solid #b72e13";

        notification.textContent = "Please Enter A City";
        notification.classList.toggle("showNotification");

        setTimeout(() => {
            notification.classList.toggle("showNotification");
            cityNameInput.style = "border-bottom: 1px solid transparent";
        }, 1500);

        return;

    }
    else{

        cityNameInput.value = "";
        return cityName;

    }
}

async function fetchCityCoordinates(city){

    try{

        const apiCoordinatesResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`);

        const apiCoordinates = await apiCoordinatesResponse.json();

        if(apiCoordinates.length == 0){

            cityNameInput.style = "border-bottom: 1px solid #b72e13";
            notification.textContent = "Please Enter A Valid City";
            notification.classList.toggle("showNotification");
            
            setTimeout(() => {
                notification.classList.toggle("showNotification");
                cityNameInput.style = "border-bottom: 1px solid transparent";
            }, 1500);

            return;

        }

        else{

            return apiCoordinates;

        }

    }
    catch(error){

        console.error(error);

    }

}

async function getWeatherData(longitude, latitude){

    try{
        const apiResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);

        if(!apiResponse.ok){

            throw new Error("Could not fetch weather data");

        }
        else{

            const responseObject = await apiResponse.json();

            // console.log(apiResponse);

            return responseObject;

        }
    }
    catch(error){

        console.error(error);

    }

}

function renderCityName(city, country){

    cityDisplay.textContent = city;
    countryDisplay.textContent = country;

}

function renderWeatherData(cityTemp, cityHumidity, weatherId, weatherDesc, windSpeed){

    tempDisplay.textContent = `${(cityTemp - 273.1).toFixed(2)}`;
    humidityValue.textContent = `${String(cityHumidity)}`;
    windSpeedValue.textContent = `${String(windSpeed)}`;

    // let descList = weatherDesc.split(" ");
    // descList.forEach(word => {word.charAt(0).toUpperCase()});
    // weatherDesc = descList.join(" ");

    descriptionDisplay.textContent = capitalize(weatherDesc);
    emojiDisplay.textContent = renderWeatherEmoji(weatherId);

}

function capitalize(phrase){

    let phraseList = phrase.split(" ");

    phraseList = phraseList.map(word => {

        let firstChar = word.charAt(0);
        let wordSlice = word.slice(1);

        return firstChar.toUpperCase() + wordSlice;
    })

    return phraseList.join(" ");
}

function renderWeatherEmoji(weatherId){

    switch(true){

        case(weatherId >= 200 && weatherId <= 232):
            return "⛈️";
            break;
        case(weatherId >= 300 && weatherId <= 321):
            return "🌦️";
            break;
        case(weatherId >= 500 && weatherId <= 521):
            return "🌧️";
            break;
        case(weatherId >= 600 && weatherId <= 622):
            return "❄️";
            break;
        case(weatherId >= 701 && weatherId <= 781):
            return "🌫️";
            break;
        case(weatherId == 800):
            return "⛅";
            break;
        case(weatherId >= 801 && weatherId <= 804):
            return "☁️";
            break;
        
    }

    console.log(weatherId);

}