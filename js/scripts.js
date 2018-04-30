url = 'http://localhost:3001/';

function getRecentChartData(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState === 4){
			var dataJSON = JSON.parse(xhttp.response);
			console.log(dataJSON);
			document.getElementById("tableContainer").style.visibility="visible";
			document.getElementById("temp").innerText=dataJSON.data.temp;
			document.getElementById("humidity").innerText=dataJSON.data.humidity;
			document.getElementById("soil").innerText=dataJSON.data.soilMoisture;
			document.getElementById("light").innerText=dataJSON.data.light;
			document.getElementById("stamp").innerText=dataJSON.data.timestamp;
		}
	}

	//POST request
	var parameter = JSON.stringify({action:"getRecentData"});
	xhttp.open('POST', url, true);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	//Sending Request
	xhttp.send(parameter);
}

function getHighchartData(){
	var xhttp = new XMLHttpRequest();
	console.log(xhttp);
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState === 4){
			var dataJSON = JSON.parse(xhttp.response);
			demoChart(dataJSON);
			console.log(dataJSON);
		}
	}

	var parameter = JSON.stringify({action:"getChartData"});
	xhttp.open('POST', url, true);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(parameter);
}

function demoChart(data){
	var tempArray = [];
    var humidityArray = [];
    var soilArray = [];
    var lightArray = [];

    for(var i = 0; i<data.data.length; i++){
    	//data.data[i] = parseInt(data.data,10);
    	tempArray.push(parseInt(data.data[i].temp));
    	humidityArray.push(parseInt(data.data[i].humidity));
    	soilArray.push(parseInt(data.data[i].soilMoisture));
    	lightArray.push(parseInt(data.data[i].light));
    }
    console.log(tempArray)
    console.log(humidityArray)
    console.log(soilArray)
    console.log(lightArray)

    var myChart = Highcharts.chart('container', {

    title: {
        text: 'UGarden Environment'
    },

    subtitle: {
        text: 'Local Environment'
    },

    yAxis: {
        title: {
            text: 'Magnitude'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: true
            }
        }
    },

    series: [{
        name: 'Humidity',
        data: humidityArray
    }, {
        name: 'Light',
        data: lightArray
    }, {
        name: 'Soil Moisture',
        data: soilArray
    }, {
        name: 'Temperature',
        data: tempArray
    }
    ],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

})
};