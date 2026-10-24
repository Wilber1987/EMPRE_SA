create schema transactions;

CREATE TABLE transactions.Orden_Movimiento (
    id_orden INT PRIMARY KEY IDENTITY,
    id_documento_origen INT,
    tipo_documento_origen VARCHAR(50),
    descripcion VARCHAR(500),
    concepto VARCHAR(200),
    monto DECIMAL(18,2),
    tasa_cambio DECIMAL(18,4),
    tasa_cambio_compra DECIMAL(18,4),
    moneda VARCHAR(20),
    Id_cuenta_origen INT,
    Id_cuenta_destino INT,
    Tipo_Movimiento VARCHAR(50),
    estado VARCHAR(20),
    id_usuario_crea INT,
    id_usuario_aprueba INT,
    fecha_creacion DATETIME,
    fecha_aprobacion DATETIME,
    motivo_rechazo VARCHAR(500),
    id_sucursal INT,
    id_movimiento_ejecutado INT,
    requiere_aprobacion BIT
);

CREATE TABLE transactions.Corte_Caja (
    id_corte_caja INT PRIMARY KEY IDENTITY,
    id_cuenta INT,
    id_usuario_apertura INT,
    id_usuario_cierre INT,
    fecha_apertura DATETIME,
    fecha_cierre DATETIME,
    estado VARCHAR(20),
    id_sucursal INT,
    monto_inicial_cordobas DECIMAL(18,2),
    monto_inicial_dolares DECIMAL(18,2),
    monto_esperado_cordobas DECIMAL(18,2),
    monto_esperado_dolares DECIMAL(18,2),
    monto_fisico_cordobas DECIMAL(18,2),
    monto_fisico_dolares DECIMAL(18,2),
    diferencia_cordobas DECIMAL(18,2),
    diferencia_dolares DECIMAL(18,2),
    observaciones_apertura VARCHAR(500),
    observaciones_cierre VARCHAR(500)
);

CREATE TABLE transactions.Denominacion_Catalogo (
    id_denominacion INT PRIMARY KEY IDENTITY,
    valor DECIMAL(18,2),
    moneda VARCHAR(20),
    tipo VARCHAR(20),  -- BILLETE, MONEDA
    activa BIT
);

CREATE TABLE transactions.Denominacion_Caja (
    id_denominacion_caja INT PRIMARY KEY IDENTITY,
    id_corte_caja INT,
    id_denominacion INT,
    cantidad INT,
    subtotal DECIMAL(18,2)
);

-- ============================================
-- CREACIÓN DE TABLA Denominacion_Catalogo
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Denominacion_Catalogo')
BEGIN
    CREATE TABLE transactions.Denominacion_Catalogo (
        id_denominacion INT PRIMARY KEY IDENTITY(1,1),
        valor DECIMAL(18,2) NOT NULL,
        moneda VARCHAR(20) NOT NULL,          -- CORDOBAS, DOLARES
        tipo VARCHAR(20) NOT NULL,            -- BILLETE, MONEDA
        activa BIT NOT NULL DEFAULT 1,
        
        -- Constraint para evitar duplicados
        CONSTRAINT UQ_Denominacion UNIQUE (valor, moneda, tipo)
    );
END
GO

-- ============================================
-- INSERCIÓN DE DENOMINACIONES - CÓRDOBAS (BILLETES)
-- ============================================
INSERT INTO transactions.Denominacion_Catalogo (valor, moneda, tipo, activa) VALUES
(10,    'CORDOBAS', 'BILLETE', 1),
(20,    'CORDOBAS', 'BILLETE', 1),
(50,    'CORDOBAS', 'BILLETE', 1),
(100,   'CORDOBAS', 'BILLETE', 1),
(200,   'CORDOBAS', 'BILLETE', 1),
(500,   'CORDOBAS', 'BILLETE', 1),
(1000,  'CORDOBAS', 'BILLETE', 1);

-- ============================================
-- INSERCIÓN DE DENOMINACIONES - CÓRDOBAS (MONEDAS)
-- ============================================
INSERT INTO transactions.Denominacion_Catalogo (valor, moneda, tipo, activa) VALUES
(0.05,  'CORDOBAS', 'MONEDA', 1),   -- 5 centavos
(0.10,  'CORDOBAS', 'MONEDA', 1),   -- 10 centavos
(0.25,  'CORDOBAS', 'MONEDA', 1),   -- 25 centavos
(0.50,  'CORDOBAS', 'MONEDA', 1),   -- 50 centavos
(1,     'CORDOBAS', 'MONEDA', 1),   -- 1 córdoba
(5,     'CORDOBAS', 'MONEDA', 1),   -- 5 córdobas
(10,    'CORDOBAS', 'MONEDA', 1);   -- 10 córdobas

-- ============================================
-- INSERCIÓN DE DENOMINACIONES - DÓLARES (BILLETES)
-- ============================================
INSERT INTO transactions.Denominacion_Catalogo (valor, moneda, tipo, activa) VALUES
(1,     'DOLARES', 'BILLETE', 1),
(2,     'DOLARES', 'BILLETE', 1),
(5,     'DOLARES', 'BILLETE', 1),
(10,    'DOLARES', 'BILLETE', 1),
(20,    'DOLARES', 'BILLETE', 1),
(50,    'DOLARES', 'BILLETE', 1),
(100,   'DOLARES', 'BILLETE', 1);

-- ============================================
-- INSERCIÓN DE DENOMINACIONES - DÓLARES (MONEDAS)
-- ============================================
INSERT INTO transactions.Denominacion_Catalogo (valor, moneda, tipo, activa) VALUES
(0.01,  'DOLARES', 'MONEDA', 1),    -- 1 centavo (penny)
(0.05,  'DOLARES', 'MONEDA', 1),    -- 5 centavos (nickel)
(0.10,  'DOLARES', 'MONEDA', 1),    -- 10 centavos (dime)
(0.25,  'DOLARES', 'MONEDA', 1),    -- 25 centavos (quarter)
(0.50,  'DOLARES', 'MONEDA', 1),    -- 50 centavos (half dollar)
(1,     'DOLARES', 'MONEDA', 1);    -- 1 dólar





CREATE TABLE transactions.Inventario_Denominacion_Caja (
    id_inventario INT PRIMARY KEY IDENTITY(1,1),
    id_cuenta INT NOT NULL,                    -- La cuenta tipo caja
    id_denominacion INT NOT NULL,
    cantidad_actual INT NOT NULL DEFAULT 0,
    ultima_actualizacion DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_InventarioDenominacion_Cuenta 
        FOREIGN KEY (id_cuenta) REFERENCES Catalogo_Cuentas(id_cuentas),
    CONSTRAINT FK_InventarioDenominacion_Catalogo 
        FOREIGN KEY (id_denominacion) REFERENCES transactions.Denominacion_Catalogo(id_denominacion),
    CONSTRAINT UQ_InventarioDenominacion 
        UNIQUE (id_cuenta, id_denominacion)
);

ALTER TABLE EMPRE_SA.transactions.Corte_Caja ADD Denominaciones_Apertura nvarchar(MAX) NULL;
ALTER TABLE EMPRE_SA.transactions.Corte_Caja ADD Denominaciones_Cierre nvarchar(MAX) NULL;
ALTER TABLE EMPRE_SA.dbo.Transaction_Movimiento ADD Denominaciones nvarchar(MAX) NULL;
