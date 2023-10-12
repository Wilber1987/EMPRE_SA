ALTER TABLE EMPRE_SA.dbo.Catalogo_Cuentas
ADD saldo_dolares float NULL;

ALTER TABLE EMPRE_SA.dbo.Detail_Movimiento
ADD debito_dolares float NULL;
ALTER TABLE EMPRE_SA.dbo.Detail_Movimiento
ADD credito_dolares float NULL;


ALTER TABLE EMPRE_SA.dbo.Detail_Movimiento
ADD monto_inicial float NULL;
ALTER TABLE EMPRE_SA.dbo.Detail_Movimiento
ADD monto_final float NULL;


ALTER TABLE EMPRE_SA.dbo.Detail_Movimiento
ADD monto_inicial_dolares float NULL;
ALTER TABLE EMPRE_SA.dbo.Detail_Movimiento
ADD monto_final_dolares float NULL;