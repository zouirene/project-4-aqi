// app object
const airfm = {};




// init
airfm.init = function(){

    airfm.getUserInput();
    airfm.getDate();
    airfm.changeLocation();
    airfm.inputPlaceholder();


}

airfm.inputPlaceholder = function(){
    $('.inputField').on('click', function(){
        $('#city').focus();
        $('.inputPlaceholder').css({
            'top':'-40px',
            'font-size': '18px'
        });
    })
}

airfm.getDate = function(){
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    var monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC']
    var month = monthNames[month];
    $('.date').text(`${month} ${day},${year}`)
}

// 1. retrieve userinput from search
airfm.changeLocation = function(){
     $('.changeLocation').on('click', function(){
       location.reload();
    });
}


airfm.getUserInput = function(){

    $("#submit").click(function(e) {
        e.preventDefault();
        var userInputString = $('#city').val();
        var userInputArray = userInputString.split(',');
        var userLocationLong = `${userInputArray[0]}, ${userInputArray[2]}`;
        $('.locationData').text(`${userLocationLong}`);

        var userInputCity = userInputArray[0];

        airfm.getSearchData(userInputCity);
        $('.wrapper').css('transform', 'translateY(-100vh)');
        $('.title').css('opacity','0.05')

    });

}



// 2.make a request to the waqi api for data

airfm.getWeatherApiKey = 'ffb704c6b8e331cf6fd2d33ee59cc22e';



airfm.getSearchData = function(query){
    $.ajax ({
        url: `https://api.waqi.info/feed/${query}/?token=70b3fe59e5174b3e1498194c6c9cd1a50a3e93a2`,
        method: 'GET',
        dataType: 'json'
    })
    .then(function(feed){
        if (feed.status === "error") {
            $('#error').text("Sorry, we don't have the data from this location")
            setTimeout(fade_out, 3000);
            function fade_out() {
              $("#error").fadeOut().empty();
            }
        } else{
            // console.log(feed);
            airfm.data = feed.data.iaqi;
            var locationData = feed.data.city.name
            // // console.log(currentData);

            airfm.getWeatherData(locationData)
            airfm.parseAQIAndUpdateDom();

        }
    });
}


airfm.getWeatherData = function(query){
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${airfm.getWeatherApiKey}&units=metric`,
        methor: 'GET',
        dataType: 'json'
    })
    .then(function(feed){
        // console.log(feed);
        airfm.temperatureData = feed.main;
        airfm.condition = feed.weather[0].main;
        console.log(airfm.temperatureData);
        console.log(airfm.condition);
        airfm.updateWeatherDom();
    });
}


// 3. grab the relevant pieces of data and add the data to DOM

// WEATHER DATA

airfm.updateWeatherDom = function(){
    var temp = airfm.temperatureData;
    $('.mainConditionValue').text(airfm.condition)

    $('.tempValue').text(temp.temp.toFixed(0))
}


// // AQI POLLUTION DATA

airfm.parseAQIAndUpdateDom = function() {
    var data = airfm.data;

    var pm25Value = data.pm25.v;

    if ('pm25' in data) {
        $('.pm25Value').text(data.pm25.v)
    } else {
        $('.pm25Value').text('0')
    }


    // // other pollutant data

    if ('pm10' in data) {
        $('.otherPollutantSection').append(`
            <div class="otherPollutantCell">
                <h3 class="otherPollutantName">PM10</h3>
                <h4 class="otherPollutantValue">${data.pm10.v}</h4>
            `)
    }

    if ('co' in data) {
        $('.otherPollutantSection').append(`
            <div class="otherPollutantCell">
                <h3 class="otherPollutantName">CO</h3>
                <h4 class="otherPollutantValue">${data.co.v}</h4>
            `)
    }

    if ('no2' in data) {
        $('.otherPollutantSection').append(`
            <div class="otherPollutantCell">
                <h3 class="otherPollutantName">NO2</h3>
                <h4 class="otherPollutantValue">${data.no2.v}</h4>
            `)
    }

    if ('so2' in data) {
        $('.otherPollutantSection').append(`
            <div class="otherPollutantCell">
                <h3 class="otherPollutantName">SO2</h3>
                <h4 class="otherPollutantValue">${data.so2.v}</h4>
            `)
    }

    if ('o3' in data) {
        $('.otherPollutantSection').append(`
            <div class="otherPollutantCell">
                <h3 class="otherPollutantName">OZone</h3>
                <h4 class="otherPollutantValue">${data.o3.v}</h4>
            `)
    }

    airfm.updateStyle(pm25Value);

}



// 4. change color and add suggestions based on pm value


airfm.updateStyle = function(v){
    if (v > 250) {
        $('.pm25caption').text(`Hazardous. RIP, lungs.`)
        $('body').css('background-color','maroon')
    } else if (v > 199) {
        $('.pm25caption').text(`Airpocalypse. Wear your thickest mask if you're going outside!`)
        $('body').css('background-color','brown')
    } else if (v > 149) {
        $('.pm25caption').text(`Yikes. Wear a mask if you're going outside today!`)
        $('body').css('background-color','brown')
    } else if (v > 99) {
        $('.pm25caption').text(`Not great. But not a mask day..yet!`)
        $('body').css('background-color','sandybrown')
        $('.title').css('opacity','0.1')

    } else if (v > 49) {
        $('.pm25caption').text(`Namaste. No mask needed today!`)
        $('body').css('background-color','mediumturquoise')
        $('.title').css('opacity','0.1')
    } else if (v < 50) {
        $('.pm25caption').text(`Breathe deep, my friend. It's a good air day!`)
        $('body').css('background-color','deepskyblue')
        $('.title').css('opacity','0.1')
    }
}

// // document ready

$(document).ready(function(){
  airfm.init();
  // airfm.getUserInput();

});


