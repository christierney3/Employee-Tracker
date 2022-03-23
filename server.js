const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
const connection = require('./config/connection');
require('console.table');

const {showChoices, findId} = require('./db/queries')

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
})

function employeeMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                'View Departments',
                'View all Roles',
                'View all Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Exit'
            ]
        }
    ])
    .then((choice) => {
        if (choice.menu !== 'Exit'){
            setTimeout(() => {
            }, 1000);
        }
        switch (choice.menu) {
            case 'View Departments':
                allDepartments();
                break;
        
            case 'View all Roles':
                allRoles();
                break;
            
            case 'View all Employees':
                allEmployees();
                break;

            case 'Add Department':
                addDept();
                break;

            case 'Add Role':
                addRole();
                break;

            case 'Add Employee':
                addEmployee();
                break;

            case 'Update Employee Role':
                updateRole();
                break;

            case 'Exit':
                connection.end();
                console.log('Goodbye!');
                break;
        }
    });
};

function allDepartments() {
    const query = `SELECT department.id AS id, 
    department.department_name AS department 
    FROM department;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n----------------------------------');
        console.log('All Departments:');
        console.log('\n----------------------------------');
        console.table(res);
    });
    employeeMenu();
};

function allRoles() {
    const query = `SELECT roles.id AS id,
    roles.title AS title,
    roles.salary AS salary,
    roles.department_id AS department_id 
    FROM roles;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n---------------------------');
        console.log('All Roles:');
        console.log('\n---------------------------');
        console.table(res);
    });
    employeeMenu();
};

function allEmployees() {
    const query = `SELECT employee.id AS id,
    employee.first_name AS first_name,
    employee.last_name AS last_name,
    employee.role_id AS role_id,
    employee.manager_id AS manager_id 
    FROM employee;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n--------------------');
        console.log('All Employees:');
        console.log('\n--------------------');
        console.table(res);
    });
    employeeMenu();
};

async function addDept() {

    const prompts = [
        {
            type: 'input',
            name: 'addDept',
            message: 'What department would you like to add?'
        }
    ]

    let answer = await inquirer.prompt(prompts);

    connection.query(`INSERT INTO department (department_name) VALUES ('${answer.addDept}');`, (err, res) => {
        if (err) throw err;
        console.log('\n-----------------------');
        console.log(`${answer.addDept} was added to Departments`);
        console.log('-----------------------\n');
    })
    employeeMenu();   
};

async function addRole() {
    const prompts = [
        {
            type: 'input',
            name: 'addRole',
            message: 'What role would you like to add?'
        },
        {
            type: 'number',
            name: 'addSalary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'list',
            name: 'addDept',
            message: 'What department does this role belong to?',
            choices: await showChoices('department_name', 'department')
        }
    ]

    let answer = await inquirer.prompt(prompts);

    let deptId = await findId('department', 'department_name', answer.addDept);

    connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answer.addRole}', '${answer.addSalary}', '${deptId}');`, (err, res) => {
    if (err) throw err;
    console.log('\n-----------------------');
    console.log(`${answer.addRole} was added to Roles`);
    console.log('-----------------------\n');
    })

    employeeMenu();
}

async function addEmployee() {
    const prompts = [
        {
            type: 'input',
            name: 'first',
            message: 'What is the first name of the employee?'
        },
        {
            type: 'input',
            name: 'last',
            message: 'What is the last name of the employee?'
        },
        {
            type: 'list',
            name: 'getRole',
            message: 'What is the role of the employee?',
            choices: await showChoices('title', 'roles')
        },
        {
            type: 'list',
            name: 'getManager',
            message: 'What manager is overseeing this employee?',
            choices: await showChoices('full_name', 'employee'),
            default: 'null'
            
        }
    ]

    let answer = await inquirer.prompt(prompts);

    let roleId = await findId('roles', 'title', answer.getRole);

    let managerId = await findId('employee', 'full_name', answer.getManager);

    connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answer.first}', '${answer.last}', '${roleId}', '${managerId}');`, (err, res) => {
    if (err) throw err;
    console.log('\n-----------------------');
    console.log(`${answer.first} was added to Employees`);
    console.log('-----------------------\n');
    })
        
    employeeMenu();
}

async function updateRole() {
    const prompts = [
        {
            type: 'list',
            name: 'getEmployee',
            message: 'What employee would you like to update?',
            choices: await showChoices('full_name', 'employee'),            
        },
        {
            type: 'list',
            name: 'newRole',
            message: 'What is the new role of the employee?',
            choices: await showChoices('title', 'roles')
        },
        {
            type: 'list',
            name: 'newManager',
            message: 'What manager is now overseeing this employee?',
            choices: await showChoices('full_name', 'employee'),
            default: 'null'            
        }
    ]

    let answer = await inquirer.prompt(prompts);

    let roleId = await findId('roles', 'title', answer.newRole);

    let managerId = await findId('employee', 'full_name', answer.newManager);

    connection.query(`UPDATE employee SET role_id = '${roleId}', manager_id = '${managerId}' WHERE full_name = '${answer.getEmployee}';`, (err, res) => {
    if (err) throw err;
    console.log('\n-----------------------');
    console.log(`${answer.getEmployee} was updated in the database`);
    console.log('-----------------------\n');
    })
        
    employeeMenu();
}

employeeMenu();