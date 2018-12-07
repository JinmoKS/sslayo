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

var prefix = "/coupons"
const http = require('https');

module.exports = function(app) {



    app.get(prefix + '/get_coupons',  function (req, res) {
        var coupons_data = [];
        connection.query('SELECT points FROM users',  function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
                console.log(err.message);
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var coupon = {
                        'user_id':rows[i].coupon_id
                    };
                    coupons_data.push(coupon);
                }
                res.send(  coupons_data  );
            }
        });
    });


    app.get(prefix + '/get_user_coupons/:id',  function(req, res) {
        console.log(req.params.id);

        connection.query('SELECT coupon_id FROM event_coupon_list WHERE customer_id = ?', req.params.id  , function(err, rows, fields) {
            if (err) {
                res.status(500).json({"status_code": 500,"status_message": "internal server error"});
            } else {
                // Loop check on each row
                if (rows.length == 1) {

                    var user_coupons = {
                        'customer_id':req.params.id,
                        'coupon_id':rows[0].coupon_id
                    }
                    res.send(  user_coupons  );
                }
                else
                    {
                        res.send("Error: 404 - Customer Does Not Exist");
                    }
            }
        });
    });





};




