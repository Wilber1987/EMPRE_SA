CREATE SCHEMA facturacion
GO

/*ALTER SCHEMA facturacion TRANSFER dbo.Transaccion_Factura;

ALTER TABLE facturacion.transaccion_factura
ADD 
	no_factura nvarchar(50) not null default '0',
	subtotal float default 0 not null,
	iva float default 0
GO

--revierto el cambio de cambio de esquema y dejo facturacion en el esquema dbo
ALTER SCHEMA dbo TRANSFER facturacion.Transaccion_Factura;

*/

--MELA EJECUTAR LO DE ARRIBA SI YA TENES LAS TABLAS MOVIDAS

DROP TABLE facturacion.Transaccion_Factura;

CREATE TABLE [facturacion].[TransaccionFactura](
    [IdFactura] [int] IDENTITY(1,1) NOT NULL,
    [Tipo] [nvarchar](150) NULL, -- Tipo de factura (si es aplicable)
    [Concepto] [nvarchar](300) NULL,
    [Serie] [nvarchar](50) NOT NULL,
    [FormaPago] VARCHAR(50),
    [DireccionEnvio] VARCHAR(100),
    [IdCliente] [int] NULL,
    [IdSucursal] [int] NULL,
    [Fecha] [datetime] NULL,
    [FechaVencimiento] datetime null,
    [Observaciones] nvarchar(500),
    [IdUsuario] [int] NULL, -- ID del usuario que realizó la transacción
    [Estado] [varchar](20) NULL,
    [SubTotal] [float] NOT NULL,
    [Iva] [float] NULL, -- Impuesto al valor agregado
    [TasaCambio] [float] NULL,
    [Total] [float] NULL,
	CONSTRAINT [PK__Transacc__6C08ED5375E28D26] PRIMARY KEY CLUSTERED 
	(
		[IdFactura] ASC
	)
)



DROP TABLE facturacion.transaccion_factura_detalle

CREATE TABLE facturacion.FacturaDetalle (
    IdDetalleFactura int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    IdFactura int NOT NULL,
    IdProducto int NOT NULL,
    Cantidad float NOT NULL,
    PrecioVenta float NOT NULL,
    Iva float,
    Total float
);
GO


ALTER TABLE facturacion.FacturaDetalle
ADD CONSTRAINT fk_transaccion_factura_detalle_transaccion_factura
FOREIGN KEY (IdFactura)
REFERENCES facturacion.TransaccionFactura(IdFactura);

DROP TABLE facturacion.catalogo_producto;

CREATE TABLE facturacion.CatalogoProducto (
	IdProducto	 int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Descripcion	varchar(100),
	IdCategoria int,
	IdMarca int
)
GO

drop table facturacion.catalogo_marca;

CREATE TABLE facturacion.CatalogoMarca (
	IdMarca  int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Nombre	nvarchar(150),
	Descripcion nvarchar(150),
	Estado nvarchar(50)	
)
GO

ALTER TABLE facturacion.CatalogoProducto
ADD CONSTRAINT fk_catalogo_productos_catalogo_marcas
FOREIGN KEY (IdMarca)
REFERENCES facturacion.CatalogoMarca(IdMarca);

DROP TABLE facturacion.catalogo_categorias;

CREATE TABLE facturacion.CatalogoCategorias (
	IdCategoria int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Descripcion	varchar(100),
	Estado	nvarchar(50)
)
GO

DROP TABLE facturacion.transaction_lotes;

CREATE TABLE facturacion.Lotes (
	IdTransaccion int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Descripcion	varchar(100),
	Fecha datetime,
	IdUsuario int,
	IdTipo_transaccion int,
	Estado	nvarchar(50)
)
GO

DROP TABLE facturacion.transaction_detalle_lotes;

CREATE TABLE facturacion.DetalleLotes (
	IdDetalle int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	IdLote	int	,
	CantidadAfectada	int	,
	IdTransaccion	int	,
	IdDetalleFactura	int	
)
GO

ALTER TABLE facturacion.DetalleLotes
ADD CONSTRAINT fk_transaccion_lote_transaccion_detalle_lote
FOREIGN KEY (IdTransaccion)
REFERENCES facturacion.Lotes(IdTransaccion);
