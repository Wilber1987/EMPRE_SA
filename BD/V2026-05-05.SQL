EXEC EMPRE_SA.sys.sp_rename N'EMPRE_SA.facturacion.Transaccion_Factura', N'Transaccion_Recibos', 'OBJECT';

update Transaction_Contratos set tipo = 'EMPEÑO' WHERE tipo = 'EMPENO'