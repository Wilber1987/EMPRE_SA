

ALTER TABLE EMPRE_SA.dbo.Catalogo_Cuentas
ADD permite_dolares bit NULL;


ALTER TABLE EMPRE_SA.dbo.Catalogo_Cuentas
ADD permite_cordobas bit NULL;



ALTER TABLE EMPRE_SA.dbo.Detail_Movimiento
ADD moneda varchar(10);


ALTER TABLE EMPRE_SA.dbo.Detail_Movimiento
ADD tasa_cambio_compra float;


ALTER TABLE EMPRE_SA.dbo.Transaction_Movimiento
ADD moneda varchar(10);


ALTER TABLE EMPRE_SA.dbo.Transaction_Movimiento
ADD tasa_cambio float;


ALTER TABLE EMPRE_SA.dbo.Transaction_Movimiento
ADD tasa_cambio_compra float;


ALTER TABLE EMPRE_SA.dbo.Transaction_Movimiento
ADD correo_enviado bit null;