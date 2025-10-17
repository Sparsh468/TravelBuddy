-- Database schema for TravelBuddy application

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    theme VARCHAR(200) NOT NULL,
    image VARCHAR(500) NOT NULL,
    budget_base_cost INTEGER NOT NULL,
    balanced_base_cost INTEGER NOT NULL,
    luxury_base_cost INTEGER NOT NULL
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    destination_id VARCHAR(50) NOT NULL,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('budget', 'balanced', 'luxury')),
    name VARCHAR(200) NOT NULL,
    note VARCHAR(300),
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- Day plan templates table
CREATE TABLE IF NOT EXISTS day_plan_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    destination_id VARCHAR(50) NOT NULL,
    day_order INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    note VARCHAR(500),
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotels_destination_tier ON hotels(destination_id, tier);
CREATE INDEX IF NOT EXISTS idx_day_plans_destination_order ON day_plan_templates(destination_id, day_order);

