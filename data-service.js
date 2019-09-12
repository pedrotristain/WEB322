// Required module(s)
var fs = require("fs");

// Declare the arrays that will hold our data.
var employees, departments;

// Initialize the objects that will hold our data.
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

// Get only the employees that are managers
module.exports.getManagers = function (){

    // Set up a new promise to iterate through the employees object in search of the managers.
    return new Promise( function(resolve, reject){

        // Declare a temporary variable to hold the managers.
        var managers;

        // Check if there are any employees in the object.
        if(employees.length > 0) {
            
            // Iterate through the employees array in search for the managers.
            employees.foreach(function(element){
                
                // If the current employee is a manager, store it in the managers object.
                if(element.isManager == true)
                    managers.push(element);
            
            }); //employees.foreach()
        
            // Check if any manager was found. If not, return a message through the 'reject' method.
            if(managers.length == 0)
                reject("No results were found by the minions.");

            // If any result was found, return the object with the employees.
            resolve(employees);
        
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