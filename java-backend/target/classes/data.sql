-- Simple sample data for TravelBuddy application
-- Only 5 popular destinations for easy understanding

-- Insert destinations (5 popular Indian destinations)
INSERT INTO destinations (id, name, state, theme, image, budget_base_cost, balanced_base_cost, luxury_base_cost) VALUES
('goa', 'Goa', 'Goa', 'Beaches & nightlife', 'goa.jpeg', 2000, 3500, 8000),
('jaipur', 'Jaipur', 'Rajasthan', 'Palaces & culture', 'jaipur.jpeg', 2200, 3800, 8000),
('manali', 'Manali', 'Himachal Pradesh', 'Mountains & adventure', 'manali.jpeg', 2000, 3500, 8000),
('mumbai', 'Mumbai', 'Maharashtra', 'City & seafronts', 'mumbai.jpeg', 2800, 5000, 8000),
('kerala', 'Kochi', 'Kerala', 'Backwaters & culture', 'kochi.jpeg', 2400, 4200, 8000);

-- Insert hotels for Goa (3 tiers: budget, balanced, luxury)
INSERT INTO hotels (destination_id, tier, name, note) VALUES
('goa', 'budget', 'Beach Resort Goa', 'Near Calangute Beach'),
('goa', 'balanced', 'Taj Holiday Village', 'Candolim Beach'),
('goa', 'luxury', 'W Goa', 'Vagator Beach');

-- Insert hotels for Jaipur
INSERT INTO hotels (destination_id, tier, name, note) VALUES
('jaipur', 'budget', 'Heritage Hotel Jaipur', 'City Center'),
('jaipur', 'balanced', 'Alsisar Haveli', 'Near MI Road'),
('jaipur', 'luxury', 'Rambagh Palace', 'Royal Luxury');

-- Insert hotels for Manali
INSERT INTO hotels (destination_id, tier, name, note) VALUES
('manali', 'budget', 'Snow Valley Resort', 'Old Manali'),
('manali', 'balanced', 'Manali Heights', 'Log Huts Area'),
('manali', 'luxury', 'Span Resort & Spa', 'Riverside');

-- Insert hotels for Mumbai
INSERT INTO hotels (destination_id, tier, name, note) VALUES
('mumbai', 'budget', 'Hotel Marine Plaza', 'Marine Drive'),
('mumbai', 'balanced', 'Trident Nariman Point', 'Business District'),
('mumbai', 'luxury', 'The Taj Mahal Palace', 'Gateway of India');

-- Insert hotels for Kerala (Kochi)
INSERT INTO hotels (destination_id, tier, name, note) VALUES
('kerala', 'budget', 'Hotel Abad Plaza', 'Fort Kochi'),
('kerala', 'balanced', 'The Gateway Hotel', 'Marine Drive'),
('kerala', 'luxury', 'Taj Malabar Resort', 'Willingdon Island');