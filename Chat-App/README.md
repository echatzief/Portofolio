#FrontEnd
--  In order to send the data to the backend we use axios requests
--  We get the input fields using the redux store and triggering some functions 
    which changes the current state
--  We change dynamically the input using onChange 
--  With the axios requests we send the data to the backend server and we search
    the database to find the user.(login)
    For the sign up we find first if the user exists and then if the user doesnt exists
    we create one based on the inputs
--  We have add a listener to submit the form just by pressing 'Enter'
-- The CSS style is included inside the components

** ------------------------------------------ Components------------------------------------------ **
LoginTemplate.js
SignUpTemplate.js
** ------------------------------------------ States --------------------------------------------- **
loginFormEmail ==> email input at the login form
loginFormPassword ==> password input at the login form
signUpFormEmail ==> email input at the sign up form
signUpFormPassword ==> password input at the sign up form
signUpFormUsername ==> username input at the sign up form
signUpFormMemberPassword ==> member password input at the sign up form
** ------------------------------------------ Actions -------------------------------------------- **
changeField ==> changes the state we want based on the type

##Backend
--  We have fixed the routing for the homepage and the /signUp in order to return the correct component
--  For the login we receive the data inside a JSON and then crosscheck the database for their existance
--  For the sign up we check if the user exists in the database and if doesnt exists we create one based on 
    the given inputs
--  For the database we use postgresql in order to create the schema that supports the site
--  We have 4 Tables : Users,Friends,Friend_Requests,Messages
--  We use the Database_Create_Script.sql to create the database schema
--  At every post request to try login or signup we connect to the database and we do what its need

##Post Request Status
--For Login:
    -- 200 ==> Everything is ok
    -- 204 ==> Wrong password/username at login
--For signUp:
    -- 200 ==> Everything is ok
    -- 205 ==> Wrong member password
    -- 204 ==> Already exists at sign up


##To Do :
--  Exw ftiaksei to database schema na to sundesw me thn express 
    kai na to testarw pws trexei
--  Na ftiaxw to UI gia to main kai ta mhnhmata
--  Na ftiaxw na mporei na kanei request gia na kanei add filous
--  Na mporei na aporiptei friend request 
--  Na psaxnei atoma
--  Na deixnei tous online
--  Otan patas na stelnei mnm
--  Na valw emoji
--  Na anevazei eikones

#Done
--  Sign Up Form (backend and frontend)