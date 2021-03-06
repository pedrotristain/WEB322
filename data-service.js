// Required modules
const Sequelize = require('sequelize');

// Setting up Database configuration
var sequelize = new Sequelize('de60tk1ii5hl8i', 'tggqqoeeagnwbc', '1e3948f0a7dcef779d3d695f80688c844d722af6fd1e0a9c3a3195abcafa7904', {
    host: 'ec2-54-243-239-199.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
}); // new Sequelize(); as

// Establishing database connection
sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

// Defining the data models
var Employee = sequelize.define('Employee', {

    employeeNum : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    firstName : Sequelize.STRING,
    lastName : Sequelize.STRING,
    email : Sequelize.STRING,
    SSN : Sequelize.STRING,
    addressStreet : Sequelize.STRING,
    addressCity : Sequelize.STRING,
    addressState : Sequelize.STRING,
    addressPostal : Sequelize.STRING,
    maritalStatus : Sequelize.STRING,
    isManager : Sequelize.BOOLEAN,
    employeeManagerNum : Sequelize.INTEGER,
    status : Sequelize.STRING,
    hireDate : Sequelize.STRING

}); // Employee()

var Department = sequelize.define('Department', {
    
    departmentId : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    departmentName : Sequelize.STRING
    
}); // Department()

// Define relationship between the models
Department.hasMany(Employee, {foreignKey: 'department'});

// Initialize the objects that will hold our data.
// var initialize = function() {
module.exports.initialize = function (){

    // Set up a new promise to synchronize the database and create the tables if needed.
    return new Promise(function(resolve, reject){

        // Synchronize the database and create the tables if needed.
        // If successful, resolve the promise.
        sequelize.sync().then(() => {
            
            console.log("Synchronized successfully");
            resolve();
            
        })
        // If failed, reject the promise.
        .catch((err) => {

            console.log("Failed Synchronizing");
            reject();

        }); // sequelize.sync()
        
    }); // return new Promise()

}; // function initialize()


// ----------------------------------------------------------------------------------
// Employee CRUD
// ----------------------------------------------------------------------------------


// Get all the employees
module.exports.getAllEmployees = function (){

    // Set up a new promise to retrieve all employees from the Database.
    return new Promise( function(resolve, reject){

        // Attempt to retrieve all employees from the database.
        Employee
            .findAll()
            // If successful, resolve the promise and return the found data.
            .then((data) => {

                console.log("getAllEmployees(): Retrieved all employees successfully");
                resolve(data);

            })
            // If failed, reject the promise.
            .catch((err) => {
                console.log(err)
                console.log("getAllEmployees(): Failed to retrieve all employees");
                reject("Failed to retrieve all employees");

            }); // Employee.findAll()

    }); // return new Promise()

} // getAllEmployees()

// Get employees by the status [ 'Part time' or 'Full time']
module.exports.getEmployeesByStatus = function (_par){

    // Set up a new promise to retrieve employees by their status.
    return new Promise( function(resolve, reject){

        // Attempt to retrieve all employees where status equals the received parameter.
        Employee
            .findAll({
                where : {
                    status : _par
                }
            })
            // If successful, resolve the promise and return the found data.
            .then((data) => {

                console.log("getEmployeesByStatus(): Retrieved employees successfully");
                resolve(data);

            })
            // If failed, reject the promise.
            .catch((err) => {

                console.log("getEmployeesByStatus(): Failed retrieve all employees");
                reject("Failed to retrieve employees");

            }); // Employee.findAll()

    }); // return new Promise()

} // getEmployeesByStatus()

// Get employees by the department number
module.exports.getEmployeesByDepartment = function(_par) {

    // Set up a new promise to retrieve employees by their department number.
    return new Promise( function(resolve, reject){

        // Attempt to retrieve all employees where department equals the received parameter.
        Employee
            .findAll({
                where : {
                    department : _par
                }
            })
            // If successful, resolve the promise and return the found data.
            .then((data) => {

                console.log("getEmployeesByDepartment(): Retrieved employees successfully");
                resolve(data);

            })
            // If failed, reject the promise.
            .catch((err) => {

                console.log("getEmployeesByDepartment(): Failed retrieve all employees");
                reject("Failed to retrieve employees");

            }); // Employee.findAll()

    }); // return new Promise()

} // getEmployeesByDepartment()

// Get employees by their manager number
module.exports.getEmployeesByManager = function(_par) {

    // Set up a new promise to retrieve employees by their manager number.
    return new Promise( function(resolve, reject){

        // Attempt to retrieve all employees where managerNum equals the received parameter.
        Employee
            .findAll({
                where : {
                    employeeManagerNum : _par
                }
            })
            // If successful, resolve the promise and return the found data.
            .then((data) => {

                console.log("getEmployeesByManager(): Retrieved employees successfully");
                resolve(data);

            })
            // If failed, reject the promise.
            .catch((err) => {

                console.log("getEmployeesByManager(): Failed retrieve all employees");
                reject("Failed to retrieve employees");

            }); // Employee.findAll()

   }); // return new Promise()

} // getEmployeesByManager()

// Retrieve one employee by their employee number
module.exports.getEmployeeByNum = function(_par) {

    // Set up a new promise to retrieve employees by their employee number.
    return new Promise( function(resolve, reject){

        // Attempt to retrieve all employees where employeeNum equals the received parameter.
        Employee
            .findAll({
                where : {
                    employeeNum : _par
                }
            })
            // If successful, resolve the promise and return the found data.
            .then((data) => {

                console.log("getEmployeeByNum(): Retrieved employees successfully");
                resolve(data);

            })
            // If failed, reject the promise.
            .catch((err) => {

                console.log("getEmployeeByNum(): Failed retrieve all employees");
                reject("Failed to retrieve employees");

            }); // Employee.findAll()

   }); // return new Promise()

} // getEmployeeByNum()

// Add new Employee
module.exports.addEmployee = function (emp_data){
    
    // Set up a new promise to add the new employee
    return new Promise( function(resolve, reject){
        
        // Iterate through the received data and replace empty fields with null.
        for(field in emp_data){
            emp_data[field] = (emp_data[field] == "") ? null : emp_data[field] ;
        }
        
        // Validate the isManager field to avoid error.
        // If it is not valid, set it to false. Otherwise, use the received value.
        emp_data.isManager = (emp_data.isManager) ? true : false;
        
        // Attempt to insert the new employee in the database
        Employee
            .create(emp_data)
            // If successfull, resolve the promise.
            .then((data) => {
                
                console.log("addEmployee(): Created employee successfully");
                resolve("Created employee successfully");
                
            })
            // If failed, reject the promise with an error message.
            .catch((err) => {
                
                console.log("addEmployee(): Failed to create employee");
                resolve("Failed to create employee");
                // console.log(err);
                
            }); // Employee.create()
        
    }); // return new Promise()
    
} // addEmployee()

// Update Employee
module.exports.updateEmployee = function (emp_data){
    
    // Set up a new promise to update the received employee
    return new Promise( function(resolve, reject){
        
        // Iterate through the received data and replace empty fields with null.
        for(field in emp_data){
            emp_data[field] = (emp_data[field] == "") ? null : emp_data[field] ;
        }
        
        // Validate the isManager field to avoid error.
        // If it is not valid, set it to false. Otherwise, use the received value.
        emp_data.isManager = (emp_data.isManager) ? true : false;
        
        // Attempt to update the employee with the new data
        Employee
            .update(emp_data, {
                where : { employeeNum : emp_data.employeeNum }
            })
            // If successfull, resolve the promise.
            .then((data) => {
                
                console.log("updateEmployee(): Updated employee successfully");
                resolve("Updated employee successfully");
                
            })
            // If failed, reject the promise with an error message.
            .catch((err) => {
                
                console.log("updateEmployee(): Failed to update employee");
                resolve("Failed to update employee");
                
            }); // Employee.update()
        
    }); // return new Promise()

} // updateEmployee()

// Delete Employee by Num
module.exports.deleteEmployeeByNum = function (emp_num){
    
    // Set up a new promise to delete the received employee
    return new Promise( function(resolve, reject){
        
        // Attempt to delete the employee
        Employee
            .destroy({
                where : { employeeNum : emp_num }
            })
            // If successfull, resolve the promise.
            .then((data) => {
                
                console.log("deleteEmployeeByNum(): Deleted employee successfully");
                resolve("Deleted employee successfully");
                
            })
            // If failed, reject the promise with an error message.
            .catch((err) => {
                
                console.log("deleteEmployeeByNum(): Failed to delete employee");
                resolve("Failed to delete employee");
                
            }); // Employee.destroy()
        
    }); // return new Promise()

} // deleteEmployeeByNum()


// ----------------------------------------------------------------------------------
// Department CRUD
// ----------------------------------------------------------------------------------


// Get all the departments
module.exports.getDepartments = function (){

    // Set up a new promise to retrieve all departments from database.
    return new Promise( function(resolve, reject){

        // Attempt to retrieve all departments from database.
        Department
            .findAll()
            // If successful, resolve the promise and return the found data.
            .then((data) => {

                console.log("getDepartments(): Retrieved departments successfully");
                resolve(data);

            })
            // If failed, reject the promise.
            .catch((err) => {

                console.log("getDepartments(): Failed retrieve all departments");
                reject("Failed to retrieve departments");

            }); // Employee.findAll()

    }); // return new Promise()

} // getDepartments()

// Get a department by their ID
module.exports.getDepartmentById = function (dept_id){

    // Set up a new promise to retrieve a department by their ID.
    return new Promise( function(resolve, reject){

        // Attempt to retrieve the department by their ID.
        Department
            .findAll({
                where : {
                    departmentId : dept_id
                }
            })
            // If successful, resolve the promise and return the found data.
            .then((data) => {

                console.log("getDepartmentsById(): Retrieved department successfully");
                resolve(data);

            })
            // If failed, reject the promise.
            .catch((err) => {

                console.log("getDepartmentsById(): Failed to retrieve the department");
                reject("Failed to retrieve the department");

            }); // Department.findAll()

    }); // return new Promise()

} // getDepartmentById()

// Add new Department
module.exports.addDepartment = function (dept_data){
    
    // Set up a new promise to add the new department
    return new Promise( function(resolve, reject){
        
        // Iterate through the received data and replace empty fields with null.
        for(x in dept_data)
            x = (x == "") ? null : x ;
        
        // Attempt to insert the new department in the database
        Department
            .create(dept_data)
            // If successfull, resolve the promise.
            .then((data) => {
                
                console.log("addDepartment(): Created department successfully");
                resolve("Created department successfully");
                
            })
            // If failed, reject the promise with an error message.
            .catch((err) => {
                
                console.log("addDepartment(): Failed to create department");
                resolve("Failed to create department");
                
            }); // Department.create()
        
    }); // return new Promise()
    
} // addDepartment()

// Update Department
module.exports.updateDepartment = function (dept_data){
    
    // Set up a new promise to update the received department
    return new Promise( function(resolve, reject){
        
        // Iterate through the received data and replace empty fields with null.
        for(x in dept_data)
            x = (x == "") ? null : x ;
        
        // Attempt to update the department with the new data
        Department
            .update(dept_data, {
                where : { departmentId : dept_data.departmentId }
            })
            // If successfull, resolve the promise.
            .then((data) => {
                
                console.log("updateDepartment(): Updated department successfully");
                resolve("Updated department successfully");
                
            })
            // If failed, reject the promise with an error message.
            .catch((err) => {
                
                console.log("updateDepartment(): Failed to update department");
                resolve("Failed to update department");
                
            }); // Department.update()
        
    }); // return new Promise()

} // updateDepartment()

// Delete Department by ID
module.exports.deleteDepartmentById = function (dept_id){
    
    // Set up a new promise to delete the received department
    return new Promise( function(resolve, reject){
        
        // Attempt to delete the department
        Department
            .destroy({
                where : { departmentId : dept_id }
            })
            // If successfull, resolve the promise.
            .then((data) => {
                
                console.log("deleteDepartmentById(): Deleted department successfully");
                resolve("Deleted department successfully");
                
            })
            // If failed, reject the promise with an error message.
            .catch((err) => {
                
                console.log("deleteDepartmentById(): Failed to delete department");
                resolve("Failed to delete department");
                
            }); // Department.destroy()
        
    }); // return new Promise()

} // deleteDepartmentById()