EXEC EMPRE_SA.sys.sp_rename N'EMPRE_SA.dbo.Detail_Prendas.pprenda' , N'monto_aprobado_cordobas', 'COLUMN';
ALTER TABLE EMPRE_SA.dbo.Detail_Prendas ADD monto_aprobado_dolares float NULL;





INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas
(descripcion)
VALUES(N'EMPEÑOS');
INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas
(descripcion)
VALUES(N'PRESTAMOS');


INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'EMPEÑO DE ARTICULOS', N'PAGO', 1, 9,0, 0, 1, 1);

