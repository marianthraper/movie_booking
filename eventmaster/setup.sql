-- Create Database
DROP DATABASE IF EXISTS bookmyshow;
CREATE DATABASE IF NOT EXISTS bookmyshow;
USE bookmyshow;

-- Create Event Table (updated with image_path column)
CREATE TABLE IF NOT EXISTS events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_path VARCHAR(255) NOT NULL  -- New column for image paths
);

-- Create Users Table (unchanged)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL
);
 
-- Create Bookings Table (updated with seat_numbers)
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    seats INT NOT NULL,
    seat_numbers VARCHAR(255), -- Store seat numbers as comma-separated string
    total_price DECIMAL(10, 2) NOT NULL,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);


-- Create Payments Table (unchanged)

CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    booking_id BIGINT NOT NULL,
    payment_method ENUM('CARD', 'UPI', 'CASH') NOT NULL,
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Insert Sample Data into Events (updated with image paths)
INSERT INTO events (name, location, date, price, image_path) VALUES
('Tangled', 'Theater A', '2025-04-10', 1500.00, '/images/Tangled.jpeg'),
('Chennai Express', 'Theater B', '2025-04-15', 800.00, '/images/ChennaiExpress.jpeg'),
('Severence', 'Theater C', '2025-05-01', 2000.00, '/images/Severance.jpeg'),
('Jumanji', 'Theater D', '2025-04-20', 500.00, '/images/Jumanji.jpeg'),
('SpyxFamily', 'Theater A', '2025-04-21', 5000.00, '/images/SpyxFamily.jpeg'),
('Spiderman', 'Theater D', '2025-04-20', 510.00, '/images/Spiderman.jpeg');

-- Insert Sample Data into Users (unchanged)
INSERT INTO users (name, email, phone, password) VALUES
('Alice Johnson', 'alice@example.com', '1234567890', '1'),
('Bob Smith', 'bob@example.com', '9876543210', '2');

-- Insert Sample Data into Bookings (updated with seat_numbers)
INSERT INTO bookings (user_id, event_id, seats, seat_numbers, total_price,status) VALUES
(1, 1, 2, '1,2', 3000.00,'CONFIRMED'),
(2, 3, 1, '5', 2000.00,'CONFIRMED');


-- Insert Sample Data into Payments (unchanged)
INSERT INTO payments (user_id,booking_id, payment_method, payment_status, amount) VALUES
(1,1, 'CARD', 'COMPLETED', 3000.00),
(2,2, 'UPI', 'COMPLETED', 2000.00);

-- Add to your setup.sql
CREATE TABLE food_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_path VARCHAR(255)
);

CREATE TABLE food_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE food_order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    food_item_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES food_orders(id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);


-- Sample food items
INSERT INTO food_items (name, description, price, image_path) VALUES
('Popcorn', 'Large buttered popcorn', 50.00, '/images/popcorn.jpg'),
('Soda', '32oz fountain drink', 35.00, '/images/soda.jpg'),
('Nachos', 'Cheesy nachos with jalapeños', 70.00, '/images/nachos.jpg'),
('Candy', 'Assorted movie theater candy', 40.00, '/images/candy.jpg'),
('Fries', 'Salted french fires', 80.00, '/images/fries.jpg'),
('Pretzels', 'Salty doughy confectionary', 90.00, '/images/pretzel.jpg');



-- Create combo table (doesn't store items, just combo metadata)
CREATE TABLE food_combos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount DECIMAL(5,2) NOT NULL COMMENT 'Percentage discount',
    image_path VARCHAR(255)
);

-- Create junction table for combo items
CREATE TABLE combo_items (
    combo_id BIGINT NOT NULL,
    food_item_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (combo_id, food_item_id),
    FOREIGN KEY (combo_id) REFERENCES food_combos(id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

-- Add combo_id to food_order_items to track combo relationships
ALTER TABLE food_order_items ADD COLUMN combo_id BIGINT NULL;
ALTER TABLE food_order_items ADD CONSTRAINT fk_combo 
    FOREIGN KEY (combo_id) REFERENCES food_combos(id);

-- Sample combo data
INSERT INTO food_combos (name, description, discount, image_path) VALUES
('Family Combo', 'Great for sharing', 15.00, '/images/family-combo.jpg'),
('Sweet Lovers', 'For those with a sweet tooth', 10.00, '/images/sweet-combo.jpg');

-- Sample combo items
INSERT INTO combo_items (combo_id, food_item_id, quantity) VALUES
(1, 1, 1),  -- Family Combo includes 1 Popcorn
(1, 2, 2),  -- Family Combo includes 2 Sodas
(1, 4, 1),  -- Family Combo includes 1 Candy
(2, 4, 2),  -- Sweet Lovers includes 2 Candies
(2, 6, 1);  -- Sweet Lovers includes 1 Pretzel

-- View to calculate combo prices
CREATE VIEW combo_pricing AS
SELECT 
    c.id,
    c.name,
    c.discount,
    SUM(fi.price * ci.quantity) AS original_price,
    SUM(fi.price * ci.quantity) * (1 - c.discount/100) AS discounted_price
FROM food_combos c
JOIN combo_items ci ON c.id = ci.combo_id
JOIN food_items fi ON ci.food_item_id = fi.id
GROUP BY c.id, c.name, c.discount;


select * from users;
select * from bookings;
select * from payments;
 
select * from food_orders;
select * from food_order_items;
