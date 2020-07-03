'use strict';

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool();

const createUsersTable = async () => {
  const usersCreateQuery =
  `CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(25) NOT NULL,
  last_name VARCHAR(25) NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  creating_date DATE NOT NULL DEFAULT CURRENT_DATE
  )`;

  try {
    await pool.query(usersCreateQuery);
    console.log('Successful creating users table');
    return;
  } catch (e) {
    console.log(e);
  }
};

const createStatusType = async () => {
  const statusCreateQuery =
  `DO $$ BEGIN
    CREATE TYPE taskStatus as ENUM ('View', 'In Progress', 'Done');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`;
  const client = await pool.connect();
  try {
    // await client.query('DROP TYPE IF EXISTS taskStatus');
    await client.query(statusCreateQuery);
    console.log('Succesful creating status type');
    return;
  } catch (e) {
    console.log('Error while creating status type');
    console.log(e.message);
  } finally {
    client.release();
  }
};

const createTasksTable = async () => {
  const tasksCreateQuery =
  `CREATE TABLE IF NOT EXISTS tasks 
  ( id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    status taskStatus NOT NULL,
    creating_date DATE NOT NULL DEFAULT CURRENT_DATE)`;
  try {
    await pool.query(tasksCreateQuery);
    console.log('Successful creating tasks table');
    return;
  } catch (e) {
    console.log(e.message);
  }
};

const create = async () => {
  await createUsersTable();
  await createStatusType();
  await createTasksTable();
  pool.end();
};

create();
