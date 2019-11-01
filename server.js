/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Pedro Zelada Souza Student ID: 116427188 Date: 31-10-2019
*
*  Online (Heroku) Link: https://pzelada-souza-web322.herokuapp.com/
*
********************************************************************************/ 



var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');

// Upload set up
const storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Handlebars set up
app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

// setup the static middleware for css
app.use(express.static('public'));

// setup the middleware body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set up control module
var data_serv = require("./data-service");

// Navbar fix for active link
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

/* ----------- Aditional Routes ----------- */

/* -----------  GET Routes  ------------ */

// Home
app.get("/", (req, res) => {
    res.render('home');
});

// About
app.get("/about", (req, res) => {
    res.render('about');
});

function displayEmployees(data, res) {
    res.json(data);
}

// Employees
app.get("/employees", (req, res) => {
    
    // If quer.statyus, fetch employees by status
    if(req.query.status)
        data_serv.getEmployeesByStatus(req.query.status)
            .then((data) => { res.render('employees', { employees: data }); })
            .catch((err) => { res.render({message: "No Results For Employees By Status"}); });

    // Else, if query.department, fetch employee by department number
    else if(req.query.department)
        data_serv.getEmployeesByDepartment(req.query.department)
            .then((data) => { res.render('employees', { employees: data }); })
            .catch((err) => { res.render({message: "No Results For Employees By Department"}); });
    
    // Else, if query.manager, fetch employee by manager number
    else if(req.query.manager)
        data_serv.getEmployeesByManager(req.query.manager)
            .then((data) => { res.render('employees', { employees: data }); })
            .catch((err) => { res.render({message: "No Results For Employees By Manager"}); });

    // Else, fetch all employees
    else 
        // Attempt to get all the employees.
        data_serv.getAllEmployees().then((data) => {

            // If successfull, display them as a JSON object.
            res.render('employees', { employees: data });

        }).catch((err) => { 
        
            // If an error is thrown, display an error message as a JSON object.
            res.render({message: "No Results For All Employees"});

        }); //data_serv.getAllEmployees()

}); // app.get("/employees")

app.get("/employee/:num", (req, res) => {

    data_serv.getEmployeeByNum(req.params.num).then((data) => {

        res.json(data);

    })
    .catch((err => {

        // If an error is thrown, display an error message as a JSON object.
        res.json("{message: '" + err + "'}");

    })); // data_serv.getEmployeeByNum()

}); // app.get("/employees/:num")

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
        res.render('images', data);

    }); // fs.readdir()
    
}); // app.get("/images")

// Add Employees
app.get("/employees/add", (req, res) => {
    res.render('addEmployee');
});

// Add Images
app.get("/images/add", (req, res) => {
    res.render('addImage');
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
    res.status(404).render('404');
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

