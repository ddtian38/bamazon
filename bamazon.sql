DROP TABLE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
	item_id INT AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DOUBLE(10,2) NOT NULL,
	stock_quantity INT NOT NULL
);

INSERT INTO products
(product_name, department_name, price, stock_quantity)
VALUE
("ESV Study Bible", "Books", 30, 20 ),
("Apple Macbook", "Electronics", 1990, 100 ),
("Galaxy S9", "Electronics", 699.99, 20 ),
("House M.D.", "TV Shows", 50, 10 ),
("Mere Christianity", "Book", 12, 20 ),
("B-Alexa", "Electronics", 50, 100 ),
("Wilson NFL Super Grip", "Sports & Outdoors", 12, 1 ),
("Wilson Sporting Goods Vapor Baseball Bat", "Sports & Outdoors", 50, 0),
("2018 Tesla 3", "Vehicles", 47200, 2 ),
("Death Star Plans", "Book", 100, 1 )