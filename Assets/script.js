$(document).ready(function () {

    //GIVEN a weather dashboard with form inputs
    // WHEN I search for a city
    // THEN I am presented with current and future conditions for that city and that city is added to the search history
    // WHEN I view current weather conditions for that city
    // THEN I am presented with the 
    // city name = callback.city.name
    // the date = callback.list[0].dt  /  moment().format("MM-DD-YYYY")
    // an icon representation of weather conditions = callback.list[0].weather[0].icon
    // the temperature = callback.list[0].main.temp
    // the humidity = callback.list[0].main.humidity
    // the wind speed = callback.list[0].wind.speed
    // and the UV index = UV seems to need its own separate ajax call, needs lat & long from original call. Need to run twice. Once for current and once for forecast 4 days.
    // WHEN I view the UV index
    // THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
    // WHEN I view future weather conditions for that city
    // THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
    // WHEN I click on a city in the search history
    // THEN I am again presented with current and future conditions for that city
    // WHEN I open the weather dashboard
    // THEN I am presented with the last searched city forecast

    const weatherQueryURL = "http://api.openweathermap.org/data/2.5/weather?q="
    const apiKey = "&units=imperial&APPID=59ddb5cc3f1fd3b75882fc3eb283fbeb"


    

    $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        let city = $("#citySearch").val();
        console.log(city);
        $.ajax({
            url: weatherQueryURL + city + ",us" + apiKey,
            method: "GET"
        }).then(function (callback) {

            let weatherIconCode = callback.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/w/" + weatherIconCode + ".png";
            console.log(callback)
            let h2element = $("<h2>");
            let currentDate = moment(callback.dt, "X").format("M/DD/YYYY");
            let iconIMG = $("<img>");
            iconIMG.attr("src", iconURL);
            h2element.append(callback.name + " " + currentDate + " ", iconIMG);
            let pTemp = $("<p>");
            let pHumidity = $("<p>");
            let pWind = $("<p>");
            pTemp.text("Temperature: " + callback.main.temp + "°F");
            pHumidity.text("Humidity: " + callback.main.humidity + "%");
            pWind.text("Wind Speed: " + callback.wind.speed + "MPH");
            $("#currentDay").append(h2element, pTemp, pHumidity, pWind);

            const UVIqueryURL = "http://api.openweathermap.org/data/2.5/uvi?"
            let coordinates = "&lat=" + callback.coord.lat + "&lon=" + callback.coord.lon;

            $.ajax({
                url: UVIqueryURL + coordinates + apiKey,
                method: "GET"
            }).then(function (callback) {

                console.log(callback);
                let UVIndex = callback.value
                UVIndex = parseInt(UVIndex);
                let pUVI = $("<span>");

                if (UVIndex <= 2) {
                    pUVI.attr("style", "background-color:green");
                } else if (UVIndex >= 3 && UVIndex <= 5) {
                    pUVI.attr("style", "background-color:yellow");
                } else if (UVIndex >= 6 && UVIndex <= 8) {
                    pUVI.attr("style", "background-color:orange");
                } else if (UVIndex >= 9 && UVIndex <= 11) {
                    pUVI.attr("style", "background-color:red");
                } else {
                    pUVI.attr("style", "background-color:purple");
                }

                pUVI.text("UVI: " + UVIndex);
                $("#currentDay").append(pUVI);

                const forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q="

                $.ajax({
                    url: forecastQueryURL + city + ",us" + apiKey,
                    method: "GET"
                }).then(function (callback) {
                    //for (let i = 0; i < 40 ; i + 8){}
                    console.log(callback);
                    let futureDate = moment(callback.list[0].dt, "X").format("M/DD/YY");
                    console.log(futureDate);
                    let pElement = $("<p>");
                    pElement.append(futureDate);
                    let weatherIconCode = callback.list[0].weather[0].icon; const iconURL = "http://openweathermap.org/img/w/" + weatherIconCode + ".png";
                    let iconIMG = $("<img>");
                    iconIMG.attr("src", iconURL);
                    let tempPElement = $("<p>");
                    let humidPElement = $("<p>");
                    tempPElement.text("Temp: " + callback.list[0].main.temp + "°F");
                    humidPElement.text("Hum: " + callback.list[0].main.humidity + "%");
                    $("#futureCast").append(pElement, iconIMG, tempPElement, humidPElement);
                })

            });





        });



    });
});