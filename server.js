var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");

var data_serv = require("./data-service");

// setup the static middleware for css
app.use(express.static('public'));

/* ----------- Aditional Routes ----------- */
/* -----------  Public Routes  ------------ */

// Home
app.get("/", (req, res) => {
    res.sendFile( path.join(__dirname, "views/home.html") );
});

// About
app.get("/about", (req, res) => {
    res.sendFile( path.join(__dirname, "views/about.html") );
});

/* -----------  Private Routes  ----------- */

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

        // If successfull, display them as a JSON object.
        res.json(data);

    }).catch((err) => { 
    
        // If an error is thrown, display an error message as a JSON object.
        res.json("{message: 'The minions did done goof again...'}");

    }); //data_serv.getDepartments()

});

/* -----------  Miscellaneous  ------------ */

// Page Not Found (Error 404)
app.get("*", (req, res) => {
    res.status(404).send("Minions! Where is the page? Fetch. Me. The. Page. NOW!");
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

