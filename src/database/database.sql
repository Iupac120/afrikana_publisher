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
    category_name VARCHAR (100) UNIQUE NOT NULL,
    created_by INT REFERENCES users (user_id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
--sub category
CREATE TABLE sub_category (
    sub_category_id SERIAL PRIMARY KEY,
    sub_category_name VARCHAR(20) UNIQUE NOT NULL,
    category_id INT REFERENCES category(category_id),
    product_id INT REFERENCES product(product_id),
    quantity_stock INT,
    minimum_stock INT,
    maximum_stock INT
);
-- ProductListing Table
CREATE TABLE product (
    product_id serial PRIMARY KEY,
    artist_id int REFERENCES users(user_id),
    product_title VARCHAR(50) NOT NULL,
    product_description VARCHAR(100),
    category_id INT REFERENCES category (category_id),
    price INT NOT NULL,
    discount NUMERIC(3,2),
    exclusivity_status BOOLEAN DEFAULT FALSE,
    keywords VARCHAR(50),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE cart_item (
    cart_item_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product (product_id),
    cart_id INT REFERENCES cart(cart_id),
    product_quantity INT DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (user_id) UNIQUE,
    session_id VARCHAR(100),
    cart_subtotal NUMERIC(9,4) DEFAULT 0,
    cart_total NUMERIC(9,4) DEFAULT 0,
    cart_tax NUMERIC(3,2) DEFAULT 0,
    cart_shipping_cost NUMERIC(3,2) DEFAULT 0,
    cart_date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cart_date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
-- Dimension table
CREATE TABLE dimension (
    dimension_id SERIAL PRIMARY KEY,
    sub_category_id INT REFERENCES sub_category (sub_category_id),
    dimension INT,
    unit INT NOT NULL
);
CREATE TABLE vendor_account (
    vendor_account_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    account_name VARCHAR(250) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    bank VARCHAR(50) NOT NULL
);

-- Digital Marketplace
CREATE TABLE artist (
    artist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) UNIQUE,
    stage_name VARCHAR (50),
    bio VARCHAR(250),
    social_media_links VARCHAR(250) NOT NULL
);





-- CREATE TABLE social_media (
--     social_media_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(user_id) UNIQUE,
--     social_provide VARCHAR(50) NOT NULL,
--     social_media_links VARCHAR(250) NOT NULL
-- )


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



CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    payment_id VARCHAR(100) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
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



-- Add tables for shopping cart, checkout, order tracking, reviews, and more as needed.
CREATE TABLE shopping_cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT,
    created_at TIMESTAMP,
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

-- Texts Table
CREATE TABLE texts (
    text_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    content TEXT NOT NULL,
    formatting TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE likes (
    like_id SERIAL PRIMARY KEY,
    text_id INTEGER REFERENCES texts(text_id),
    user_id INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(text_id, user_id) 
);

-- Comments Table
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    text_id INTEGER REFERENCES texts(text_id),
    user_id INTEGER REFERENCES users(user_id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Mentions Table
CREATE TABLE mentions (
    mention_id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES comments(comment_id),
    user_id INTEGER REFERENCES users(user_id)
);

-- Emoji-GIF Table
CREATE TABLE emoji (
    emoji_gif_id SERIAL PRIMARY KEY,
    text_id INTEGER REFERENCES texts(text_id),
    url TEXT NOT NULL
);

-- Reports Table
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    text_id INTEGER REFERENCES texts(text_id),
    user_id INTEGER REFERENCES users(user_id),
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Rooms Table
CREATE TABLE chat_rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) UNIQUE NOT NULL,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES chat_rooms(room_id),
    user_id INTEGER REFERENCES users(user_id),
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- video table
CREATE TABLE content (
    video_id SERIAL PRIMARY KEY,
    file_name TEXT NOT NULL,
    cloudinary_url TEXT NOT NULL,
    public_id VARCHAR(50) NOT NULL,
    file_desc VARCHAR(50) NOT NULL,
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Recommendations Table
CREATE TABLE recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES content(content_id),
    recommended_to INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shares Table
CREATE TABLE shares (
    share_id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES content(content_id),
    sharer_id INTEGER REFERENCES users(user_id),
    referral_link TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorization Table
CREATE TABLE categorization (
    categorization_id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES content(content_id),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100)
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
