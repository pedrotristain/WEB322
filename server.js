/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Pedro Zelada Souza Student ID: 116427188 Date: 14-11-2019
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


// ----------------------------------------
//             Default GET Routes
// ----------------------------------------


// Home
app.get("/", (req, res) => {
    res.render('home');
});

// About
app.get("/about", (req, res) => {
    res.render('about');
});


// ----------------------------------------
//          Employees GET Routes
// ----------------------------------------

app.get("/employees", (req, res) => {
    
    // If quer.statyus, fetch employees by status
    if(req.query.status)
        data_serv.getEmployeesByStatus(req.query.status)
            .then((data) => {
                    
                // If any employee was retrieved, display them
                if(data.length > 0)
                    res.render('employees', { employees: data });
                // Otherwise, display a message that no employees could be retrieved
                else
                    res.render('employees', { message : 'No employees could be found.'});

            })
            .catch((err) => { res.render({message: "No Results For Employees By Status"}); });

    // Else, if query.department, fetch employee by department number
    else if(req.query.department)
        data_serv.getEmployeesByDepartment(req.query.department)
            .then((data) => {

                // If any employee was retrieved, display them
                if(data.length > 0)
                    res.render('employees', { employees: data });
                // Otherwise, display a message that no employees could be retrieved
                else
                    res.render('employees', { message : 'No employees could be found.'});

            })
            .catch((err) => { res.render({message: "No Results For Employees By Department"}); });
    
    // Else, if query.manager, fetch employee by manager number
    else if(req.query.manager)
        data_serv.getEmployeesByManager(req.query.manager)
            .then((data) => {

                // If any employee was retrieved, display them
                if(data.length > 0)
                    res.render('employees', { employees: data });
                // Otherwise, display a message that no employees could be retrieved
                else
                    res.render('employees', { message : 'No employees could be found.'});
        
            })
            .catch((err) => { res.render({message: "No Results For Employees By Manager"}); });

    // Else, fetch all employees
    else 
        // Attempt to get all the employees.
        data_serv.getAllEmployees().then((data) => {

            // If any employee was retrieved, display them
            if(data.length > 0)
                res.render('employees', { employees: data });
            // Otherwise, display a message that no employees could be retrieved
            else
                res.render('employees', { message : 'No employees could be found.'});

        }).catch((err) => { 
        
            console.log(err);
            // If an error is thrown, display an error message
            res.render({message: "There was an error when attempting to retrieve the employees."});

        }); //data_serv.getAllEmployees()

}); // app.get("/employees")

app.get("/employee/:num", (req, res) => {

    // initialize a temporary empty object to store the values
    let viewData = { employee : null, departments : [] };

    data_serv.getEmployeeByNum(req.params.num).then((data) => {

        // If any employee was found, add it to the temporary object
        if(data.length > 0)
            viewData.employee = data[0];
        else
            viewData.employee = null;

    })
    .catch((err) => {

        viewData.employee = null;

    })
    .then(data_serv.getDepartments)
        .then((data) =>{
            viewData.departments = data;

            // Iterate through the departments array and look for the same department as the employee's
            // Set it's attribute 'selected' to true if found.
            for(let x = 0; x < viewData.departments.length; x++)
                if(viewData.departments[x].departmentId == viewData.employee.department)
                    viewData.departments[x].selected = true;
            
        })
        .catch((err) => {
            viewData.departments = [];
            console.log("data_serv.getDepartments() : Failed")
        })
    .catch((err) => { res.status(500).send("Failed when retrieving departments.") })
    .then(() => {

        // if no employee - return an error
        if (viewData.employee == null) { 
            res.status(404).render("404", { title : 'Employee Not Found', message : 'The department you tried to reach is unavailable at the moment. Try again later'});
        } else {
            res.render("employee", { viewData : viewData }); // render the "employee" view
        }

    })
    .catch((err) => { res.status(500).send("Failed when rendering employee view.") }); // data_serv.getEmployeeByNum()

}); // app.get("/employees/:num")

// Add Employees
app.get("/employees/add", (req, res) => {
    
    data_serv.getDepartments().then((data) => {

        res.render('addEmployee', { departments : data });

    })
    .catch((err) => {

        res.render('addEmployee', { departments : [] });

    });

}); // app.get("/employees/add")

// Delete Employee
app.get("/employees/delete/:emp_num", (req, res) => {
    
    data_serv.deleteEmployeeByNum(req.params.emp_num).then(() => {

        res.redirect("/employees");

    })
    .catch((err) => {

        res.status(500).send("Unable to Remove Employee / Employee not found");

    }); // data_serv.deleteEmployeeByNum()

});


// ----------------------------------------
//            Employees POST Routes
// ----------------------------------------


// Employee Add
app.post("/employees/add", (req, res) => {

    data_serv.addEmployee(req.body).then((data) => {
    
        res.redirect("/employees");

    })
    .catch((err) => { res.status(500).send("Failed when adding employee.") }); // addEmployee(req.body)

});

// Employee Update
app.post("/employee/update", (req, res) => {

    data_serv.updateEmployee(req.body).then((data) => {

        res.redirect("/employees");

    })
    .catch((err) => { res.status(500).send("Failed when updating employee.") }); // updateEmployee()

});


// ----------------------------------------
//          Departments GET Routes
// ----------------------------------------


app.get("/departments", (req, res) => {
    
    // Attempt to get all departments.
    data_serv.getDepartments().then((data) => {

        // If any department was retrieved, display them
        if(data.length > 0)
            res.render('departments', { departments: data });
        // Otherwise, display a message that no departments could be retrieved
        else
            res.render('departments', { message : 'No departments could be found.'});

    }).catch((err) => { 
    
        // If an error is thrown, display an error message.
        res.render("departments", {message: "No Departments Found"});

    }); //data_serv.getDepartments()

}); // app.get("/departments")

app.get("/department/:id", (req, res) => {

    data_serv.getDepartmentById(req.params.id).then((data) => {

        // If any department is found, display it
        if(data.length > 0)
            res.render('department', { department: data[0] });
        // Otherwise, display the 404 page
        else
            res.status(404).render('404', { title : 'Department Not Found', message : 'The department you tried to reach is unavailable at the moment. Try again later'});

    })
    .catch((err) => {

        // If an error is thrown, display an error message.
        res.status(404).render('404', { title : 'Error when retrieving Department', message : 'The department you tried to reach is unavailable at the moment. Try again later'});

    }); // data_serv.getEmployeeByNum()

}); // app.get("/department/:num")

// Add Department
app.get("/departments/add", (req, res) => {
    res.render('addDepartment');
});

// Delete Department
app.get("/departments/delete/:id", (req, res) => {
    
    data_serv.deleteDepartmentById(req.params.id).then(() => {

        res.redirect("/departments");

    })
    .catch((err) => {

        res.status(500).send("Unable to Remove Department / Department not found");

    }); // data_serv.deleteDepartmentById()

});


// ----------------------------------------
//            Department POST Routes
// ----------------------------------------


// Department Add
app.post("/departments/add", (req, res) => {

    data_serv.addDepartment(req.body).then((data) => {
    
        res.redirect("/departments");

    })
    .catch((err) => { res.status(500).send("Failed when adding department.") }); // addDepartment(req.body)

});

// Department Update
app.post("/departments/update", (req, res) => {

    data_serv.updateDepartment(req.body).then((data) => {

        res.redirect("/departments");

    })
    .catch((err) => { res.status(500).send("Failed when updating department.") }); // updateDepartment()

});


// ----------------------------------------
//            Images GET Routes
// ----------------------------------------


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

// Add Images
app.get("/images/add", (req, res) => {
    res.render('addImage');
});


// ----------------------------------------
//            Images POST Routes
// ----------------------------------------


// Image Add
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    
    res.redirect("/images");

});



// ----------------------------------------
//         Miscellaneous GET Routes
// ----------------------------------------


// Page Not Found (Error 404)
app.get("*", (req, res) => {
    res.status(404).render('404');
});


// ----------------------------------------
// ----------------------------------------


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

