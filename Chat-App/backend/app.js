var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8000;

/* Postgresql Module */
const { Pool, Client } = require('pg');

/* Client configuration in order to handle requests */
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'eidiko_thema',
    password: 'postgres',
    port: 5432,
})
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/* -----------------------------------------------Main Routing ----------------------------------------------*/
app.get('/',(req,res)=>{
    res.sendFile( path.join( __dirname, '/../frontend/build', 'index.html' ));
})

app.get('/signUp',(req,res)=>{
    res.sendFile( path.join( __dirname, '/../frontend/build', 'index.html' ));
})

//Under everything
app.use(express.static(path.join(__dirname, '/../frontend/build')));

/*--------------------------------------------- Requests ----------------------------------------------------*/
app.post('/tryToLogin',(req,res)=>{

    /* Get the login credentials */
    var email=req.body.loginUserInterface.email;
    var password=req.body.loginUserInterface.password;

    console.log("Login: ");
    console.log("Email: "+req.body.loginUserInterface.email+" Password: "+req.body.loginUserInterface.password);

    /* Connect to the database and search for user if exists */
    client.connect();

    /* Do stuff */

    /* Close the connection */
    client.end();

});

app.post('/tryToSignUp',(req,res)=>{

    /* Get the Sign Up Credentials */
    var email=req.body.signUpInterface.email;
    var username=req.body.signUpInterface.username;
    var password=req.body.signUpInterface.password;
    var memberPassword=req.body.signUpInterface.memberPassword;
    
    console.log("Sign Up: ");
    console.log("Email: "+email+" Username: "+username+" Password: "+password+" Member Password: "+memberPassword);
})


/* Run the app */
app.listen(PORT,()=>{
    console.log("App is running at port: "+PORT);
});


module.exports = app;
