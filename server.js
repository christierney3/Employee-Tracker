const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
const connection = require('./config/connection');
const { allowedNodeEnvironmentFlags } = require('process');
require('console.table');

connection.connect((err) => {
    if (err) throw err;
    employeeMenu();
})

const employeeMenu = () => {
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
                    department.department_name AS department FROM department;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('All Departments:');
        console.log('\n');
        console.table(res);
    });
    employeeMenu();
};

function allRoles() {
    const query = `SELECT * FROM roles;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('All Roles:');
        console.log('\n');
        console.table(res);
    });
    employeeMenu();
};

function allEmployees() {
    const query = `SELECT * FROM employee;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('All Employees:');
        console.log('\n');
        console.table(res);
    });
    employeeMenu();
};
