-- Insert admin user (password: admin123)
INSERT INTO users (first_name, last_name, email, password_hash, role) 
VALUES (
    'Admin', 
    'System', 
    'admin@seismicwatch.com', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
    'admin'
);

-- Insert sample news articles
INSERT INTO news (title, content, author_id) VALUES 
(
    'Bienvenidos a SeismicWatch',
    'Nos complace presentar SeismicWatch, el nuevo sistema de monitoreo sísmico global. Nuestra plataforma ofrece datos en tiempo real de terremotos alrededor del mundo, utilizando información oficial del USGS.',
    1
),
(
    'Nueva funcionalidad: Filtros avanzados',
    'Hemos agregado filtros avanzados para que puedas personalizar la visualización de eventos sísmicos según magnitud, fecha y ubicación geográfica. Explora los datos de manera más eficiente.',
    1
),
(
    'Importancia del monitoreo sísmico',
    'El monitoreo continuo de la actividad sísmica es fundamental para la prevención de desastres y la investigación científica. Nuestro sistema contribuye a mantener informada a la comunidad global.',
    1
);

-- Insert sample earthquake data (optional - will be populated from USGS API)
INSERT INTO earthquakes (place, magnitude, depth, latitude, longitude, event_time, source_id) VALUES
(
    'Pacific Ocean, near Japan',
    6.2,
    35.5,
    35.6762,
    139.6503,
    DATEADD(hour, -2, GETDATE()),
    'sample_earthquake_001'
),
(
    'California, USA',
    4.8,
    12.3,
    34.0522,
    -118.2437,
    DATEADD(hour, -5, GETDATE()),
    'sample_earthquake_002'
);
