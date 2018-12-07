2;// app/routes.js
// Module dependencies
var async = require('async');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');

var express    = require('express'),
    mysql      = require('mysql');

var dbconfig = require('../config/sslayo_db');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

var prefix = "/points"
const http = require('https');

module.exports = function(app) {

    app.post('/GetLogs',   function(req, res) {
        var dataList = [];
        var user_id = req.body.userID;
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;


        console.log("user_id: " + user_id);
        console.log("startDate: " + startDate);
        console.log("endDate: " + endDate);

        connection.query('SELECT * FROM logs where datetime BETWEEN  ? AND ? AND user_id = ? ORDER BY datetime ASC', [startDate, endDate, user_id], function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                console.log(err.message);
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var date = moment(rows[i].datetime).format('MMMM Do YYYY, h:mm:ss A');
                    var user = {
                        'latitude':rows[i].latitude,
                        'longitude':rows[i].longitude,
                        'address':rows[i].address,
                        'date':date
                    };
                    dataList.push(user);
                }
                console.log(rows);
                return res.send(dataList);
            }
        });
    });

    app.post('/UpdateLogs',   function(req, res) {
        var user_id = req.body.user_id;
        var lat = req.body.lat;
        var long = req.body.long;
        var addrs = req.body.addrs;
        var datetime = req.body.datetime;


        console.log("user_id: " + user_id);
        console.log("lat: " + lat);
        console.log("long: " + long);


        async.parallel([
            function(callback) {

                var queryData = "SELECT * FROM logs WHERE latitude = ? AND longitude = ? AND user_id = ?   ";
                connection.query(queryData, [lat, long, user_id ],  function (err, rows1) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, rows1);
                });
            },


        ], function(error, callbackResults) {
            if (error) {
                //handle error
                console.log(error);
            } else {

                if(callbackResults[0].length < 1)
                {
                    console.log(error);
                    var queryData = 'INSERT INTO logs  (user_id, latitude, longitude,  address, datetime) VALUE (?,?,?,?,?)';
                    connection.query(queryData, [user_id, lat, long, addrs, datetime],  function (err, rows1) {
                        if (err) {
                            console.log("ERR: " + err);
                            return res.send("ERROR");
                        }
                        return res.send("SUCCESS");
                    });
                }
                else {

                    return res.send("SUCCESS");
                }
            }
        });
    });




};




