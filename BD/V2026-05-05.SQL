EXEC EMPRE_SA.sys.sp_rename N'EMPRE_SA.facturacion.Transaccion_Factura', N'Transaccion_Recibos', 'OBJECT';

update Transaction_Contratos set tipo = 'EMPEÑO' WHERE tipo = 'EMPENO'

ALTER TABLE EMPRE_SA.dbo.Catalogo_Cuentas ADD UpdateAt datetime NULL;


ALTER TABLE EMPRE_SA.transactions.Orden_Movimiento ADD Id_OrderRelated int NULL;

ALTER TABLE EMPRE_SA.facturacion.Cat_Producto ADD Modelo nvarchar(255) NULL;

ALTER TABLE EMPRE_SA.facturacion.Detalle_Compra ADD Datos_Producto_Lote nvarchar(MAX) NULL;
