const db = require("./db/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");

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
        displayAllFromTable("departments");
      } else if (mainMenu === "view all roles") {
        displayAllFromTable("roles");
      } else if (mainMenu === "view all employees") {
        displayAllFromTable("employees");
      } else if (mainMenu === "add a department") {
        addToDepartments("departments");
      } else if (mainMenu === "add a role") {
        addToRoles("roles");
      } else if (mainMenu === "add an employee") {
        addToEmployees("employees");
      } else if (mainMenu === "update an employee role") {
        updateRole("employees");
      }
    });
};

const displayAllFromTable = (table) => {
  // console.log(db.query(`select * from departments;`));
  // console.table([db.query(`select  * from departments;`)])
  db.connect(function (err) {
    if (err) throw err;
    db.query(`SELECT * FROM ${table}`, function (err, result) {
      if (err) throw err;
      console.table(result);
      startMenu();
    });
  });
};

const addToDepartments = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "What is the name of the new department?",
      },
    ])
    .then(({ deptName }) => {
      db.connect(function (err) {
        if (err) throw err;
        db.query(
          `INSERT INTO departments (dept_name)
        VALUES (?)`,
          deptName,
          function (err, result) {
            if (err) throw err;
            console.log("New department", deptName, "added successfully");
            startMenu();
          }
        );
      });
    });
};

const addToRoles = async () => {
  let deptartmentNames = [];
  db.connect(function (err) {
    if (err) throw err;
    db.query(`SELECT dept_name FROM departments`, function (err, result) {
      if (err) throw err;
      deptartmentNames = result.map(({ dept_name }) => dept_name);
      console.log(deptartmentNames);
      inquirer
        .prompt([
          {
            type: "input",
            name: "roleName",
            message: "What is the name of the new role?",
          },
          {
            type: "input",
            name: "roleSalary",
            message: "What is the salary of the new role?",
          },
          {
            type: "list",
            name: "roleDept",
            message: "Which department is the new role a part of?",
            choices: deptartmentNames,
          },
        ])
        .then(({ roleName, roleSalary, roleDept }) => {
          let deptartmentId;
          db.connect(function (err) {
            if (err) throw err;
            db.query(
              `SELECT id FROM departments WHERE dept_name = "${roleDept}"`,
              function (err, result) {
                if (err) throw err;
                deptartmentId = result[0].id;
                console.log("string", deptartmentId);
              }
            );
          });
          db.connect(function (err) {
            if (err) throw err;
            db.query(
              `INSERT INTO roles (title, salary, dept_id)
            VALUES (?,?,?)`,
              (params = [roleName, roleSalary, deptartmentId]),
              function (err, result) {
                if (err) throw err;
                console.log("New role", roleName, "added successfully");
                startMenu();
              }
            );
          });
        });
    });
  });
};

startMenu();
// -options on load: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
