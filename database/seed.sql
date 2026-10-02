INSERT INTO crops (name) VALUES 
('Cotton'), 
('Groundnut'), 
('Maize'), 
('Millet'), 
('Soybean') ON CONFLICT DO NOTHING;

INSERT INTO crop_stages (crop_id, name) VALUES 
(1, 'Pre-sowing'), (1, 'Germination'), (1, 'Early growth'), (1, 'Vegetative'), (1, 'Flowering'),
(2, 'Pre-sowing'), (2, 'Germination'), (2, 'Early growth'), (2, 'Vegetative'), (2, 'Flowering'),
(3, 'Pre-sowing'), (3, 'Germination'), (3, 'Early growth'), (3, 'Vegetative'), (3, 'Flowering'),
(4, 'Pre-sowing'), (4, 'Germination'), (4, 'Early growth'), (4, 'Vegetative'), (4, 'Flowering'),
(5, 'Pre-sowing'), (5, 'Germination'), (5, 'Early growth'), (5, 'Vegetative'), (5, 'Flowering');

INSERT INTO locations (state, district, block, village, latitude, longitude) VALUES 
('Gujarat', 'Ahmedabad', 'Daskroi', 'Jetalpur', 22.8687, 72.5855),
('Gujarat', 'Ahmedabad', 'Sanand', 'Sanand', 22.9868, 72.3807),
('Gujarat', 'Ahmedabad', 'Bavla', 'Bavla', 22.8256, 72.3683),
('Gujarat', 'Ahmedabad', 'Detroj', 'Detroj', 23.3283, 72.1643),
('Gujarat', 'Ahmedabad', 'Viramgam', 'Viramgam', 23.1189, 72.0371),
('Gujarat', 'Ahmedabad', 'Mandal', 'Mandal', 23.2847, 71.9168),
('Gujarat', 'Ahmedabad', 'Dholka', 'Dholka', 22.7230, 72.4646),
('Gujarat', 'Ahmedabad', 'Ahmedabad City', 'Ahmedabad City', 23.0225, 72.5714),
('Gujarat', 'Kheda', 'Nadiad', 'Nadiad', 22.6916, 72.8634),
('Gujarat', 'Kheda', 'Kheda', 'Kheda', 22.7508, 72.6841);
