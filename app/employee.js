// app/routes.js
// Module dependencies
var async = require('async');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');

var express    = require('express'),
    mysql      = require('mysql');

var dbconfig = require('../config/sslayo_db');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

var prefix = "/employee/";
module.exports = function(app) {
    app.post(prefix + 'addEmployee',  function (req, res) {
        var userData = [];

        // console.log(req.text());
        var storeID = req.body.storeID;
        var name = req.body.name;
        var birthday = req.body.birthday;
        var phone = req.body.phone;
        var email = req.body.email;
        var startWorking = req.body.startWorking;
        var address = req.body.address;

        connection.query('INSERT into employee  (storeID, name, phone_number, address, date_of_birth, work_start, email) VALUE (?,?,?,?,?,?,?)',
            [storeID, name, phone, address, birthday, startWorking, email],   function(err, rows, fields) {
            if (err) {
                res.send({Code: -1});
                console.log(err.message);
            } else {
                // for (var i = 0; i < rows.length; i++) {
                //     var user = {
                //         'points':rows[i].points
                //     };
                //     userData.push(user);
                // }
                res.send({Code: 1});
            }
        });
    });

    app.post(prefix + 'getEmployee',  function (req, res) {
        console.log("STORE ID: " + req.body.storeID);
        var userData = [];
        console.log("employee get Called");

        connection.query('SELECT * from employee' ,
            function(err, rows, fields) {
                if (err) {
                    res.send({Code: -1});
                    console.log(err.message);
                } else {
                    // for (var i = 0; i < rows.length; i++) {
                    //     var user = {
                    //         'points':rows[i].points
                    //     };
                    //     userData.push(user);
                    // }

                    res.send(rows);
                }
            });
    });

    // SELECT * from eployee



};




