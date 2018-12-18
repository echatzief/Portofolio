var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8000;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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

// view engine setup

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

            /* Check if the are already friends */
            text='SELECT * FROM Friends F WHERE (F.user_id=$1 and F.friend_id=$2) or (F.friend_id=$1 and F.user_id=$2) '
            values=[my_user_id,friendID];

            client.query(text,values,(err,res)=>{
                
                if(res.rows.length==0){
                    /* Check if the request exists */
                    text='SELECT * FROM friend_requests where (user_id = $1 and friend_id=$2) or (user_id = $2 and friend_id=$1)';
                    values=[my_user_id,friendID];
                    client.query(text,values,(err,res)=>{
                        if(err){
                            console.log(err);
                        }
                        if(res.rows.length==0){

                            /* Add if the request doesnt exists */
                            text="SELECT coalesce(max(count), 0) FROM Friend_requests";
                            client.query(text,(err,res)=>{

                                if(res.rows.length >0){
                                    var count=res.rows[0].coalesce+1;
                                    
                                    text="INSERT INTO friend_requests(count,user_id,friend_id,status) VALUES($3,$1,$2,'NOT ACCEPTED')";
                                    values=[my_user_id,friendID,count];
                                    client.query(text,values,(err,res)=>{
                                        if(err){
                                            console.log(err);
                                        }
                                        console.log("Friend request made.");
                                        
                                        /* Inform all customers that friend request send */
                                        var where={
                                            from:myUsername,
                                            to:usernameOfFriend,
                                        }
                                        io.emit('refreshFriendRequestList',where);
                                    })
                                }
                            
                            })
                        }
                        else{
                            console.log("Friend request exists");
                        }
                        response.sendStatus(200);
                    });
                }
                else{
                    console.log("They are already friends.");
                    response.sendStatus(200);
                }
            });
        })
    })
})

/* Ask for friend requests */
app.post('/getFriendRequest',(req,res)=>{
   
    var usernameOfMe = req.body.username;
    var pagesLimit=req.body.pagesLimit;
    var requestedPage=req.body.requestedPage;
    var response=res;

    console.log("Username: "+usernameOfMe+" Pages: "+pagesLimit+" Requested: "+requestedPage);


    var text='SELECT fromUser.username as fromUser ,toUser.username as toUser, F.status FROM USERS fromUser,USERS toUser,Friend_requests F WHERE '+
    'fromUser.user_id IN (SELECT user_id FROM Users U WHERE U.username=$1) and F.friend_id=toUser.user_id and F.user_id IN (SELECT user_id FROM Users U WHERE U.username=$1) '+
    'and F.friend_id IN (SELECT friend_id FROM friend_requests F, users U WHERE F.user_id=U.user_id '+
    'and F.user_id IN(SELECT user_id FROM Users U WHERE U.username=$1)) '+
    'UNION '+ 
    'SELECT DISTINCT fromUser.username as fromUser,toUser.username as toUser ,F.status FROM Users fromUser,Users toUser,Friend_requests F WHERE '+ 
    'toUser.user_id IN(SELECT user_id FROM Users U WHERE U.username=$1) and fromUser.user_id=F.user_id  and fromUser.user_id in (SELECT F.user_id FROM friend_requests F, users U WHERE F.friend_id= '+
    'U.user_id and F.friend_id IN (SELECT user_id FROM Users U WHERE U.username=$1)) '+
    'LIMIT $2 OFFSET $3';
    var values=[usernameOfMe,pagesLimit,(requestedPage-1)*pagesLimit];
    
    /* Get the friend request per page */
    client.query(text,values,(err,res)=>{
        if(err){
            console.log(err);
        }

        var tempArray=new Array();
        for(var i=0;i<res.rows.length;i++){
            tempArray.push({
                from:res.rows[i].fromuser.trim(),
                to:res.rows[i].touser.trim(),
                status:res.rows[i].status.trim(),
            })
        }

        /* Na ftiaxw to from kai to tou */
        response.send(tempArray);
    })
})

/* Return the number of pages at friend requests */
app.post('/getFriendRequestPages',(req,res)=>{
    
    var usernameOfMe = req.body.username;
    var pagesLimit=req.body.pagesLimit;
    var response=res;

    var text ='SELECT username,F.status from USERS U,friend_requests F WHERE F.friend_id=U.user_id '+
    'and F.user_id=(SELECT user_id FROM Users U WHERE U.username=$1) and U.user_id in(SELECT friend_id FROM friend_requests F, users U WHERE F.user_id=U.user_id '+
    'and F.user_id=(SELECT user_id FROM Users U WHERE U.username=$1)) '+
    'UNION '+
    'SELECT DISTINCT username,F.status FROM Users U,Friend_requests F WHERE  U.user_id=F.user_id and U.user_id in'+
    '(SELECT F.user_id FROM friend_requests F, users U WHERE F.friend_id='+
    'U.user_id and F.friend_id=(SELECT user_id FROM Users U WHERE U.username=$1))'
    var values=[usernameOfMe];

    client.query(text,values,(err,res)=>{
        if(err){
            console.log(err);
        }
        
        console.log("Data: "+res.rows.length+" Limit: "+pagesLimit);
        var pages={
            friendRequestPages:Math.ceil(res.rows.length/pagesLimit),
        }
        response.send(pages);
    })
})

/* Remove request from the database */
app.post('/removeRequest',(req,res)=>{
    var response=res;

    var usernameWhoMade=req.body.usernameWhoMade;
    var usernameWhoReceive=req.body.usernameWhoReceive;

    var text ='SELECT count from Friend_requests F WHERE F.user_id='+
    '(SELECT user_id FROM USERS U WHERE U.username=$1) and F.friend_id='+
    '(SELECT user_id FROM USERS U WHERE U.username=$2)'
    var values=[usernameWhoMade,usernameWhoReceive];

    client.query(text,values,(err,res)=>{
        if(err){
            console.log(err);
        }
        if(res.rows.length >0){
            console.log(res.rows);
            text ='DELETE FROM friend_requests WHERE count=$1';
            values=[res.rows[0].count];
            client.query(text,values,(err,res)=>{
                if(err){
                    console.log(err);
                }
                response.sendStatus(200);
                /* Inform all customers that friend request send */
                 var where={
                    from:usernameWhoMade,
                    to:usernameWhoReceive,
                }
                io.emit('refreshFriendRequestList',where);
            })
        }
        else{
            console.log("No results");
            response.sendStatus(400);
        }
    });
})

/* Accept or decline a request */
app.post('/changeStatus',(req,res)=>{

    /* Get the type */
    var type = req.body.type;
    var response=res;
    var usernameWhoMade=req.body.usernameWhoMade;
    var usernameWhoReceive=req.body.usernameWhoReceive;

    if(type==="Accept"){
        var text ='SELECT count,F.user_id,F.friend_id from Friend_requests F WHERE F.user_id='+
        '(SELECT user_id FROM USERS U WHERE U.username=$1) and F.friend_id='+
        '(SELECT user_id FROM USERS U WHERE U.username=$2)'
        var values=[usernameWhoMade,usernameWhoReceive];

        client.query(text,values,(err,res)=>{
            if(err){
                console.log(err);
            }
            if(res.rows.length >0){
                
                var user_id=res.rows[0].user_id;
                var friend_id=res.rows[0].friend_id;

                /* Update the friend requests table */
                text ='UPDATE friend_requests SET status =$1 WHERE count=$2;';
                values=["ACCEPTED",res.rows[0].count];
                client.query(text,values,(err,res)=>{
                    if(err){
                        console.log(err);
                    }
                    response.sendStatus(200);
                })
               
                text="SELECT coalesce(max(count), 0) FROM friends";
                client.query(text,(err,res)=>{

                    if(res.rows.length >0){
                        var count=res.rows[0].coalesce+1;
                        
                        text="INSERT INTO friends(count,user_id,friend_id) VALUES($3,$1,$2)";
                        values=[user_id,friend_id,count];
                        client.query(text,values,(err,res)=>{
                            if(err){
                                console.log(err);
                            }
                            console.log("Friend has been added.");
                            /* Inform all customers that friend request send */
                            var where={
                                from:usernameWhoMade,
                                to:usernameWhoReceive,
                            }
                            io.emit('refreshFriendRequestList',where);
                            io.emit('refreshFriendList',where);
                        })
                    }
                
                })
            }
            else{
                console.log("No results");
                response.sendStatus(400);
            }
        });
    }
    else if(type==="Decline"){
        var text ='SELECT count from Friend_requests F WHERE F.user_id='+
        '(SELECT user_id FROM USERS U WHERE U.username=$1) and F.friend_id='+
        '(SELECT user_id FROM USERS U WHERE U.username=$2)'
        var values=[usernameWhoMade,usernameWhoReceive];

        client.query(text,values,(err,res)=>{
            if(err){
                console.log(err);
            }
            if(res.rows.length >0){
                console.log(res.rows);
                text ='UPDATE friend_requests SET status =$1 WHERE count=$2;';
                values=["DECLINED",res.rows[0].count];
                client.query(text,values,(err,res)=>{
                    if(err){
                        console.log(err);
                    }
                    response.sendStatus(200);
                    /* Inform all customers that friend request send */
                    var where={
                        from:usernameWhoMade,
                        to:usernameWhoReceive,
                    }
                    io.emit('refreshFriendRequestList',where);
                })
            }
            else{
                console.log("No results");
                response.sendStatus(400);
            }
        });
    }
});

/* Get friends */
app.post('/getFriends',(req,res)=>{

    /* Get the parameters */
    var username=req.body.username;
    var response=res;

    /* Get the friends with a query */
    var text ='SELECT username FROM USERS WHERE user_id IN('+
        'SELECT F.friend_id FROM Friends F WHERE F.user_id IN (SELECT user_id FROM USERS WHERE username=$1)'+ 
        'UNION'+
        ' SELECT F.user_id FROM Friends F WHERE F.friend_id IN(SELECT user_id FROM USERS WHERE username=$1))'
    var values=[username];
    client.query(text,values,(err,res)=>{
        if(err){
            console.log(err);
        }

        var friendArray = new Array();
        for(var i=0;i<res.rows.length;i++){
            friendArray.push(res.rows[i].username.trim());
        }
        response.send(friendArray);
    })
})

/*--------------------------------------------- SOCKETS -----------------------------------------------*/


/* Run the app */
http.listen(PORT,()=>{
    console.log("Start app at port: "+PORT);
});
module.exports = app;
