CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE africanapublisher;

-- Account Creation
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255),
    social_media VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    otp TEXT,
    otp_time TIMESTAMP,
    google_id VARCHAR(255),
    facebook_id VARCHAR(255),
    two_factor_auth_enabled BOOLEAN,
    data_privacy_location VARCHAR(255),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Profile Creation
CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY REFERENCES users(user_id),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url TEXT,
    display_mode boolean DEFAULT TRUE
);
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR (100)

);
--sub category
CREATE TABLE sub_category (
    sub_category_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES category(category_id),
    dimension_id INT REFERENCES dimension(dimension_id)
    product_id INT REFERENCES product(product_id)
    quantity_stock INT,
    minimum_stock INT,
    maximum_stock INT,
);
-- ProductListing Table
CREATE TABLE product (
    product_id serial PRIMARY KEY,
    artist_id int REFERENCES users(user_id),
    product_title VARCHAR(50),
    product_description VARCHAR(100),
    category_id INT REFERENCES category (category_id),
    price INT NOT NULL,
    exclusivity_status BOOLEAN DEFAULT FALSE,
    keywords VARCHAR(50),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Dimension table
CREATE TABLE dimension (
    dimension_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product (product_id),
    dimension INT,
    unit INT NOT NULL
);
CREATE TABLE account_info (
    account_info_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    account_name VARCHAR(250) NOT NULL,
    account_number INT NOT NULL,
    bank VARCHAR(50)
);



-- Digital Marketplace
CREATE TABLE artists (
    artist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    bio VARCHAR(250),
    social_media_links VARCHAR(250)
);


-- Account Settings
CREATE TABLE email_preferences (
    user_id INT PRIMARY KEY,
    email_preference_settings TEXT
);

-- Artist Dashboard
CREATE TABLE earnings (
    user_id INT PRIMARY KEY,
    amount INT NOT NULL,
    earning_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    earning_source VARCHAR(100) NOT NULL,
);

CREATE TABLE sales_analytics (
    user_id INT PRIMARY KEY,
    sales_data TEXT
);

CREATE TABLE inventory (
    user_id INT PRIMARY KEY,
    inventory_data TEXT
);



CREATE TABLE referral_links (
    user_id INT PRIMARY KEY,
    referral_link TEXT
);

CREATE TABLE subscriptions (
    user_id INT PRIMARY KEY,
    subscription_data TEXT
);



CREATE TABLE product_listings (
    listing_id SERIAL PRIMARY KEY,
    artist_id INT,
    -- Add fields for product details
);

CREATE TABLE vendor_accounts (
    user_id INT PRIMARY KEY,
    bank_details TEXT
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_status TEXT
);

CREATE TABLE smart_contracts (
    contract_id SERIAL PRIMARY KEY,
    contract_details TEXT
);

CREATE TABLE image_metadata (
    image_id SERIAL PRIMARY KEY,
    metadata_details TEXT
);

CREATE TABLE image_watermarks (
    image_id INT PRIMARY KEY,
    watermark_details TEXT
);

CREATE TABLE resized_images (
    image_id INT PRIMARY KEY,
    resize_details TEXT
);

CREATE TABLE legal_agreement (
    agreement_document TEXT
);

CREATE TABLE privacy_policy (
    privacy_policy_document TEXT
);

-- E-Commerce
CREATE TABLE artworks (
    artwork_id SERIAL PRIMARY KEY,
    -- Add fields for artwork details
);

CREATE TABLE collections (
    collection_id SERIAL PRIMARY KEY,
    -- Add fields for collection details
);

CREATE TABLE sub_collections (
    sub_collection_id SERIAL PRIMARY KEY,
    -- Add fields for sub-collection details
);

-- Add tables for shopping cart, checkout, order tracking, reviews, and more as needed.
CREATE TABLE shopping_cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT,
    created_at TIMESTAMP,
    -- Add any other relevant fields
);

CREATE TABLE cart_items (
    item_id SERIAL PRIMARY KEY,
    cart_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL,
    -- Add any other relevant fields
);

CREATE TABLE checkout (
    checkout_id SERIAL PRIMARY KEY,
    user_id INT,
    cart_id INT,
    total_price DECIMAL,
    checkout_date TIMESTAMP,
    -- Add any other relevant fields
);

CREATE TABLE order_tracking (
    tracking_id SERIAL PRIMARY KEY,
    order_id INT,
    tracking_info TEXT,
    update_time TIMESTAMP,
    -- Add any other relevant fields
);

CREATE TABLE artwork_reviews (
    review_id SERIAL PRIMARY KEY,
    artwork_id INT,
    user_id INT,
    review_text TEXT,
    rating INT,
    review_date TIMESTAMP,
    -- Add any other relevant fields
);


-- Multi-media Gallery
CREATE TABLE texts (
    text_id SERIAL PRIMARY KEY,
    content TEXT,
    likes INT,
    comments TEXT,
    user_mentions TEXT,
    emoji_gif TEXT
);

CREATE TABLE chat_rooms (
    room_id SERIAL PRIMARY KEY,
    room_details TEXT
);

CREATE TABLE chat_messages (
    message_id SERIAL PRIMARY KEY,
    room_id INT,
    user_id INT,
    message_text TEXT
);

-- Add tables for content upload, recommendations, categorization, and more as needed.
CREATE TABLE content_upload (
    content_id SERIAL PRIMARY KEY,
    user_id INT,
    content_type VARCHAR(50),
    upload_date TIMESTAMP,
    file_url TEXT,
    -- Add any other relevant fields
);

CREATE TABLE content_recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INT,
    recommended_content_id INT,
    recommendation_date TIMESTAMP,
    -- Add any other relevant fields
);

CREATE TABLE content_categorization (
    categorization_id SERIAL PRIMARY KEY,
    content_id INT,
    collection_id INT,
    sub_collection_id INT,
    -- Add any other relevant fields
);

-- IAA Plugin
CREATE TABLE image_analysis (
    image_id SERIAL PRIMARY KEY,
    analysis_results TEXT
);

-- Add more tables for image upload, analysis results, and other IAA-related data.
CREATE TABLE image_upload (
    image_id SERIAL PRIMARY KEY,
    user_id INT,
    upload_date TIMESTAMP,
    file_url TEXT,
    file_type VARCHAR(50),
    quality_validation BOOLEAN,
    -- Add any other relevant fields
);

CREATE TABLE image_analysis_results (
    result_id SERIAL PRIMARY KEY,
    image_id INT,
    analysis_date TIMESTAMP,
    analysis_data TEXT,
    -- Add any other relevant fields
);
