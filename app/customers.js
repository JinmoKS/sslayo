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

var prefix = "/users"

module.exports = function(app) {


    app.get(prefix + '/get_user_ids',  function (req, res) {
        var userData = [];
        connection.query('SELECT user_id FROM users',  function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                console.log(err.message);
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var user = {
                        'user_id':rows[i].user_id
                    };
                    userData.push(user);
                }
                res.send(  userData  );
            }
        });
    });

    app.get(prefix + '/get_user/:id',  function(req, res) {
        console.log(req.params.id);
        connection.query('SELECT * FROM users WHERE user_id = ?', req.params.id  , function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
            } else {
                // Loop check on each row
                if (rows.length == 1) {

                    // Create an object to save current row's data
                    var user = {
                        'user_id':rows[0].user_id,
                        'name':rows[0].name,
                        'phone':rows[0].phone,
                        'birthday':rows[0].birthday,
                        'points':rows[0].points,
                        'coupons':rows[0].coupons
                    }
                    // Add object into array
                    res.send(  user  );
                }
                else
                    {
                        res.send("Error: 404 - User Does Not Exist");
                    }
            }
        });
    });

    app.get(prefix + '/get_users',  function (req, res) {
        var userData = [];
        connection.query('SELECT * FROM users',  function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                console.log(err.message);
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var user = {
                        'user_id':rows[i].user_id,
                        'name':rows[0].name,
                        'phone':rows[0].phone,
                        'birthday':rows[0].birthday,
                        'points':rows[0].points,
                        'coupons':rows[0].coupons
                    };
                    userData.push(user);
                }
                res.send(  userData  );
            }
        });
    });

    app.get(prefix + '/register_user/:user_id/:name/:phone/:birthday/:password',  function(req, res) {
        console.log(req.params.user_id);
        console.log(req.params.name);
        console.log(req.params.phone);
        console.log(req.params.birthday);
        console.log(req.params.password);

        connection.query('INSERT INTO users  (user_id, name, phone, birthday, password) VALUE (?,?,?,?,?)',
                [req.params.user_id  , req.params.name,req.params.phone  , req.params.birthday, req.params.password ] ,   function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                console.log(err.message)
            } else {
z
                    res.send("Success: 200 - User Registered");
            }
        });
    });

    app.get(prefix + '/update_user_info/:user_id/:name/:phone/:birthday',  function(req, res) {

        connection.query('UPDATE users SET name = ?, phone = ?, birthday = ? WHERE user_id = ?',
            [  req.params.name,req.params.phone  , req.params.birthday, req.params.password, req.params.user_id  ] ,   function(err, rows, fields) {
                if (err) {
                    res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                    console.log(err.message)
                } else {
                    res.send("Success: 200 - User Updated");
                }
            });
    });
};




