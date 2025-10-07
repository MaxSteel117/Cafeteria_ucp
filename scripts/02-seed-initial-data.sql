-- Insertar datos iniciales para Cafetería UCP
USE cafeteria_ucp;

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES 
('Administrador UCP', 'admin@ucp.edu.co', '$2b$10$rQZ8kqXvJ9YxJ9YxJ9YxJOeKqXvJ9YxJ9YxJ9YxJOeKqXvJ9YxJ9Y', 'admin');

-- Insertar productos del menú
INSERT INTO productos (nombre, descripcion, precio, categoria, imagen) VALUES 
-- Bebidas
('Cappuccino', 'Espresso con leche vaporizada y espuma cremosa', 3.50, 'bebidas', '/cappuccino-coffee-with-latte-art.jpg'),
('Latte Frío', 'Café espresso con leche fría y hielo', 4.00, 'bebidas', '/iced-latte-coffee-with-ice-cubes.jpg'),
('Smoothie de Frutas', 'Batido natural de frutas frescas', 5.00, 'bebidas', '/fresh-fruit-smoothie-in-glass.jpg'),
('Café Americano', 'Café espresso con agua caliente', 2.50, 'bebidas', '/placeholder.svg?height=200&width=300'),
('Té Verde', 'Té verde natural con antioxidantes', 2.00, 'bebidas', '/placeholder.svg?height=200&width=300'),

-- Comidas
('Sándwich Gourmet', 'Pan artesanal con pollo, aguacate y vegetales frescos', 7.50, 'comidas', '/gourmet-sandwich-with-fresh-ingredients.jpg'),
('Ensalada Fresca', 'Mix de lechugas, tomate, pepino y aderezo casero', 6.00, 'comidas', '/fresh-salad-bowl-with-mixed-greens.jpg'),
('Empanadas', 'Empanadas caseras de carne, pollo o queso', 2.50, 'comidas', '/crispy-empanadas-on-plate.jpg'),
('Wrap de Pollo', 'Tortilla integral con pollo, vegetales y salsa', 6.50, 'comidas', '/placeholder.svg?height=200&width=300'),
('Quesadilla', 'Tortilla con queso derretido y vegetales', 5.00, 'comidas', '/placeholder.svg?height=200&width=300'),

-- Postres
('Brownie de Chocolate', 'Brownie casero con nueces y chocolate derretido', 3.00, 'postres', '/chocolate-brownie-with-nuts.jpg'),
('Cheesecake', 'Tarta de queso cremosa con frutos rojos', 4.50, 'postres', '/cheesecake-slice-with-berries.jpg'),
('Tarta de Frutas', 'Tarta con crema pastelera y frutas de temporada', 4.00, 'postres', '/fresh-fruit-tart-with-cream.jpg'),
('Muffin de Arándanos', 'Muffin esponjoso con arándanos frescos', 2.75, 'postres', '/placeholder.svg?height=200&width=300'),
('Galletas de Avena', 'Galletas caseras de avena con pasas', 2.25, 'postres', '/placeholder.svg?height=200&width=300');
