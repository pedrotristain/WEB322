/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Pedro Zelada Souza Student ID: 116427188 Date: 27-11-2019
*
*  Online (Heroku) Link: https://pzelada-souza-web322.herokuapp.com/
*
********************************************************************************/ 



var HTTP_PORT = process.env.PORT || 8080;
var express = require('express');
var app = express();

const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const clientSessions = require('client-sessions');
const data_serv = require('./data-service');
const dataServiceAuth = require('./data-service-auth');

// Upload set up
const storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + path.extname(file.originalname));
    }
});

// Multer setup
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

// Render engine setup
app.set('view engine', '.hbs');

// setup the static middleware for css
app.use(express.static('public'));

// setup the middleware body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Navbar fix for active link
app.use(function(req,res,next){

    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();

}); // app.use()

// Set up client-sessions
app.use(clientSessions({

    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "web322_lab6_secret_session", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)

})); // app.use()

// Set up session middleware
app.use(function(req, res, next) {
    
    res.locals.session = req.session;
    next();

}); // app.use()

// Helper middleware that checks if user is logged in
function ensureLogin(req, res, next) {
    
    // If user is not logged in, redirect the page to /login
    if (!req.session.user)
        res.redirect("/login");

    // Otherwise, proceed with execution
    else
        next();

} // ensureLogin()



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

app.get("/employees", ensureLogin, (req, res) => {
    
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

app.get("/employee/:num", ensureLogin, (req, res) => {

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
app.get("/employees/add", ensureLogin, (req, res) => {
    
    data_serv.getDepartments().then((data) => {

        res.render('addEmployee', { departments : data });

    })
    .catch((err) => {

        res.render('addEmployee', { departments : [] });

    });

}); // app.get("/employees/add")

// Delete Employee
app.get("/employees/delete/:emp_num", ensureLogin, (req, res) => {
    
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
app.post("/employees/add", ensureLogin, (req, res) => {

    data_serv.addEmployee(req.body).then((data) => {
    
        res.redirect("/employees");

    })
    .catch((err) => { res.status(500).send("Failed when adding employee.") }); // addEmployee(req.body)

});

// Employee Update
app.post("/employee/update", ensureLogin, (req, res) => {

    data_serv.updateEmployee(req.body).then((data) => {

        res.redirect("/employees");

    })
    .catch((err) => { res.status(500).send("Failed when updating employee.") }); // updateEmployee()

});


// ----------------------------------------
//          Departments GET Routes
// ----------------------------------------


app.get("/departments", ensureLogin, (req, res) => {
    
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

app.get("/department/:id", ensureLogin, (req, res) => {

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
app.get("/departments/add", ensureLogin, (req, res) => {
    res.render('addDepartment');
});

// Delete Department
app.get("/departments/delete/:id", ensureLogin, (req, res) => {
    
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
app.post("/departments/add", ensureLogin, (req, res) => {

    data_serv.addDepartment(req.body).then((data) => {
    
        res.redirect("/departments");

    })
    .catch((err) => { res.status(500).send("Failed when adding department.") }); // addDepartment(req.body)

});

// Department Update
app.post("/departments/update", ensureLogin, (req, res) => {

    data_serv.updateDepartment(req.body).then((data) => {

        res.redirect("/departments");

    })
    .catch((err) => { res.status(500).send("Failed when updating department.") }); // updateDepartment()

});


// ----------------------------------------
//            Images GET Routes
// ----------------------------------------


app.get("/images", ensureLogin, (req, res) => {
    
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
app.get("/images/add", ensureLogin, (req, res) => {
    res.render('addImage');
});


// ----------------------------------------
//            Images POST Routes
// ----------------------------------------


// Image Add
app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {
    
    res.redirect("/images");

});



// ----------------------------------------
//        Authentication GET Routes
// ----------------------------------------

// Login page
app.get("/login", (req, res) => {
    res.render('login');
});

// Register page
app.get("/register", (req, res) => {
    res.render('register');
});

// Logout
app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/login");
});

// Get history
app.get("/userHistory", ensureLogin, (req, res) => {
    res.render('userHistory');
});



// ----------------------------------------
//       Authentication POST Routes
// ----------------------------------------

// Login submit
app.post("/login", (req, res) => {

    // Set the body object userAgent to the user's User Agent
    req.body.userAgent = req.get('User-Agent');

    // Attempt to login
    dataServiceAuth.checkUser(req.body)
    
    // If successful, set the user's data to the local session and redirect the page to /employees
    .then((user) => {

        req.session.user = {

            userName : user.userName,
            email : user.email,
            loginHistory : user.loginHistory

        } // req.session.user

        res.redirect('/employees');

    }) // then()

    // Otherwise render the login page with an error message
    .catch((err) => {

        res.render('login', { errorMessage : err, userName : req.body.userName });

    }); // catch()
});

// Register submit
app.post("/register", (req, res) => {

    // Attempt to register new user
    dataServiceAuth.registerUser(req.body)

    // If successful, display a message confirming new user registration
    .then(() => {

        res.render('register', { successMessage : "User created successfully"});

    }) // then()

    // Display an error message otherwise
    .catch((err) => {

        res.render('register', { errorMessage : err, userName : req.body.userName });

    }); // catch()

}); // app.post('register')



// ----------------------------------------
//         Miscellaneous GET Routes
// ----------------------------------------


// Page Not Found (Error 404)
app.get("*", (req, res) => {
    res.status(404).render('404');
});


// ----------------------------------------
//          Server Initialization
// ----------------------------------------


// setup http server to listen on HTTP_PORT
// Only after the initialize function has been resolved.
data_serv.initialize()
.then(dataServiceAuth.initialize) // Initialize authentication services
.then(() => { 

    // Start the server.
    app.listen(HTTP_PORT);

    console.log("Express http server listening on '" + HTTP_PORT + "'");

}).catch(() => {

    // Throw an error.
    console.log("Minions! Fix the server! NOW!");

});

