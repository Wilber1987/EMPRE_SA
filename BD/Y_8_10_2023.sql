drop table Transaccion_Factura;
go
CREATE TABLE Transaccion_Factura (
  id_factura int  IDENTITY(1,1) PRIMARY KEY,
  tipo nvarchar(150) COLLATE Modern_Spanish_CI_AS  NULL,
  concepto NVARCHAR(300),
  tasa_cambio float,  
  total float,  
  id_cliente int,
  id_sucursal int  NULL,
  fecha datetime,
  id_usuario int,
  Factura_contrato nvarchar(max)
)
GO
ALTER TABLE dbo.Catalogo_Cuentas ADD CONSTRAINT facturas_sucursales_fk FOREIGN KEY (id_sucursal) REFERENCES Catalogo_Sucursales (Id_Sucursal) ON DELETE NO ACTION ON UPDATE NO ACTION
GO


CREATE TABLE Detalle_Factura_Recibo (
  id int  IDENTITY(1,1) PRIMARY KEY,
  id_factura int,
  id_cuota int,
  total_cuota float,
  monto_pagado  FLOAT,
  capital_restante float,
  concepto NVARCHAR(200),  
  tasa_cambio float
)
GO
ALTER TABLE dbo.Detalle_Factura_Recibo ADD CONSTRAINT detalle_factura_recibo_fk FOREIGN KEY (id_factura) REFERENCES Transaccion_Factura (id_factura) ON DELETE NO ACTION ON UPDATE NO ACTION
go
ALTER TABLE dbo.Detalle_Factura_Recibo ADD CONSTRAINT detalle_factura_cuota_fk FOREIGN KEY (id_cuota) REFERENCES Tbl_Cuotas (id_cuota) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
