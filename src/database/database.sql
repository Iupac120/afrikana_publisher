CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE africanaPublisher;

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    google_id TEXT,
    provider VAR (100),
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
);

INSERT INTO users (user_name,user_email,user_password) VALUES ("okpara", "oforokpara@gmail.com","okpara");