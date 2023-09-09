CREATE TABLE users (
    user_id uuid DEFAULT
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE restaurants (
    restaurant_id BIGSERIAL NOT NULL ,
    user_id UUID,
    name VARCHAR(50) NOT NULL,
    location VARCHAR (50) NOT NULL,
    price_range INT NOT NULL check (price_range >= 1 and price_range <=5),
    PRIMARY KEY (restaurant_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)


);

CREATE TABLE reviews (
    reviews_id BIGSERIAL NOT NULL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL check(rating >=1 and rating <=5)
);


CREATE TABLE clients (
    client_id uuid DEFAULT
    uuid_generate_v4(),
    user_id UUID,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    note VARCHAR(255) NOT NULL,
    PRIMARY KEY (client_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE client_orders (
    order_id SERIAL,
    user_id UUID,
    client_id UUID,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    status_id INT NOT NULL check(status_id >=1 and status_id <=5),
    status_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
ALTER SEQUENCE client_orders_order_id_seq RESTART WITH 100;

-- status_name, status_id
-- created 1
-- paid 2
-- dispatched 3
-- delivered 4
-- cancelled 5

CREATE TABLE products (
    product_id SERIAL,
    user_id UUID,
    product_reference_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    type_id INT NOT NULL,
    sub_type_id INT NOT NULL, 
    factory_id INT NOT NULL,
    unit_cost DECIMAL(32,4),
    photos bytea,
    current_box_quantity INT,
    pack_per_box INT,
    pieces_per_pack INT,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
    PRIMARY KEY (product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE client_order_details (
    order_detail_id SERIAL,
    user_id UUID,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    box_quantity INT NOT NULL,
    piece_sell_price DECIMAL(32,4),
    PRIMARY KEY (order_detail_id),
    FOREIGN KEY (order_id) REFERENCES client_orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

--create extension if not exists "uuid-ossp"; (need this in order for postgre to run the function uuid, just paste it in the database from the terminal)

--ALTER TABLE restaurants ADD COLUMN user_id UUID REFERENCES users(user_id);

-- insert into restaurants (name, location,price_range) values ('asd', 'asd',3);

-- ALTER TABLE restaurants ALTER COLUMN user_id SET NOT NULL;



-- select restaurants.restaurant_id,name,user_name,location,price_range,users.user_id, count,average_rating from restaurants 
-- left join (select restaurant_id, COUNT(*) as count, TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews 
-- on restaurants.restaurant_id=reviews.restaurant_id
-- right join users on users.user_id=restaurants.user_id

-- select * from restaurants 
-- left join (select restaurant_id, COUNT(*) as count, TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews 
-- on restaurants.restaurant_id=reviews.restaurant_id


-- ALTER TABLE reviews
-- RENAME COLUMN reviews_id TO review_id;