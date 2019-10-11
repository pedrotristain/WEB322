/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Pedro Zelada Souza Student ID: 116427188 Date: 10-10-2019
*
*  Online (Heroku) Link: https://radiant-wave-15972.herokuapp.com/
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");

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

// setup the middleware body parser
app.use(bodyParser.urlencoded({ extended: true }));

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

function displayEmployees(data, res) {
    res.json(data);
}

// Employees
app.get("/employees", (req, res) => {
    
    // If quer.statyus, fetch employees by status
    if(req.query.status)
        data_serv.getEmployeesByStatus(req.query.status)
            .then((data) => { res.json(data); })
            .catch((err) => { res.json("{message: '" + err + "'}"); });

    // Else, if query.department, fetch employee by department number
    else if(req.query.department)
        data_serv.getEmployeesByDepartment(req.query.department)
            .then((data) => { res.json(data); })
            .catch((err) => { res.json("{message: '" + err + "'}"); });
    
    // Else, if query.manager, fetch employee by manager number
    else if(req.query.manager)
        data_serv.getEmployeesByManager(req.query.manager)
            .then((data) => { res.json(data); })
            .catch((err) => { res.json("{message: '" + err + "'}"); });

    // Else, fetch all employees
    else 
        // Attempt to get all the employees.
        data_serv.getAllEmployees().then((data) => {

            // If successfull, display them as a JSON object.
            res.json(data);

        }).catch((err) => { 
        
            // If an error is thrown, display an error message as a JSON object.
            res.json("{message: '" + err + "'}");

        }); //data_serv.getAllEmployees()

}); // app.get("/employees")

app.get("/employees/:num", (req, res) => {

    data_serv.getEmployeeByNum(req.params.num).then((data) => {

        res.json(data);

    })
    .catch((err => {

        // If an error is thrown, display an error message as a JSON object.
        res.json("{message: '" + err + "'}");

    })); // data_serv.getEmployeeByNum()

}); // app.get("/employees/:num")

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

}); // app.get("/managers")

// Departments
app.get("/departments", (req, res) => {
    
    // Attempt to get only the departments that are managers.
    data_serv.getDepartments().then((data) => {

        // If successfull, display them as a JSON object.
        res.json(data);

    }).catch((err) => { 
    
        // If an error is thrown, display an error message as a JSON object.
        res.json("{message: 'The minions did done goof again...'}");

    }); //data_serv.getDepartments()

}); // app.get("/departments")

// Images
app.get("/images", (req, res) => {
    
    var _path = "./public/images/uploaded";
    var data = { "images" : [] };

    // Read the files in the images/uploaded folder
    fs.readdir(_path, function(err, items) {

        data.images = items;

        // Reply with the json object
        res.json(data);

    }); // fs.readdir()
    
}); // app.get("/images")

// Add Employees
app.get("/employees/add", (req, res) => {
    res.sendFile( path.join(__dirname, "views/addEmployee.html") );
});

// Add Images
app.get("/images/add", (req, res) => {
    res.sendFile( path.join(__dirname, "views/addImage.html") );
});


/* -----------  POST Routes  ----------- */

// Image Add
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    
    res.redirect("/images");

});

// Employee Add
app.post("/employees/add", (req, res) => {

    data_serv.addEmployee(req.body).then((data) => {
    
        res.redirect("/employees");

    }); // addEmployee(req.body)

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

