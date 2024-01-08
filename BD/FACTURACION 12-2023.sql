CREATE SCHEMA [facturacion]
GO


ALTER SCHEMA facturacion TRANSFER dbo.Transaccion_Factura;


ALTER TABLE facturacion.Transaccion_Factura
ADD 
	No_Factura nvarchar(50) not null default '0',
	SubTotal float default 0 not null,
	Iva float default 0
GO


CREATE TABLE facturacion.Transaccion_Factura_Detalle(
	Id_Detalle_Factura int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Id_Factura int not null,
	Id_Producto int not NULL,
	Cantidad float not null,
	Precio_Venta float not null,
	Iva float,
	Total float	
)
GO

ALTER TABLE facturacion.Transaccion_Factura_Detalle
ADD CONSTRAINT FK_Transaccion_Factura_Detalle_Transaccion_Factura
FOREIGN KEY (Id_Factura)
REFERENCES facturacion.Transaccion_Factura(Id_Factura);




CREATE TABLE facturacion.Catalogo_Producto(
	Id_Producto	 int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Descripcion	varchar(100),
	Id_Categoria int,
	Id_Marca int
)
go




CREATE TABLE facturacion.Catalogo_Marca(
	Id_Marca  int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Nombre	nvarchar(150),
	Descripcion nvarchar(150),
	Estado nvarchar(50)	
)
go



ALTER TABLE facturacion.Catalogo_Producto
ADD CONSTRAINT FK_Transaccion_Catalogo_Productos_Catalogo_Marcas
FOREIGN KEY (Id_Marca)
REFERENCES facturacion.Catalogo_Marca(Id_Marca);



CREATE TABLE facturacion.Catalogo_Categorias(
	Id_Categoria int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Descripcion	varchar(100),
	Estado	nvarchar(50)
)
go


CREATE TABLE facturacion.Transaction_Lotes(
	Id_Transaccion int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Descripcion	varchar(100),
	Fecha datetime,
	Id_Usuario int,
	Id_Tipo_Transaccion int,
	Estado	nvarchar(50)
)
go

CREATE TABLE facturacion.Transaction_Detalle_Lotes(
	Id_Detalle_Transaccion int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	Id_Lote	int	,
	Cantidad_Afectada	int	,
	Id_Transaccion	int	,
	Id_Detalle_Factura	int	
)
go

