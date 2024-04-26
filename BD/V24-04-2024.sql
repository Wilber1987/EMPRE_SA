CREATE TABLE EMPRE_SA.facturacion.Configuracion_Factura (
	Id_Configuracion int IDENTITY(1,1) NOT NULL,
    Descripcion nvarchar(250),
	Auto_Debito int default false,
	Estado NVARCHAR(10) NULL	
);

INSERT INTO EMPRE_SA.facturacion.Configuracion_Factura (Descripcion, Auto_Debito, Estado)
VALUES ('Permite debitar automáticamente el saldo tras facturar automáticamente', 1, 'ACTIVO');
