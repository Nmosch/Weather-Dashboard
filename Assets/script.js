$(document).ready(function () {

    const weatherQueryURL = "http://api.openweathermap.org/data/2.5/weather?q="
    const apiKey = "&units=imperial&APPID=59ddb5cc3f1fd3b75882fc3eb283fbeb"
    let recentCities = [];
//loads cities from previous searches 
    function loadCity() {
//JSON.parse converts recentCities into an array
         var getCity = JSON.parse(localStorage.getItem("cities"))
         if (getCity != null){ 
            recentCities = getCity
         }
//clears out previous li's before appending new li with updated data from local storage
        $(".list-group").empty();
        let city = $("#citySearch").val();
        if (recentCities != null)  {
//appending new cities to list group
            for (var i = 0; i < recentCities.length; i++) {
                var newLi = $("<li class='list-group-item clickable'>");
                newLi.text(recentCities[i]);
                $(".list-group").append(newLi);
                }
//makes each new city clickable and searches using weatherSearch function
            $(".clickable").on("click", function(){
                var newCity = $(this).text();
                weatherSearch(newCity)
            })
        }
    }
//main search function 
function weatherSearch(search){
    let city = search
//ensures empty strings and duplicates do not get added to the array
    if(city.length > 0 && recentCities.indexOf(city) === -1){
        recentCities.push(city);
//stores cities in local storage. JSON.stringify converts recentCities array to a string
        localStorage.setItem("cities", JSON.stringify(recentCities));
        loadCity()
    } 
//Initial ajax call for current weather
    $.ajax({
        url: weatherQueryURL + city + ",us" + apiKey,
        method: "GET"
    }).then(function (callback) {
        $("#currentDay").empty();
        let weatherIconCode = callback.weather[0].icon;
        const iconURL = "http://openweathermap.org/img/w/" + weatherIconCode + ".png";
        console.log(callback);
        let h2element = $("<h2>");
        let currentDate = moment(callback.dt, "X").format("M/D/YYYY");
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
//another ajax call for UV Index
        $.ajax({
            url: UVIqueryURL + coordinates + apiKey,
            method: "GET"
        }).then(function (callback) {

            console.log(callback);
            let UVIndex = callback.value
            UVIndex = parseInt(UVIndex);
            let pUVI = $("<span>");
//color codes UV Index based on value
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
//another ajax call for 5 day forecast
            const forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q="

            $.ajax({
                url: forecastQueryURL + city + ",us" + apiKey,
                method: "GET"
            }).then(function (callback) {
                $("#futureCast").empty();
                for (let i = 0; i < 40; i += 8) {
                    var col = $("<div class = 'col-sm-2'>");
                    var cardBody = $("<div class = 'card-body'>");
                    var card = $("<div class = 'card'>");
                    console.log(callback);
                    let futureDate = moment(callback.list[i].dt, "X").format("M/D/YY");
                    console.log(futureDate);
                    let pElement = $("<p>");
                    pElement.append(futureDate);
                    let weatherIconCode = callback.list[i].weather[0].icon;
                    const iconURL = "http://openweathermap.org/img/w/" + weatherIconCode + ".png";
                    let iconIMG = $("<img>");
                    iconIMG.attr("src", iconURL);
                    let tempPElement = $("<p>");
                    let humidPElement = $("<p>");
                    tempPElement.text("Temp: " + callback.list[i].main.temp + "°F");
                    humidPElement.text("Hum: " + callback.list[i].main.humidity + "%");
                    cardBody.append(pElement, iconIMG, tempPElement, humidPElement);
                    card.append(cardBody);
                    col.append(card);
                    $("#futureCast").append(col);
                }
            })
        });
    });
}
//initiates search when search button click
    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        var city = $("#citySearch").val();
        weatherSearch(city)
    });
    loadCity()
});


