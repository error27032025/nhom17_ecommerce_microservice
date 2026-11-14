INSERT INTO inventory (id, productName, quantity)
VALUES
    (1, 'Iphone 13', 12),
    (2, 'Macbook Pro 13.3', 4);

CREATE TABLE inventory (
                           id INT PRIMARY KEY,
                           productName VARCHAR(255) NOT NULL,
                           quantity INT NOT NULL
);

