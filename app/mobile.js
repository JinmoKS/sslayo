2;// app/routes.js
// Module dependencies
var async = require('async');
var moment = require('moment');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var express    = require('express'),
    mysql      = require('mysql');

var dbconfig = require('../config/sslayo_db');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
// Application initialization

module.exports = function(app) {





    app.post('/mobileRegister',  function (req, res) {

        var userID = req.body.userID;
        var phone = req.body.phone;
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        console.log("User Name: " + req.body.name);
        console.log("User Phone: " + phone);

        async.parallel([
            function(callback) {
                var queryData = "SELECT * FROM users WHERE user_id = ? ";
                connection.query(queryData, [userID],  function (err, rows1) {
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
                    connection.query('INSERT INTO users  (name, email, phone, password,  user_id) VALUE (?,?,?,?,?)',
                        [name, email, phone, password,  userID],
                        function(err, rows, fields) {
                            if (err) {
                                console.log("err" + err.message);
                                return res.send("ERROR");
                            }
                            return res.send("SUCCESS");

                        });
                }
                else {
                    return res.send("ERROR");
                }
                console.log(callbackResults[0] ); // rows1
            }
        });
    });


    app.post('/mobileUpdate',  function (req, res) {

        var userID = req.body.userID;
        var phone = req.body.phone;
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;

        console.log("User Name: " + req.body.name);
        console.log("User Phone: " + phone);
        var queryData = "UPDATE users SET name = ?, phone = ?, email = ?, password = ?  WHERE user_id = ? ";
        connection.query(queryData,
            [name, email, phone, password,  userID],
            function(err, rows, fields) {
                if (err) {
                    console.log("err" + err.message);
                    return res.send("ERROR");
                }
                return res.send("SUCCESS");

            });
    });


    app.post('/appLogin',   function(req, res) {
        var user_id = req.body.user_id;
        var password = req.body.password;

        console.log("user_id" + user_id);

        console.log("password" + password);


        var dataList = [];
        async.parallel([
            function(callback) {
                console.log("Connecting");
                var queryData = "SELECT * FROM users WHERE user_id = ? ";
                connection.query(queryData, [user_id],  function (err, rows1) {
                    if (err) {
                        console.log("ERR: " + err);
                        return res.send("ERROR");
                    }
                    console.log("Connected");

                    return callback(null, rows1);

                });
            },


        ], function(error, callbackResults) {
            console.log("Callback");

            if (error) {
                //handle error
                console.log(error);
                return res.send("ERROR");
            } else {
                console.log("Callback1");
                console.log("callbackResults[0].length" + callbackResults[0].length);

                if(callbackResults[0].length < 1)
                {
                    console.log("Not Found");
                    return res.send("NA");

                }
                else {
                    console.log("Callback2");
                    var queryData = "SELECT * FROM users WHERE user_id = ? AND password = ? ";
                    connection.query(queryData, [user_id, password],  function (err, rows) {
                        if (err) {
                            console.log("ERR: " + err);
                            return res.send("ERROR");
                        }
                        else {
                            console.log("rows.length" + rows.length);
                            if (rows.length < 1) {
                                return res.send("PW");

                                console.log("Wrong PW");

                            }
                            else {
                                for (var i = 0; i < rows.length; i++) {
                                    var user = {
                                        'user_id':rows[i].user_id,
                                        'name':rows[i].name,
                                        'email':rows[i].email,
                                        'phone':rows[i].phone,
                                        'password':rows[i].password
                                    };
                                    dataList.push(user);
                                }
                                return res.send(dataList);
                            }

                        }
                    });

                }
            }
        });
    });


};




