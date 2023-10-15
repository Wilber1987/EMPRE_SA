EXEC sp_rename 'Transaction_Contratos', 'Transaction_Contratos_old';



DROP table Transaction_Contratos;


CREATE TABLE dbo.Transaction_Contratos(
	numero_contrato int IDENTITY(1,1) NOT NULL,
	fecha_contrato datetime NULL,
	fecha_cancelar datetime NULL,
	monto float NULL,
	interes float NULL,
	mora float NULL,
	estado nvarchar(50) NULL,
	fecha_vencimiento datetime NULL,
	codigo_cliente int NULL,
	saldo float NULL,
	--dias_mora int NULL,
	--saldo_mora float NULL,
	--fecha_baja datetime NULL,
	abonos float NULL,
	--ultima_visita datetime NULL,
	tipo int NULL,
	entregado nvarchar(50) NULL,
	interes_actual float NULL,
	observaciones nvarchar(600) NULL,
	iva float NULL,
	--margen float NULL,
	--interesl float NULL,
	--moral float NULL,
	descuento float NULL,
	--util float NULL,
	--taza_interes_cargos float NULL,
	--taza_mora float NULL,
	--fecha_mora datetime NULL,
	--fecha_interes datetime NULL,
	--taza_gestion_crediticia float NULL,
	--Id_User_OLD int NULL,
	taza_cambio float NULL,
    taza_cambio_compra float NULL,
	id_agente int NULL,
	--dkm float NULL,
	--gasolinamonto float NULL,
	--valorcad float NULL,
	plazo int NULL,
	cuotafija float NULL,
	--montocuotaatrazadas float NULL,
	--mes_pagado datetime NULL,
	tasa_hoy float NULL,
	--numero_protocolo int NULL,
	--valor_dolar float NULL,
	--parciales float NULL,
	--mora_parcial float NULL,
	--interes_parcial float NULL,
	motivo_anulacion char(100) NULL,
	--idcatemp int NULL,
	--cuota_fija_inicial float NULL,
	--fecha_cancelar_inicial datetime NULL,
	--plazo_inicial int NULL,
	--dias_para_baja int NULL,
    valoracion_compra_dolares float,
    valoracion_compra_cordobas float,
    valoracion_empeño_cordobas float,
    valoracion_empeño_dolares float,
    tasas_interes float,
    gestion_crediticia float,
    cuotafija_dolares float,
    fecha DateTime,
    total_pagar_cordobas float,
    total_pagar_dolares float,
    interes_dolares float,

	Id_User int NULL,
)
GO

ALTER TABLE [dbo].[Transaction_Contratos]  WITH CHECK ADD  CONSTRAINT [FK_Transaction_Contratos_Catalogo_Agentes] FOREIGN KEY([id_agente])
REFERENCES [dbo].[Catalogo_Agentes] ([id_agente])
GO

ALTER TABLE [dbo].[Transaction_Contratos] CHECK CONSTRAINT [FK_Transaction_Contratos_Catalogo_Agentes]
GO

ALTER TABLE [dbo].[Transaction_Contratos]  WITH CHECK ADD  CONSTRAINT [FK_Transaction_Contratos_Catalogo_Clientes] FOREIGN KEY([codigo_cliente])
REFERENCES [dbo].[Catalogo_Clientes] ([codigo_cliente])
GO

ALTER TABLE [dbo].[Transaction_Contratos] CHECK CONSTRAINT [FK_Transaction_Contratos_Catalogo_Clientes]
GO

ALTER TABLE [dbo].[Transaction_Contratos]  WITH CHECK ADD  CONSTRAINT [FK_Transaction_Contratos_Security_Users] FOREIGN KEY([Id_User])
REFERENCES [security].[Security_Users] ([Id_User])
GO

ALTER TABLE [dbo].[Transaction_Contratos] CHECK CONSTRAINT [FK_Transaction_Contratos_Security_Users]
GO


