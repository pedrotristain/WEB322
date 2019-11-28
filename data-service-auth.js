// Set up bcryptjs
const bcrypt = require('bcryptjs');

// Set up mongoose and Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName : {
      type : String,
      unique : true
    },
    password : String,
    email : String,
    loginHistory : [{
        dateTime : Date,
        userAgent : String
    }]
});

let User;

// Initialize the mongodb services
// Establish connection and create schemas if needed
module.exports.initialize = function () {

    return new Promise(function (resolve, reject) {

        let db = mongoose.createConnection("mongodb+srv://pzelada-souza:bZZgGiOgJT7bFL16@web322-tclch.mongodb.net/test?retryWrites=true&w=majority");
        
        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        }); // db.on()
        
        db.once('open', ()=>{
            User = db.model("users", userSchema);
            resolve();
        }); // db.once()

    }); // return new Promise()

}; // initialize()

// Register a new user
module.exports.registerUser = function(userData){

    return new Promise(function (resolve, reject){

        // Check if password and password confirmation match. If FALSE, reject the promise.
        if(userData.password != userData.password2)
            reject("Passwords do not match");
        
        // If passwords match, create new user
        let newUser = new User(userData);

        // Generate a "salt" using 10 rounds
        bcrypt.genSalt(10, function(err, salt) { 

            // Encrypt user password.
            bcrypt.hash(newUser.password, salt, function(err, hash) { 

                // If it failed for any reason, reject the promise with error message
                if(err)
                    reject("There was an error encrypting the password");
                
                // Otherwise, store the user data in the database
                else {

                    // Set the user password to the encrypted version
                    newUser.password = hash;
                    newUser.password2 = hash;

                    // Attempt to save the new user on the database
                    newUser.save((err) => {
                        
                        // If there was an error, reject the promise with according message.
                        if(err){
            
                            // Check if the error was duplicate key. If TRUE, reject promise with USER TAKEN message.
                            if(err.code == 11000)
                                reject("User Name already taken");
                            
                            // If not duplicate key, reject the promise with according error message.
                            else
                                reject("There was an error creating the user: " + err);
            
                        } // if(err)
                        
                        // If there was no error, resolve the promise with no message
                        else
                            resolve();
            
                    }); // newUser.save()

                } // else

            }); // bcrypt.hash()

        }); // bcrypt.genSalt()

    }); // return new Promise()

}; // registerUser()

// Try to authenticate the user
module.exports.checkUser = function(userData) {

    return new Promise(function (resolve, reject){
    
        // Try to find the user in the database
        User.find({ userName : userData.userName }).exec()
            
        // If .find() resolved succcesfully:
        .then((user) => {

            // Check if any user was found. If FALSE, reject promise with USER NOT FOUND message.
            if(user.length == 0)
                reject("Unable to find user: " + userData.userName);
            
            // If an user was found, check if the password matches the received one. If not, reject the promise with PASSWORD MISMATCH message.
            else{

                console.log('%c' + userData.password, 'color:orange');
                console.log('%c' + user[0].password, 'color:cyan');

                // Compare the received password with the encrypted password in the database
                bcrypt.compare(userData.password, user[0].password)
                
                // If the comparison succeeded, check if the passwords match
                .then((res) => {
                    
                    // If the passwords do not match, reject the promise with an error message and leave the function
                    if(res === fail)
                        reject("Incorrect Password for user: " + userData.userName);

                    // Push the new login into the login history
                    user[0].loginHistory.push({ 
                        dateTime : new Date().toString(),
                        userAgent : userData.userAgent
                    }); // push()
        
                    // Update the database with the new login history
                    User.updateOne(
                        { userName : userData.userName },
                        { $set : { loginHistory : user[0].loginHistory }}
                    ).exec()
                    
                    // If the update was successful, resolve the promise and return the found user 
                    .then(() => { resolve(user[0]); })
        
                    // Otherwise, reject the promise with an error message
                    .catch((err) => {
                        reject("There was an error verifying the user: " + err);
                    }); // update()

                }) // then()
                
                // If the comparison fail, reject the promise with an error message
                .catch((err) => {
                    reject("There was an error when attempting to log in: " + err); 
                    // Just so you know: this error message is insecure as it tells that your login is correct.
                });

            } // else

        }) // find().then()

        // If find() failed, reject the promise with an error message
        .catch((err) => {
            reject("Unable to find user: " + userData.userName);
        }); // catch()
    
    }); // Promise()

}; // checkUser()