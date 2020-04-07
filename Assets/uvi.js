$(document).ready(function () {

    let queryURL = "http://api.openweathermap.org/data/2.5/uvi?"
    let apiKey = "&APPID=59ddb5cc3f1fd3b75882fc3eb283fbeb"
    let city = "&lat=33.4484&lon=-112.074&cnt=5"
    
    $.ajax({
        url: queryURL + city + apiKey,
        method: "GET"
    }).then(function (callback) {

        console.log(callback)
        

    });
});