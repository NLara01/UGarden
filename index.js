var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const url = 'mongodb://localhost:27017';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName = 'UGarden';

//Establishes connection between the Node Server and the MongoDB
var mongoose = require('mongoose');
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Stored Data Schema
// Create schema
var Schema = mongoose.Schema;
var uGardenDataModel = new Schema({
	temp: String,
	humidity: String,
	soilMoisture: String,
	light: String,
	timestamp: Date
});

// Create model
var uGardenData = mongoose.model('UGarden', uGardenDataModel);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handle GET Requests
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname+'/html/index.html'));
});

app.get('/css/style.css', function(req, res) {
  res.sendFile(path.join(__dirname+'/css/style.css'));
});

app.get('/js/scripts.js', function(req, res) {
  res.sendFile(path.join(__dirname+'/js/scripts.js'));
});

app.get('/js/code/highcharts.js', function(req, res) {
  res.sendFile(path.join(__dirname+'/js/code/highcharts.js'));
});

app.get('/js/code/modules/exporting.js', function(req, res) {
  res.sendFile(path.join(__dirname+'/js/code/modules/exporting.js'));
});

app.listen(3001, function(err){
	console.log("Listening  on 3001");
});


// Handle POST Requests

app.post('/', function(req, res){
	var action = req.body.action;
	var jsonData = req.body;
	switch(action){
		case "insertData":
			sanitizeData(jsonData, res);
			break;
		case "getRecentData":
			getRecentData(res);
			break;
		case "getChartData":
			getChartData(res);
			break;
		default:
			res.end(JSON.stringify({"success":false}));
			break;
	}
});


// Helper Functions

// This function makes sure no nulls are passed to the DB
function sanitizeData(jsonData, res){
	if(jsonData.temp != null && jsonData.humidity != null && jsonData.soilMoisture != null && jsonData.light != null){
		storeData(jsonData, res);
	} else {
		var jsonResp = {};
		jsonResp.success = false;
		res.send(jsonResp);
	}
}

// This function puts 1 record at a time into our mongo db
function storeData(jsonData,res){
	var currentDate = Date.now();
	jsonData.timestamp = currentDate; 
	var newInstance = new uGardenData({temp:jsonData.temp,humidity:jsonData.humidity,soilMoisture:jsonData.soilMoisture,light:jsonData.light,timestamp:jsonData.timestamp});
	newInstance.save(function(err){
		if(err){
			res.send({success: false});
		} else{
			res.send({success: true});
		}
	});
}

function getRecentData(res){
	uGardenData.findOne({},{},{sort:{'timestamp': -1}}, function(err,post){
		if(err){
			res.send({success: false});
		} else {
			res.send({data:post,success:true});
		}
	})
}
// chart data service

function getChartData(res){
		// Javascript Query
		uGardenData.find({}, null, {sort:{'timestamp': -1},limit: 5}, function(err, post){
		if(err){
			res.send({success: false});
			console.log('failed');
		} else {
			res.send({data:post,success:true});
			console.log('success');
		}
	})
}

