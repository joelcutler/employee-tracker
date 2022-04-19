const db = require("./db/connection");
const cTable = require('console.table');
const inquirer = require('inquirer');


// Start DB connection
db.connect((err) => {
  if (err) throw err;
});

// inquirer prompts
// TODO: Create an array of questions for user input
const startMenu = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "mainMenu",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then(({ mainMenu }) => {
      if (mainMenu === "view all departments") {
        //   console.log(mainMenu);
        displayAllFromTable("departments");
      }
      else if (mainMenu === "view all roles") {
        //   console.log(mainMenu);
        displayAllFromTable("roles");
      }
      else if (mainMenu === "view all employees") {
        //   console.log(mainMenu);
        displayAllFromTable("employees");
      }
      });
};

const displayAllFromTable = (table) => {
    // console.log(db.query(`select * from departments;`));
    // console.table([db.query(`select  * from departments;`)])
    db.connect(function(err) {
        if (err) throw err;
        db.query(`SELECT * FROM ${table}`, function (err, result) {
          if (err) throw err;
          console.table(result);
          startMenu();
        });
      });
}

startMenu();
// -options on load: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
