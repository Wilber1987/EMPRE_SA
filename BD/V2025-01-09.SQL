ALTER TABLE EMPRE_SA.facturacion.Tbl_Factura ALTER COLUMN Sub_Total float NULL;
ALTER TABLE EMPRE_SA.facturacion.Tbl_Factura DROP COLUMN Serie;
ALTER TABLE EMPRE_SA.facturacion.Tbl_Factura ADD TotalDescuento float NULL;
ALTER TABLE EMPRE_SA.facturacion.Detalle_Factura ADD Monto_Descuento float NULL;
ALTER TABLE EMPRE_SA.facturacion.Tbl_Factura ADD Datos nvarchar(MAX) NULL;

ALTER TABLE EMPRE_SA.facturacion.Tbl_Lotes ADD EtiquetaLote nvarchar(MAX) NULL;

ALTER TABLE EMPRE_SA.facturacion.Tbl_Factura ADD Tasa_Cambio_Venta float NULL;

ALTER TABLE EMPRE_SA.facturacion.Tbl_Factura ADD Moneda nvarchar(250) NULL;


INSERT INTO EMPRE_SA.administrative_access.Transactional_Configuraciones
(Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES(N'RUC', N'Identificador RUC', N'J0910000000XXXXX', N'GENERAL_DATA');

INSERT INTO EMPRE_SA.administrative_access.Transactional_Configuraciones
(Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES(N'CORREO', N'CORREO EMPRESA', N'TEST@TEST.ES', N'GENERAL_DATA');



ALTER TABLE EMPRE_SA.facturacion.Tbl_Factura  ADD Total_Pagado float NULL;
ALTER TABLE EMPRE_SA.facturacion.Tbl_Factura ADD Total_Financiado float NULL;
ALTER TABLE EMPRE_SA.facturacion.Tbl_Factura ADD Datos_Financiamiento nvarchar(MAX) NULL;

ALTER TABLE EMPRE_SA.facturacion.Tbl_Compra ADD Observaciones nvarchar(MAX) NULL;

