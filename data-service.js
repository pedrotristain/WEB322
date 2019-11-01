// Required module(s)
var fs = require("fs");

// Declare the arrays that will hold our data.
var employees, departments;

// Initialize the objects that will hold our data.
// var initialize = function() {
module.exports.initialize = function (){

    // Set up a new promise to read the data files, parse the data and initialize the objects.
    return new Promise(function(resolve, reject){

        // Read the employees.json file
        fs.readFile('./data/employees.json', 'utf8', (err, data) => {
            
            // Check for errors when reading the file.
            if (err) 
                reject(); // If error, reject the promise and return.
            
            // If no error is thrown, parse the data returned from the file into the object.
            employees = JSON.parse(data);

            // Read the departments.json file
            fs.readFile("./data/departments.json", 'utf8', (err, data) => {

                // Check for errors when reading the file.
                if (err) 
                    reject(); // If error, reject the promise and return.
                
                // If no error is thrown, parse the data returned from the file into the object.
                departments = JSON.parse(data);

                // If no error was thrown and both files have been read and parsed, resolve the Promise.
                resolve();

            }); // fs.readFile('departments')

       }); // fs.readFile('employees')

    }); // return new Promise()

}; // function initialize()

// Get all the employees
module.exports.getAllEmployees = function (){

    // Set up a new promise to return the employees object.
    return new Promise( function(resolve, reject){

        // Check if there are any employees in the object. If no results, return a message through the 'reject' method.
        if(employees.length === 0)
            reject("No results were found by the minions.");
        else
            // If any result was found, return the object with the employees.
            resolve(employees);

    } ); // return new Promise()

} // getAllEmployees()

// Get employees by the status [ 'Part time' or 'Full time']
module.exports.getEmployeesByStatus = function (_par){

    // Set up a new promise to return the employees object.
    return new Promise( function(resolve, reject){

        // Check if there are any employees in the object. If no results, return a message through the 'reject' method.
        if(employees.length === 0)
            reject("No results were found by the minions.");
        else
            
            // Create a new array to hold the found employees.
            var result = [];

            if(employees.length > 0) {

                // Search the employees array for the employees of the same status as the parameter.
                employees.forEach(function(e){
                    
                    // If a match is found, add it to the placeholder array.
                    if(e.status == _par )
                        result.push(e);

                }); // foreach()

            } // if( > 0)

            // If no matches were found, reject the promise by stating so. Otherwise resolve it and return the found employees.
            if(result.length == 0)
                reject("No employees were found by the minions using getEmployeesByStatus()");
            else
                resolve(result);

    } ); // return new Promise()

} // getEmployeesByStatus()

// Get employees by the department number
module.exports.getEmployeesByDepartment = function(_par) {

     // Set up a new promise to return the employees object.
     return new Promise( function(resolve, reject){

        // Check if there are any employees in the object. If no results, return a message through the 'reject' method.
        if(employees.length === 0)
            reject("No results were found by the minions.");
        else
            
            // Create a new array to hold the found employees.
            var result = [];

            if(employees.length > 0) {

                // Search the employees array for the employees of the same status as the parameter.
                employees.forEach(function(e){

                    // If a match is found, add it to the placeholder array.
                    if(e.department == _par )
                        result.push(e);

                }); // foreach()

            } // if( > 0)

            // If no matches were found, reject the promise by stating so. Otherwise resolve it and return the found employees.
            if(result.length == 0)
                reject("No employees were found by the minions using getEmployeesByDepartment()");
            else
                resolve(result);

    } ); // return new Promise()

} // getEmployeesByDepartment()

// Get employees by their manager number
module.exports.getEmployeesByManager = function(_par) {

    // Set up a new promise to return the employees object.
    return new Promise( function(resolve, reject){

       // Check if there are any employees in the object. If no results, return a message through the 'reject' method.
       if(employees.length === 0)
           reject("No results were found by the minions.");
       else
           
           // Create a new array to hold the found employees.
           var result = [];

           if(employees.length > 0) {

               // Search the employees array for the employees of the same status as the parameter.
               employees.forEach(function(e){

                   // If a match is found, add it to the placeholder array.
                   if(e.employeeManagerNum == _par )
                       result.push(e);

               }); // foreach()

           } // if( > 0)

           // If no matches were found, reject the promise by stating so. Otherwise resolve it and return the found employees.
           if(result.length == 0)
               reject("No employees were found by the minions using getEmployeesByManager()");
           else
               resolve(result);

   } ); // return new Promise()

} // getEmployeesByManager()

// Retrieve one employee by their employee number
module.exports.getEmployeeByNum = function(_par) {

    // Set up a new promise to return the employees object.
    return new Promise( function(resolve, reject){

       // Check if there are any employees in the object. If no results, return a message through the 'reject' method.
       if(employees.length === 0)
           reject("No results were found by the minions.");
       else
           
           // Create a new array to hold the found employees.
           var result = [];

           if(employees.length > 0) {

               // Search the employees array for the employees of the same status as the parameter.
               for(let x = 0; x < employees.length; x++ ){

                    let e = employees[x];

                   // If a match is found, add it to the placeholder array and stop the loop.
                   if(e.employeeNum == _par ){
                       result.push(e);
                       x = employees.length; // Break out of the loop
                   } // if()

               }; // for()

           } // if( > 0)

           // If no matches were found, reject the promise by stating so. Otherwise resolve it and return the found employees.
           if(result.length == 0)
               reject("No employees were found by the minions using getEmployeeByNum()");
           else
               resolve(result);

   } ); // return new Promise()

} // getEmployeeByNum()

// Get only the employees that are managers
// var getManagers = function() {
module.exports.getManagers = function (){

    // Set up a new promise to iterate through the employees object in search of the managers.
    return new Promise( function(resolve, reject){

        // Declare a temporary variable to hold the managers.
        var managers = new Array();

        // Check if there are any employees in the object.
        if(employees.length > 0) {
            
            // Iterate through the employees array in search for the managers.
            employees.forEach(function(element){

                // If the current employee is a manager, store it in the managers object.
                if(element.isManager == true){
                    managers.push(element);
                } // if()
            
            }); //employees.foreach()
        
            // Check if any manager was found. If not, return a message through the 'reject' method.
            if(managers.length == 0)
                reject("No results were found by the minions.");

            // If any result was found, return the object with the employees.
            resolve(managers);
        
        } else {
            
            //If no results, return a message through the 'reject' method.
            reject("No results were found by the minions.");
        
        } // if else
        
    } ); // return new Promise()

} // getManagers()

// Get all the departments
module.exports.getDepartments = function (){

    // Set up a new promise to return the departments object.
    return new Promise( function(resolve, reject){

        // Check if there are any departments in the object. If no results, return a message through the 'reject' method.
        if(departments.length === 0)
            reject("No results were found by the minions.");
        else
            // If any result was found, return the object with the employees.
            resolve(departments);

    } ); // return new Promise()

} // getDepartments()

// Add new Employee
module.exports.addEmployee = function (emp_data){

    // Set up a new promise to add the new employee
    return new Promise( function(resolve, reject){

        // If isManager is undefined, set it to false
        if(emp_data.isManager === undefined)
            emp_data.isManager = false;
        
        // Set the employee number to be equal to the amount of employees + 1
        emp_data.employeeNum = employees.length + 1;

        // Add the employee into the array
        employees.push(emp_data);

        resolve();

    } ); // return new Promise()

} // addEmployee()

// Add new Employee
module.exports.updateEmployee = function (emp_data){

    // Set up a new promise to update the employee's data
    return new Promise( function(resolve, reject){

        // If isManager is undefined, set it to false
        if(emp_data.isManager === undefined)
            emp_data.isManager = false;

        // Itterate through the employees array looking for a match for the employee number
        // If found, replace the object with the one received from the form
        for(var x = 0; x < employees.length; x++){
            if(employees[x].employeeNum == emp_data.employeeNum)
                employees[x] = emp_data;
        } // for()
        
        // Conclude the function and resolve the promise.
        resolve();

    } ); // return new Promise()

} // updateEmployee()

// initialize().then(() => { getManagers() });