/*****IF EXISTS***/
ALTER TABLE Catalogo_Cuentas
DROP CONSTRAINT catalogo_tipo_transaccion_fk;

ALTER TABLE Catalogo_Cuentas
DROP CONSTRAINT cuentas_sucursales_fk;

ALTER TABLE Transaction_Ingresos_Egresos
DROP CONSTRAINT FK_Transaction_Ingresos_Egresos_Catalogo_Cuentas;

DROP TABLE IF EXISTS Catalogo_Cuentas
GO
/*****IF EXISTS***/

CREATE TABLE [dbo].[Catalogo_Cuentas] (
  [id_cuentas] int  IDENTITY(1,1) PRIMARY KEY,
  [nombre] nvarchar(150) COLLATE Modern_Spanish_CI_AS  NULL,
  [tipo_cuenta] varchar(10) COLLATE Modern_Spanish_CI_AS  NULL,
  [id_sucursal] int  NULL
)
GO
ALTER TABLE [dbo].[Catalogo_Cuentas] ADD CONSTRAINT [cuentas_sucursales_fk] FOREIGN KEY ([id_sucursal]) REFERENCES [Catalogo_Sucursales] ([Id_Sucursal]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

ALTER TABLE [Transaction_Ingresos_Egresos] ADD CONSTRAINT [FK_Transaction_Ingresos_Egresos_Catalogo_Cuentas] FOREIGN KEY ([id_cuenta]) REFERENCES [Catalogo_Cuentas] ([id_cuentas]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

