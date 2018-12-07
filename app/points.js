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

var prefix = "/points"
const http = require('https');

module.exports = function(app) {


    app.get( '/test123',  function (req, res) {
         res.send("ASDF");
    });

    app.get(prefix + '/get_users_points',  function (req, res) {
        var userData = [];
        connection.query('SELECT points FROM users',  function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                console.log(err.message);
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var user = {
                        'points':rows[i].points
                    };
                    userData.push(user);
                }
                res.send(  userData  );
            }
        });
    });

    app.get('/get_customer_points/:user_id', function(req, res) {
        // res.send("User ID is set to " + req.params.user_id);
        var userData = [];

        connection.query('SELECT * FROM users WHERE user_id = ?', req.params.user_id,  function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                console.log(err.message);
            } else
                {
                for (var i = 0; i < rows.length; i++) {
                    var user = {
                        'jinmos_points':rows[i].points
                    };
                    userData.push(user);
                }
                res.send(  rows  );
            }
        });
    });
    // app.get('/get_cus', function(req, res) {
    //     res.send("name is set to " + req.query.name);
    // });


    // app.get(prefix + '/get_user_points/:id',  function(req, res) {
    //     console.log(req.params.id);
    //
    //     connection.query('SELECT points FROM users WHERE user_id = ?', req.params.id  , function(err, rows, fields) {
    //         if (err) {
    //             res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    //         } else {
    //             // Loop check on each row
    //             if (rows.length == 1) {
    //
    //                 var user_points = {
    //                     'user_id':req.params.id,
    //                     'points':rows[0].points
    //                 }
    //                 res.send(  user_points  );
    //             }
    //             else
    //                 {
    //                     res.send("Error: 404 - User Does Not Exist");
    //                 }
    //         }
    //     });
    // });

    //   function get_user_points(user_id, res) {
    //
    //     async.parallel([
    //         function(callback) {
    //
    //             var queryData = "SELECT points FROM users WHERE user_id = ? ";
    //             connection.query(queryData, [ user_id ],  function (err, rows1) {
    //                 if (err) {
    //                     return callback(err);
    //                 }
    //                 return callback(null, rows1);
    //             });
    //         },
    //
    //
    //     ], function(error, callbackResults) {
    //         if (error) {
    //             //handle error
    //             console.log(error);
    //         } else {
    //             console.log((callbackResults[0][0].points));
    //             var user_points = callbackResults[0][0].points;
    //             if(callbackResults[0].length < 1)
    //             {
    //                 // console.log(error);
    //                 // var queryData = 'INSERT INTO logs  (user_id, latitude, longitude,  address, datetime) VALUE (?,?,?,?,?)';
    //                 // connection.query(queryData, [user_id, lat, long, addrs, datetime],  function (err, rows1) {
    //                 //     if (err) {
    //                 //         console.log("ERR: " + err);
    //                 //         return res.send("ERROR");
    //                 //     }
    //                 //     return res.send("SUCCESS");
    //                 // });
    //             }
    //             else {
    //                 res.send(user_points.toString());
    //
    //
    //             }
    //         }
    //     });
    //
    //
    // }

    app.get(prefix + '/add_points/:user_id/:points_to_add',  function(req, res) {
        console.log(req.params.user_id);
        console.log(req.params.points_to_add);

        async.parallel([
            function(callback) {

                var queryData = "SELECT points FROM users WHERE user_id = ? ";
                connection.query(queryData, [ req.params.user_id ],  function (err, rows1) {
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
                console.log((callbackResults[0][0].points));



                    var queryData = 'INSERT INTO point_logs  (store_id, user_id, points_used,  points_gained, date, event_id) VALUE (?, ?,?,?,?,?)';
                    connection.query(queryData, ["asdf", "asdf", "asdf", "asdf", "asdf", "asdf"],  function (err, rows1) {
                        if (err) {
                            console.log("ERR: " + err);
                            // ?return res.send("ERROR");
                        }
                         // return res.send("SUCCESS");
                    });



                    return res.send("SUCCESS");

            }
        });
    });




};




