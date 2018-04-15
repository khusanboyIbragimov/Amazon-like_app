DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10, 2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
  );

  INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Iphone", "Electronics", 400, 10);

  INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Electronics", 500, 15);

 INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("T-Shirt", "Clothing", 20, 20);

 INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shoes", "Clothing", 25, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Red Wine", "Alcohol", 40, 24);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("TV", "Electronics", 600, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Handbags", "Fashion", 100, 14);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("JAVASCRIPT & JQUERY book", "Books", 10, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bicycle", "Bicycles", 800, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Soccer Ball", "Sporting Goods", 25, 20);