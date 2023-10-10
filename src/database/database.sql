CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE africanaPublisher;

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    first_name VARCHAR (50),
    last_name VARCHAR (50),
    google_id TEXT,
    facebook_id TEXT,
    social_provider VARCHAR (100),
    display_mode BOOLEAN DEFAULT TRUE,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
);

CREATE TABLE profile_image (
    user_id BIGINT REFERENCES users (user_id) ,
    public_id TEXT,
    size VARCHAR(50),
    watermarked BOOLEAN,
    image_url TEXT,
    created_at DATE,
    updated_at DATE
);



-- Users Table
CREATE TABLE users (
    user_id serial PRIMARY KEY,
    user_name text NOT NULL,
    user_email text NOT NULL UNIQUE,
    user_password text NOT NULL,
    first_name varchar(50),
    last_name varchar(50),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    google_id text,
    facebook_id text,
    social_provider varchar(100),
    display_mode boolean DEFAULT TRUE
);

-- UserSocialTable
CREATE TABLE user_social (
    social_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    social_media_type text,
    social_media_id text,
    access_token text
);

-- UserProfileTable
CREATE TABLE user_profile (
    profile_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    avatar_image_id int REFERENCES profile_image(image_id)
);

-- UserPasswordTable
CREATE TABLE user_password (
    password_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    password_hash text
);

-- UserEmailPreferencesTable
CREATE TABLE user_email_preferences (
    email_preferences_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    email_subscription_preference boolean
);

-- UserEarningsTable
CREATE TABLE user_earnings (
    earnings_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    earnings_amount numeric(10, 2),
    earnings_date date
);

-- UserAnalyticsTable
CREATE TABLE user_analytics (
    analytics_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    analytics_data jsonb,
    analytics_date date
);

-- UserInventoryTable
CREATE TABLE user_inventory (
    inventory_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    product_id int REFERENCES product_listing(product_id),
    inventory_data jsonb
);

-- UserAccountInfoTable
CREATE TABLE user_account_info (
    account_info_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    account_info_data jsonb
);

-- ProfileImage Table
CREATE TABLE profile_image (
    profile_image_id serial PRIMARY KEY,
    user_id int REFERENCES users (user_id),
    public_id text,
    image_url text
);

-- ProductListing Table
CREATE TABLE product_listing (
    product_id serial PRIMARY KEY,
    artist_id int REFERENCES users(user_id),
    product_title text,
    product_description text,
    category text,
    sub_category text,
    price numeric(10, 2),
    exclusivity_status boolean,
    keywords text[],
    -- Add other fields as needed
);

-- UserVendorAccountTable
CREATE TABLE user_vendor_account (
    vendor_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    bank_name text,
    account_number text,
    confirm_account_name text
);

-- UserCartTable
CREATE TABLE user_cart (
    cart_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    product_id int REFERENCES product_listing(product_id),
    quantity int,
    -- Add other fields as needed
);

-- UserOrderTable
CREATE TABLE user_order (
    order_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    order_status text,
    order_date timestamp
);

-- UserOrderItemTable
CREATE TABLE user_order_item (
    order_item_id serial PRIMARY KEY,
    order_id int REFERENCES user_order(order_id),
    product_id int REFERENCES product_listing(product_id),
    quantity int,
    -- Add other fields as needed
);

-- ShippingInfoTable
CREATE TABLE shipping_info (
    shipping_info_id serial PRIMARY KEY,
    user_id int REFERENCES users(user_id),
    address text,
    estimated_delivery_time text,
    cost numeric(10, 2)
);

-- OrderTrackingTable
CREATE TABLE order_tracking (
    tracking_id serial PRIMARY KEY,
    order_id int REFERENCES user_order(order_id),
    tracking_info text
);

-- ArtworkReviewsTable
CREATE TABLE artwork_reviews (
    review_id serial PRIMARY KEY,
    artwork_id int REFERENCES product_listing(product_id),
    user_id int REFERENCES users(user_id),
    review_text text,
    rating int,
    review_date timestamp
);

-- ContentTable
CREATE TABLE content (
    content_id serial PRIMARY KEY,
    content_type text,
    content_data jsonb,
    -- Add other fields as needed
);

-- ContentLikesTable
CREATE TABLE content_likes (
    like_id serial PRIMARY KEY,
    content_id int REFERENCES content(content_id),
    user_id int REFERENCES users(user_id),
    like_date timestamp
);

-- ContentCommentsTable
CREATE TABLE content_comments (
    comment_id serial PRIMARY KEY,
    content_id int REFERENCES content(content_id),
    user_id int REFERENCES users(user_id),
    comment_text text,
    comment_date timestamp
);

-- ChatRoomTable
CREATE TABLE chat_room (
    room_id serial PRIMARY KEY,
    room_name text
    -- Add other fields as needed
);

-- ChatMessageTable
CREATE TABLE chat_message (
    message_id serial PRIMARY KEY,
    room_id int REFERENCES chat_room(room_id),
    user_id int REFERENCES users(user_id),
    message_text text,
    message_date timestamp
);

-- ImageMetadataTable
CREATE TABLE image_metadata (
    image_id serial PRIMARY KEY,
    unique_identifier text,
    forensic_watermark text
);

-- LegalAgreementTable
CREATE TABLE legal_agreement (
    agreement_id serial PRIMARY KEY,
    agreement_text text
);

-- PrivacyPolicyTable
CREATE TABLE privacy_policy (
    policy_id serial PRIMARY KEY,
    policy_text text
);

-- ImageAnalyzerResultsTable
CREATE TABLE image_analyzer_results (
    analysis_id serial PRIMARY KEY,
    image_id int REFERENCES image_metadata(image_id),
    analysis_results jsonb,
    analysis_date timestamp
);
