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

var prefix = "/user/"

module.exports = function(app) {


    // app.post('/12233',function(req,res){
    //     var username = req.body.username;
    //     var htmlData = 'Hello:' + username;
    //     res.send(htmlData);
    //     console.log(htmlData);
    // });

    app.post(prefix + 'getPoint',  function (req, res) {
        var userData = [];
        console.log(req.body.ID);

        connection.query('SELECT points FROM users WHERE userID = ?', req.body.ID,   function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                console.log(err.message);
            } else {
                // for (var i = 0; i < rows.length; i++) {
                //     var user = {
                //         'points':rows[i].points
                //     };
                //     userData.push(user);
                // }
                res.send(  {Point:rows[0].points } );
            }
        });
    });




};




