UPDATE EMPRE_SA.dbo.Categoria_Cuentas
SET descripcion=N'CAJA 1'
WHERE id_categoria=1;
-- INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas(descripcion) VALUES(N'CAJA 1');
INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas
(descripcion)
VALUES(N'CAJA 2');
INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas
(descripcion)
VALUES(N'CAJA CHICA');
INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas
(descripcion)
VALUES(N'CAJA GENERAL');
INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas
(descripcion)
VALUES(N'BANCO');
INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas
(descripcion)
VALUES(N'FACTURAS_CONTRATOS');
INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas
(descripcion)
VALUES(N'FACTURAS_VENTAS');
INSERT INTO EMPRE_SA.dbo.Categoria_Cuentas
(descripcion)
VALUES(N'OBLIGACIONES');





ALTER TABLE EMPRE_SA.dbo.Detail_Prendas DROP COLUMN uso;

ALTER TABLE EMPRE_SA.dbo.Detail_Prendas DROP COLUMN servicio;

ALTER TABLE EMPRE_SA.dbo.Detail_Prendas_Vehiculos add  uso nvarchar(50) null;

ALTER TABLE EMPRE_SA.dbo.Detail_Prendas_Vehiculos add  servicio  nvarchar(50) null;





-- configuracion base
INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'CAJA 1', N'PROPIA', 1, 1, NULL, NULL, NULL, NULL);
INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'CAJA 2', N'PROPIA', 1, 2, NULL, NULL, NULL, NULL);
INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'CAJA CHICA', N'PROPIA', 1, 3,NULL, NULL, NULL, NULL);
INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'CAJA GENERAL', N'PROPIA', 1, 4, NULL, NULL, NULL, NULL);
INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'BANCO', N'PROPIA', 1, 5, 100.0, NULL, NULL, NULL);
INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'PAGOS DE FACTURAS', N'EXTERNA', 1, 6,NULL, NULL, NULL, NULL);
INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'PAGOS DE VENTAS', N'EXTERNA', 1, 7,NULL, NULL, NULL, NULL);
INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'PAGOS DE SERVICIOS VARIOS', N'PAGO', 1, 8,NULL, NULL, NULL, NULL);
INSERT INTO EMPRE_SA.dbo.Catalogo_Cuentas
(nombre, tipo_cuenta, id_sucursal, id_categoria, saldo, saldo_dolares, permite_dolares, permite_cordobas)
VALUES(N'ALQUILERES', N'PAGO', 1, 8, NULL, NULL, NULL, NULL);
