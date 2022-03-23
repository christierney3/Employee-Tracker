INSERT INTO department (department_name)
VALUES 
    ('Sales'), 
    ('Engineering'), 
    ('Finance'), 
    ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Sales Representative', 85000, 1), 
    ('Sales Manager', 130000, 1), 
    ('Software Engineer', 95000, 2), 
    ('Lead Engineer', 120000, 2), 
    ('Accounting Manager', 135000, 3), 
    ('Accountant', 85000, 3), 
    ('Lawyer', 170000, 4), 
    ('Legal Team Lead', 225000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('John', 'Doe', 1, null), 
    ('Jane', 'Doe', 1, 1), 
    ('Chris', 'Tierney', 2, 2), 
    ('Margo', 'Hale', 2, null),
    ('Jake', 'Hammil', 3, 3),
    ('Leo', 'Dicaprio', 3, null),
    ('Gal', 'Gadot', 4, null),
    ('50', 'Cent', 4, 4);