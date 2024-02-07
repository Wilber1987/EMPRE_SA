CREATE SCHEMA facturacion
GO

ALTER SCHEMA facturacion TRANSFER dbo.Transaccion_Factura;

ALTER TABLE facturacion.transaccion_factura
ADD 
	no_factura nvarchar(50) not null default '0',
	subtotal float default 0 not null,
	iva float default 0
GO

CREATE TABLE facturacion.transaccion_factura_detalle (
	id_detalle_factura int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	id_factura int not null,
	id_producto int not NULL,
	cantidad float not null,
	precio_venta float not null,
	iva float,
	total float	
)
GO

ALTER TABLE facturacion.transaccion_factura_detalle
ADD CONSTRAINT fk_transaccion_factura_detalle_transaccion_factura
FOREIGN KEY (id_factura)
REFERENCES facturacion.transaccion_factura(id_factura);

CREATE TABLE facturacion.catalogo_producto (
	id_producto	 int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	descripcion	varchar(100),
	id_categoria int,
	id_marca int
)
GO

CREATE TABLE facturacion.catalogo_marca (
	id_marca  int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	nombre	nvarchar(150),
	descripcion nvarchar(150),
	estado nvarchar(50)	
)
GO

ALTER TABLE facturacion.catalogo_producto
ADD CONSTRAINT fk_catalogo_productos_catalogo_marcas
FOREIGN KEY (id_marca)
REFERENCES facturacion.catalogo_marca(id_marca);

CREATE TABLE facturacion.catalogo_categorias (
	id_categoria int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	descripcion	varchar(100),
	estado	nvarchar(50)
)
GO

CREATE TABLE facturacion.transaction_lotes (
	id_transaccion int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	descripcion	varchar(100),
	fecha datetime,
	id_usuario int,
	id_tipo_transaccion int,
	estado	nvarchar(50)
)
GO

CREATE TABLE facturacion.transaction_detalle_lotes (
	id_detalle_transaccion int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	id_lote	int	,
	cantidad_afectada	int	,
	id_transaccion	int	,
	id_detalle_factura	int	
)
GO
