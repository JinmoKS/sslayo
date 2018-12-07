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


module.exports = function(app) {







    app.post('/EditAdmin',  function(req, res) {

        console.log("EDITING");
        var username = req.body.username;
        var name = req.body.name;
        var email = req.body.email;



        connection.query('UPDATE admins SET name = ?, email = ? WHERE username = ?',
            [name, email,  username],
            function(err, rows, fields) {
                if (err) {
                    console.log("err" + err.message);
                }

                return res.send("SUCCESS");

            });




    });


    app.post('/DeleteAdmin',  function(req, res) {

        console.log("DELETING");
        var username = req.body.username;

        connection.query('DELETE from admins WHERE username = ?',
            [ username],
            function(err, rows, fields) {
                if (err) {
                    console.log("err" + err.message);
                }

                return res.send("SUCCESS");

            });




    });


    app.post('/ChangeAdminPW',  function(req, res) {
        var username = req.body.username;

        var password = req.body.password;
        var newPW = bcrypt.hashSync(password, null, null)
        connection.query('UPDATE admins SET password = ? WHERE username = ?',
            [newPW, username],
            function(err, rows, fields) {
                if (err) {
                    console.log("err" + err.message);
                }

                return res.send("SUCCESS");

            });




    });

    app.post('/AddAdmin',  function(req, res) {

        console.log("ADD Admin");

        var email = req.body.email;
        var name = req.body.name;


        var username = req.body.username;

        var password = req.body.password;
        var newPW = bcrypt.hashSync(password, null, null)


        connection.query('INSERT INTO administrator  (admin_id, password) VALUE (?,?)',
            [username, name, email, newPW],
            function(err, rows, fields) {
                if (err) {
                    console.log("err" + err.message);
                }

                return res.send("SUCCESS");

            });




    });






};




