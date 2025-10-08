-- 🚨 Código Corregido (Reemplaza tu tabla 'pedidos' actual con estas dos)

-- 1. Tabla de Pedidos (El Encabezado de la Orden)
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    
    -- El total ya no se calcula aquí, sino del detalle (pero lo dejamos por si acaso)
    total DECIMAL(10, 2) NOT NULL, 
    
    estado ENUM('pendiente', 'listo', 'entregado', 'cancelado') DEFAULT 'pendiente',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);


-- 2. Tabla de Detalle de Pedido (El Carrito de Compras)
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Clave foránea al Encabezado del Pedido
    id_pedido INT NOT NULL, 
    
    -- Clave foránea al Producto
    id_producto INT NOT NULL, 
    
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL, -- El precio del producto al momento de la compra
    notas TEXT,

    FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE RESTRICT
);