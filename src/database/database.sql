CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE africanaPublisher;

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    first_name VARCHAR (50),
    last_name VARCHAR (50),
    profile_image TEXT,
    google_id TEXT,
    facebook_id TEXT,
    social_provider VARCHAR (100),
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
);

CREATE TABLE profile_image (
    image_id SERIAL PRIMARY KEY,
    public_id TEXT,
    image_url TEXT
);

INSERT INTO users (user_name,user_email,user_password) VALUES ("okpara", "oforokpara@gmail.com","okpara");