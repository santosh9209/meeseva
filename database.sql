CREATE DATABASE IF NOT EXISTS card_db;
USE card_db;

CREATE TABLE IF NOT EXISTS requisitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    village_town VARCHAR(255) NOT NULL,
    survey_number VARCHAR(100) NOT NULL,
    extent VARCHAR(100) NOT NULL,
    classification VARCHAR(100) NOT NULL,
    units VARCHAR(100) NOT NULL,
    nature_of_use VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
