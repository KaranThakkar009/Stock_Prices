--stockprices table
drop database if exists stockprices;
create database stockprices;

-- use database
\c cricket

-- tables quries
CREATE TABLE stock_prices(symbol VARCHAR, date VARCHAR, prev_close FLOAT, open_price FLOAT, high_price FLOAT, low_price FLOAT, last_price FLOAT, close_price FLOAT, average_price FLOAT, total_traded_quantity FLOAT);

--flush data from .csv file
\copy stock_prices FROM 'file/path/file.csv' csv header;

--adding primary key
ALTER TABLE stock_prices ADD COLUMN stock_id SERIAL PRIMARY KEY;


--users table
CREATE TABLE users(user_id SERIAL PRIMARY KEY, fname VARCHAR, lname VARCHAR, email VARCHAR, phone_no INT, is_admin BOOLEAN, password VARCHAR);

