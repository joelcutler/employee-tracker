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
      // console.log(deptartmentNames);
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
          // db.connect(function (err) {
          //   if (err) throw err;
          db.query(
            `SELECT id FROM departments WHERE dept_name = "${roleDept}"`,
            function (err, result) {
              if (err) throw err;
              deptartmentId = result[0].id;
              console.log("string", deptartmentId);

              // db.connect(function (err) {
              // if (err) throw err;
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
            }
          );
        });
    });
  });
};

const addToEmployees = async () => {
  let roleNames = [];
  let managerNames = [];
  db.connect(function (err) {
    if (err) throw err;

    db.query(`SELECT title FROM roles`, function (err, result) {
      if (err) throw err;
      roleNames = result.map(({ title }) => title);

      db.query(
        `SELECT first_name, last_name FROM employees`,
        function (err, result) {
          if (err) throw err;
          managerNames = result.map(
            ({ first_name, last_name }) => first_name + " " + last_name
          );

          // console.log(deptartmentNames);
          inquirer
            .prompt([
              {
                type: "input",
                name: "empFirstName",
                message: "What is the first name of the new employee?",
              },
              {
                type: "input",
                name: "empLastName",
                message: "What is the last name of the new employee?",
              },
              {
                type: "list",
                name: "empRole",
                message: "Which role does the new employee have?",
                choices: roleNames,
              },
              {
                type: "list",
                name: "empManager",
                message: "Who is the manager of the new employee?",
                choices: managerNames,
              },
            ])
            .then(({ empFirstName, empLastName, empRole, empManager }) => {
              let roleId;
              let managerId;
              // db.connect(function (err) {
              //   if (err) throw err;
              db.query(
                `SELECT id FROM roles WHERE title = "${empRole}"`,
                function (err, result) {
                  if (err) throw err;
                  roleId = result[0].id;
                  console.log("employee id:", roleId);

                  // empManager = "Jane Doe"

                  const empMangFirstName = empManager.split(" ")[0];
                  const empMangLastName = empManager.split(" ")[1];
                  db.query(
                    `SELECT id FROM employees WHERE first_name = "${empMangFirstName}" AND last_name ="${empMangLastName}"`,
                    function (err, result) {
                      if (err) throw err;
                      managerId = result[0].id;
                      console.log("manager id:", managerId);

                      // db.connect(function (err) {
                      // if (err) throw err;
                      db.query(
                        `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                  VALUES (?,?,?,?)`,
                        (params = [
                          empFirstName,
                          empLastName,
                          roleId,
                          managerId,
                        ]),
                        function (err, result) {
                          if (err) throw err;
                          console.log(
                            "New employee",
                            empFirstName,
                            empLastName,
                            "added successfully"
                          );
                          startMenu();
                        }
                      );
                    }
                  );
                }
              );
            });
        }
      );
    });
  });
};

const updateRole = async () => {
  let empNames = [];
  let empRoles = [];
  db.connect(function (err) {
    if (err) throw err;

    db.query(
      `SELECT first_name, last_name FROM employees`,
      function (err, result) {
        if (err) throw err;
        empNames = result.map(
          ({ first_name, last_name }) => first_name + " " + last_name
        );
        db.query(`SELECT title FROM roles`, 
        function (err, result) {
          if (err) throw err;
          empRoles = result.map(({ title }) => title);
          // console.log(empRoles, "employee roles")
          inquirer
            .prompt([
              {
                type: "list",
                name: "empChoice",
                message: "Which employee would you like to update the role of?",
                choices: empNames,
              },
              {
                type: "list",
                name: "roleChoice",
                message: "What's the employee's updated role?",
                choices: empRoles,
              }
            ])
            .then(({ empChoice, roleChoice }) => {
              let empId;
              let roleId;
              // console.log(roleChoice,"<dem roles", empChoice, "<employee names" )

              const empFirstName = empChoice.split(" ")[0];
              const empLastName = empChoice.split(" ")[1];

              db.query(
                `SELECT id FROM employees WHERE first_name = "${empFirstName}" AND last_name ="${empLastName}"`,
                function (err, result) {
                  empId = result[0].id;
                  db.query(
                    `SELECT id FROM roles WHERE title = "${roleChoice}"`,
                    function (err, result) {
                      roleId = result[0].id;
                      db.query(
                        `UPDATE employees
                              SET role_id = ${roleId}
                              WHERE id = ${empId}`,
                        function (err, result) {
                          if (err) throw err;
                          console.log(
                            "Employee",
                            empFirstName,
                            empLastName,
                            "updated successfully"
                          );
                          startMenu();
                        }
                      );
                    }
                  );
                }
              );
            });
        });
      }
    );
  });
};
startMenu();

// -options on load: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
