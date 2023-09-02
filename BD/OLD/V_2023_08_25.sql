ALTER TABLE Catalogo_Cuentas
add saldo float;
go
DROP TABLE [dbo].[Catalogo_Tipo_Cuenta]

go
INSERT INTO [dbo].[Catalogo_Cuentas]( [nombre], [id_sucursal], [id_categoria], [saldo], [tipo_cuenta]) VALUES (N'CAJA 1', 1, 1, 100.000000000000000, N'PROPIA');
INSERT INTO [dbo].[Catalogo_Cuentas]( [nombre], [id_sucursal], [id_categoria], [saldo], [tipo_cuenta]) VALUES (N'CAJA 2', 1, 1, 100.000000000000000, N'PROPIA');
INSERT INTO [dbo].[Catalogo_Cuentas]( [nombre], [id_sucursal], [id_categoria], [saldo], [tipo_cuenta]) VALUES (N'CAJA 3', 1, 1, 100.000000000000000, N'PROPIA');
INSERT INTO [dbo].[Catalogo_Cuentas]( [nombre], [id_sucursal], [id_categoria], [saldo], [tipo_cuenta]) VALUES (N'CUENTAS POR PAGAR', 1, 1, 100.000000000000000, N'PAGO');
INSERT INTO [dbo].[Catalogo_Cuentas]( [nombre], [id_sucursal], [id_categoria], [saldo], [tipo_cuenta]) VALUES (N'ALQUILER', 1, 1, 100.000000000000000, N'PAGO');
INSERT INTO [dbo].[Catalogo_Cuentas]( [nombre], [id_sucursal], [id_categoria], [saldo], [tipo_cuenta]) VALUES (N'SERVICIOS BASICOS', 1, 1, 100.000000000000000, N'PAGO');
INSERT INTO [dbo].[Catalogo_Cuentas]( [nombre], [id_sucursal], [id_categoria], [saldo], [tipo_cuenta]) VALUES (N'PRESTAMOS PERSONAS NATURALES', 1, 1, 100.000000000000000, N'EXTERNA');
INSERT INTO [dbo].[Catalogo_Cuentas]( [nombre], [id_sucursal], [id_categoria], [saldo], [tipo_cuenta]) VALUES (N'PAGOS SOCIOS', 1, 1, 100.000000000000000, N'EXTERNA');
INSERT INTO [dbo].[Catalogo_Cuentas]( [nombre], [id_sucursal], [id_categoria], [saldo], [tipo_cuenta]) VALUES (N'DIFERENCIA CAMBIARIA', 1, 1, 100.000000000000000, N'EXTERNA');

go

CREATE TABLE Transaction_Movimiento(
    id_movimiento int  IDENTITY(1,1) PRIMARY KEY,
    descripcion nvarchar(250) COLLATE Modern_Spanish_CI_AS  NULL,
    concepto nvarchar(250) COLLATE Modern_Spanish_CI_AS  NULL,        
    id_usuario_crea int,
    fecha datetime DEFAULT GETDATE(),
	tipo nvarchar(50)
);
go

CREATE TABLE Detail_Movimiento(
    id_detalle int  IDENTITY(1,1) PRIMARY KEY,
    id_movimiento int,    
    id_cuenta int,    
    debito float(18,2),
    credito float(18,2),
    tasa_cambio float(18,2),
    fecha datetime DEFAULT GETDATE(), 
    FOREIGN KEY (id_cuenta) REFERENCES Catalogo_Cuentas(id_cuentas)    
);