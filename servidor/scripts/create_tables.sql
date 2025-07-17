-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE SeismicMonitoring;
-- USE SeismicMonitoring;

-- Users table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    password_hash NVARCHAR(MAX) NOT NULL,
    date_of_birth DATE,
    photo_path NVARCHAR(255),
    role NVARCHAR(50) DEFAULT 'visitor' NOT NULL,
    last_login DATETIME,
    created_at DATETIME DEFAULT GETDATE() NOT NULL
);

-- Earthquakes table
CREATE TABLE earthquakes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    place NVARCHAR(255) NOT NULL,
    magnitude FLOAT NOT NULL,
    depth FLOAT NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    event_time DATETIME NOT NULL,
    source_id NVARCHAR(100) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT GETDATE() NOT NULL
);

-- News table
CREATE TABLE news (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date_posted DATETIME DEFAULT GETDATE() NOT NULL,
    author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IX_users_email ON users(email);
CREATE INDEX IX_users_role ON users(role);
CREATE INDEX IX_earthquakes_magnitude ON earthquakes(magnitude);
CREATE INDEX IX_earthquakes_event_time ON earthquakes(event_time);
CREATE INDEX IX_earthquakes_source_id ON earthquakes(source_id);
CREATE INDEX IX_news_date_posted ON news(date_posted);
CREATE INDEX IX_news_author_id ON news(author_id);
