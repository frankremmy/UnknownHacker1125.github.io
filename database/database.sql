CREATE DATABASE CustomerDirectory;
CREATE TABLE Customer (
  id  INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email     VARCHAR(255)    NOT NULL,
  create_date   DATETIME    NOT NULL,
  password      VARCHAR(255)   NOT NULL,
  last_name     VARCHAR(255),
  first_name    VARCHAR(255),
  street        VARCHAR(255),
  city          VARCHAR(255),
  state         CHAR(2),
  zip           CHAR(10),
  phone         VARCHAR(25),
  phone_type         VARCHAR(255)
);
