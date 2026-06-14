-- Tablas

-- 1. Tabla de Clientes
CREATE TABLE clientes (
    cliente_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fecha_registro DATE DEFAULT CURRENT_DATE
);

-- 2. Tabla de Productos
CREATE TABLE productos (
    producto_id SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    precio NUMERIC(10, 2) NOT NULL,
    stock INT DEFAULT 0
);

-- 3. Tabla de Pedidos (Contiene las Claves Foráneas)
CREATE TABLE pedidos (
    pedido_id SERIAL PRIMARY KEY,
    cliente_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Definición de Claves Foráneas (Foreign Keys)
    CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id) ON DELETE SET NULL,
    CONSTRAINT fk_producto FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE CASCADE
);


-- Inserts

-- Insertar Clientes (Ojo: Carlos no tiene email, y Elena no comprará nada para probar LEFT JOINs)
INSERT INTO clientes (nombre, email, fecha_registro) VALUES
('Ana Gómez', 'ana@email.com', '2026-01-15'),
('Carlos Ruiz', NULL, '2026-02-20'),
('María López', 'maria@email.com', '2026-03-05'),
('Elena Marín', 'elena@email.com', '2026-04-12');

-- Insertar Productos
INSERT INTO productos (nombre_producto, categoria, precio, stock) VALUES
('Laptop Pro', 'Electrónica', 1200.00, 10),
('Ratón Inalámbrico', 'Electrónica', 25.50, 50),
('Teclado Mecánico', 'Electrónica', 80.00, 15),
('Cafetera Express', 'Hogar', 150.00, 5);

-- Insertar Pedidos (Varios clientes compran cosas, Ana compra dos veces)
INSERT INTO pedidos (cliente_id, producto_id, cantidad, fecha_pedido) VALUES
(1, 1, 1, '2026-05-01 10:00:00'), -- Ana compra una Laptop
(1, 2, 2, '2026-05-02 11:30:00'), -- Ana compra dos ratones
(2, 3, 1, '2026-05-03 15:45:00'), -- Carlos compra un teclado
(3, 1, 1, '2026-05-04 09:15:00'), -- María compra una Laptop
(2, 2, 1, '2026-05-05 18:20:00'); -- Carlos compra un ratón