CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(25) NOT NULL,
  last_name VARCHAR(25) NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE
);

CREATE TYPE taskStatus AS ENUM ('View', 'In Progress', 'Done');

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  status taskStatus NOT NULL
);

ALTER TABLE users
ADD creating_date DATE NOT NULL DEFAULT CURRENT_DATE;
