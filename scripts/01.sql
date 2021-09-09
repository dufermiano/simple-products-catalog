CREATE TABLE IF NOT EXISTS PRODUCTS(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value DECIMAL(5,2) NOT NULL,
    inventory INT(50),
    size VARCHAR (3),
    gender VARCHAR(15),
    active BIT(1),
    registrationDate DATETIME NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

INSERT INTO PRODUCTS(name, value, inventory, gender, registrationDate) VALUES ("Tênis Nike Shox R4", "529,99", 10, "Masculino", 1, now());
INSERT INTO PRODUCTS(name, value, inventory, size, gender, registrationDate) VALUES ("Camiseta Nike Legend 2.0", "89,99", 11, "M" ,"Masculino", 1, now());
INSERT INTO PRODUCTS(name, value, inventory, size, gender, registrationDate) VALUES ("Agasalho Nike Sportswear", "239,99", 15, "G" ,"Feminino", 1, now());
INSERT INTO PRODUCTS(name, value, inventory, gender, registrationDate) VALUES ("Mochila Nike Tanjun", "129,99", 7, "Feminino", 1, now());