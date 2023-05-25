CREATE TABLE
    account (
        id INT UNSIGNED PRIMARY KEY,
        rsid CHAR(9),
        op TINYINT UNSIGNED
    );

CREATE TABLE
    `character` (
        id INT UNSIGNED,
        account_id INT UNSIGNED,
        name VARCHAR(32),
        model VARCHAR(10),
        pos JSON,
        PRIMARY KEY (id),
        FOREIGN KEY (account_id) REFERENCES account(id)
    );

CREATE TABLE
    vehicle (
        id INT UNSIGNED,
        owner_id INT UNSIGNED,
        model VARCHAR(10),
        appearance VARCHAR(128),
        pos JSON,
        rot JSON,
        PRIMARY KEY (id),
        FOREIGN KEY (owner_id) REFERENCES account(id)
    );