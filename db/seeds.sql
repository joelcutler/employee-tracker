INSERT INTO departments (dept_name)
VALUES
  ('Sales'),
  ('Marketing'),
  ('Human Resources'),
  ('Production');

INSERT INTO roles (title, salary, dept_id)
VALUES
  ('Salesperson', 50000, 1),
  ('Lead Salesperson', 70000, 1),
  ('President of Sales', 100000, 1),

  ('Social Media Manager', 60000, 2),
  ('Advertiser', 80000, 2),
  ('Copywrighter', 110000, 2),

  ('HR Director', 105000, 3),
  ('Recruiter', 75000, 3),
  ('Payroll Clerk', 53000, 3),

  ('Fabricator', 83000, 4),
  ('Expediter', 62000, 4),
  ('Assembler', 42000, 4);



  INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('James', 'Loomis', 10, 1),
  ('John', 'Jacobson', 11, 1),
  ('Justin', 'Cortis', 12, 1),

  ('Honey', 'Bee', 7, 4),
  ('Hilde', 'Higgins', 8, 4),
  ('Dan', 'Theman', 9, 4),

  ('Daria', 'Dixon', 6, 7),
  ('David', 'Sampson', 5, 7),
  ('Sammy', 'Davis', 4, 7),
  
  ('Terry', 'Trotta', 3, 9),
  ('Timothy', 'Smith', 2, 9),
  ('Kitty', 'Kat', 1, 9);