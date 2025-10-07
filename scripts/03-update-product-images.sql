-- Actualizar rutas de imágenes de productos para usar imágenes reales
USE cafeteria_ucp;

-- Actualizar productos con imágenes correctas desde /public
UPDATE productos SET imagen = '/cappuccino-coffee-with-latte-art.jpg' WHERE nombre = 'Cappuccino';
UPDATE productos SET imagen = '/iced-latte-coffee-with-ice-cubes.jpg' WHERE nombre = 'Latte Frío';
UPDATE productos SET imagen = '/fresh-fruit-smoothie-in-glass.jpg' WHERE nombre = 'Smoothie de Frutas';
UPDATE productos SET imagen = '/cappuccino-coffee-with-latte-art.jpg' WHERE nombre = 'Café Americano';
UPDATE productos SET imagen = '/iced-latte-coffee-with-ice-cubes.jpg' WHERE nombre = 'Té Verde';

UPDATE productos SET imagen = '/gourmet-sandwich-with-fresh-ingredients.jpg' WHERE nombre = 'Sándwich Gourmet';
UPDATE productos SET imagen = '/fresh-salad-bowl-with-mixed-greens.jpg' WHERE nombre = 'Ensalada Fresca';
UPDATE productos SET imagen = '/crispy-empanadas-on-plate.jpg' WHERE nombre = 'Empanadas';
UPDATE productos SET imagen = '/gourmet-sandwich-with-fresh-ingredients.jpg' WHERE nombre = 'Wrap de Pollo';
UPDATE productos SET imagen = '/crispy-empanadas-on-plate.jpg' WHERE nombre = 'Quesadilla';

UPDATE productos SET imagen = '/chocolate-brownie-with-nuts.jpg' WHERE nombre = 'Brownie de Chocolate';
UPDATE productos SET imagen = '/cheesecake-slice-with-berries.jpg' WHERE nombre = 'Cheesecake';
UPDATE productos SET imagen = '/fresh-fruit-tart-with-cream.jpg' WHERE nombre = 'Tarta de Frutas';
UPDATE productos SET imagen = '/chocolate-brownie-with-nuts.jpg' WHERE nombre = 'Muffin de Arándanos';
UPDATE productos SET imagen = '/cheesecake-slice-with-berries.jpg' WHERE nombre = 'Galletas de Avena';
