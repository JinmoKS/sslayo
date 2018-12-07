// server.js
// load the things we need
var express = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors  = require('cors');
var app      = express();
var port     = process.env.PORT || 7777;
var flash    = require('connect-flash');
var ip = require("ip");




// set the view engine to ejs
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(flash()); // use connect-flash for flash messages stored in session
app.engine("html", require("ejs").renderFile);

app.use(express.static('/public'));
app.use(cookieParser());
app.use(cors());
// var sessionCookie;
// routes ======================================================================

// require('./app/mobile.js')(app);
// require('./app/maps.js')(app);
// require('./app/admin.js')(app);
// require('./app/web.js')(app);
// require('./app/customers.js')(app);
require('./app/points.js')(app);
require('./app/user.js')(app);
require('./app/employee.js')(app);

// var employee = require('./app/employee.js');
// app.use('/employee', employee);


// require('./app/routes.js')(app); // load our routes and pass in our app and fully configured passport
// app.post('/',function(req,res){
//     var username = req.body.username;
//     var htmlData = 'Hello:' + username;
//     res.send(htmlData);
//     console.log(htmlData);
// });

var currentIP = ip.address();

console.log(currentIP);
app.listen(port);
console.log( port + ' is the magic port');
console.log(ip.address() );
