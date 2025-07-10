-- MMA Platform SQL DDL

CREATE TABLE weight_class (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  min_weight INT NOT NULL,
  max_weight INT NOT NULL
);

CREATE TABLE fighter (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  nickname VARCHAR(100),
  country VARCHAR(50),
  birthdate DATE,
  weight_class_id INT REFERENCES weight_class(id),
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0
);

CREATE TABLE event (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(100)
);

CREATE TABLE fight (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES event(id),
  fighter_red_id INT REFERENCES fighter(id),
  fighter_blue_id INT REFERENCES fighter(id),
  winner_id INT REFERENCES fighter(id),
  method VARCHAR(50),
  round INT,
  time VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ranking (
  id SERIAL PRIMARY KEY,
  fighter_id INT REFERENCES fighter(id),
  weight_class_id INT REFERENCES weight_class(id),
  rank INT NOT NULL,
  points INT NOT NULL
); 