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
    database: 'WebChat',
    password: 'postgres',
    port: 5432,
})

/* Connect to the database */
client.connect();


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

app.get('/frontPanel/*',(req,res)=>{
    res.sendFile( path.join( __dirname, '/../frontend/build', 'index.html' ));
})

//Under everything
app.use(express.static(path.join(__dirname, '/../frontend/build')));

/*--------------------------------------------- Requests ----------------------------------------------------*/
app.post('/tryToLogin',(req,res)=>{

    /* Get the login credentials */
    var email=req.body.loginUserInterface.email;
    var password=req.body.loginUserInterface.password;
    var response=res;

    console.log("Login: ");
    console.log("Email: "+req.body.loginUserInterface.email+" Password: "+req.body.loginUserInterface.password);

    /* The parameters for the query */
    const text = 'SELECT * FROM USERS WHERE email=$1 and password=$2';
    const values = [email, password];

    /* Check if the client exists */
    client.query(text,values,(err,res)=>{
        if(res.rows.length  == 0){
            response.sendStatus(204);
        }
        else{
            /* Return the username */
            response.send(res.rows[0].username.trim());
        }
    })
    
});

app.post('/tryToSignUp',(req,res)=>{

    /* Get the Sign Up Credentials */
    var email=req.body.signUpInterface.email.trim();
    var username=req.body.signUpInterface.username.trim();
    var password=req.body.signUpInterface.password.trim();
    var memberPassword=req.body.signUpInterface.memberPassword.trim();
    var response=res;
    
    console.log("Sign Up: ");
    console.log("Email: "+email+" Username: "+username+" Password: "+password+" Member Password: "+memberPassword);

    /* If the member password is correct */
    if(memberPassword ==="webchat"){

        /* The parameters for the query */
        const text = 'SELECT * FROM USERS WHERE username=$1 and password=$2 and email=$3';
        const values = [username, password,email];

        /* Check if the user exists */
        client.query(text, values, (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
              
                /* If the user dont exist we create them else we return error */
                if(res.rows.length == 0){
                    
                    /* Count all the users */
                    const q = 'SELECT * FROM USERS';
                    client.query(q,(err,res)=>{
                        if(err){
                            console.log(err.stack)
                        }
                        else{

                            /* Insert a new user */
                            const user_ID=res.rows.length + 1 ;
                            const textQuery = 'INSERT INTO USERS(username,password,user_id,email,status) '+
                            'VALUES($1,$2,$4,$3,$5)';
                            const valuesQuery = [username, password,email,user_ID,'NO ACTIVE'];
                            
                            client.query(textQuery,valuesQuery,(err,res)=>{
                                if(err){
                                    console.log(err.stack)
                                }
                                else{
                                    console.log(username+" added to USERS.");  
                                }
                            })

                            /* Everything ok */
                            response.sendStatus(200);
                        }
                    })
                }
                else{
                    /* User already exists */
                    response.sendStatus(204);
                }
            }
        })
    }
    else{
        /* Wrong member password */
        response.sendStatus(205);
    }
   
})

app.post('/getResultsByUsername',(req,res)=>{
    
    /* Get the username for the query */
    var username=req.body.username;
    var response = res;
    
    /* The parameters for the query */
    const text = 'SELECT * FROM USERS WHERE username=$1';
    const values = [username];
    
    client.query(text, values, (err, res) => {
        if(res.rows.length == 0){
            response.sendStatus(204);
        }
        else{
            var data=res.rows;
            response.send(data);
        }
    })
});

/* Add a Friend */
app.post('/addFriendByUsername',(req,res)=>{

    
    var usernameOfFriend = req.body.usernameOfFriend;
    var myUsername=req.body.myUsername;
    var response =res;

    var text='SELECT user_id FROM USERS WHERE username=$1';
    var values=[usernameOfFriend];
    /* Get the id of the friend */
    client.query(text,values,function(err,res){
        if(err){
           console.log(err);
        }
        var friendID=res.rows[0].user_id;
        text='SELECT user_id FROM USERS WHERE username=$1';
        values=[myUsername];
        /* Get my id */
        client.query(text,values,(err,res)=>{
            if(err){
                console.log(err);
            }
            var my_user_id=res.rows[0].user_id;

            /* Check if the request exists */
            text='SELECT * FROM friend_requests where (user_id = $1 and friend_id=$2) or (user_id = $2 and friend_id=$1)';
            values=[my_user_id,friendID];
            client.query(text,values,(err,res)=>{
                if(err){
                    console.log(err);
                }
                if(res.rows.length==0){
                    /* Add if the request doesnt exists */
                    text="INSERT INTO friend_requests(user_id,friend_id,status) VALUES($1,$2,'NOT ACCEPTED')";
                    values=[my_user_id,friendID];
                    client.query(text,values,(err,res)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log("Friend request made.");
                    })
                }
                else{
                    console.log("Friend request exists");
                }
                response.sendStatus(200);
            });

        })
    })

    

})


/* Run the app */
app.listen(PORT,()=>{
    console.log("App is running at port: "+PORT);
});


module.exports = app;
