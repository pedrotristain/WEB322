/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Pedro Zelada Souza Student ID: 116427188 Date: 10-10-2019
*
*  Online (Heroku) Link: https://pzelada-souza-web322.herokuapp.com/
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var multer = require("multer");
var fs = require("fs");

// Upload set up
const storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

var data_serv = require("./data-service");

// setup the static middleware for css
app.use(express.static('public'));

/* ----------- Aditional Routes ----------- */

/* -----------  GET Routes  ------------ */

// Home
app.get("/", (req, res) => {
    res.sendFile( path.join(__dirname, "views/home.html") );
});

// About
app.get("/about", (req, res) => {
    res.sendFile( path.join(__dirname, "views/about.html") );
});

// Employees
app.get("/employees", (req, res) => {
    
    //res.send("To DO: Tell the minions to fetch me all the employees that are managers. And do it F A S T!");
    
    // Attempt to get all the employees.
    data_serv.getAllEmployees().then((data) => {

        // If successfull, display them as a JSON object.
        res.json(data);

    }).catch((err) => { 
    
        // If an error is thrown, display an error message as a JSON object.
        res.json("{message: 'The minions did done goof again...'}");

    }); //data_serv.getAllEmployees()

});

// Managers
app.get("/managers", (req, res) => {
    
    // Attempt to get only the employees that are managers.
    data_serv.getManagers().then((data) => {

        // If successfull, display them as a JSON object.
        res.json(data);

    }).catch((err) => { 
    
        // If an error is thrown, display an error message as a JSON object.
        res.json("{message: 'The minions did done goof again...'}");

    }); //data_serv.getManagers()

});

// Departments
app.get("/departments", (req, res) => {
    
    // Attempt to get only the departments that are managers.
    data_serv.getDepartments().then((data) => {

        console.log(data);

        // If successfull, display them as a JSON object.
        res.json(data);

    }).catch((err) => { 
    
        // If an error is thrown, display an error message as a JSON object.
        res.json("{message: 'The minions did done goof again...'}");

    }); //data_serv.getDepartments()

});

// Images
app.get("/images", (req, res) => {
    
    var _path = "./public/images/uploaded";
    var data = { "images" : [] };

    // Read the files in the images/uploaded folder
    fs.readdir(_path, function(err, items) {

        data.images = items;

        // Reply with the json object
        res.json(data);

    });
    
});

// Add Employees
app.get("/employees/add", (req, res) => {
    res.sendFile( path.join(__dirname, "views/addEmployee.html") );
});

// Add Images
app.get("/images/add", (req, res) => {
    res.sendFile( path.join(__dirname, "views/addImage.html") );
});


/* -----------  POST Routes  ----------- */

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

/* -----------  Miscellaneous  ------------ */

// Page Not Found (Error 404)
app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views/404.html"));
});

/* ---------------------------------------- */

// setup http server to listen on HTTP_PORT
// Only after the initialize function has been resolved.
data_serv.initialize().then(() => { 

    // Start the server.
    app.listen(HTTP_PORT);

    console.log("Express http server listening on '" + HTTP_PORT + "'");

    

}).catch(() => {

    // Throw an error.
    console.log("Minions! Fix the server! NOW!");

});

