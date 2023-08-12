-- Renombrar la columna
EXEC sp_rename 'Catalogo_Cuentas.tipo_cuenta', 'id_tipo_cuenta', 'COLUMN';

-- Cambiar el tipo de datos
ALTER TABLE Catalogo_Cuentas
ALTER COLUMN id_tipo_cuenta INT;



CREATE TABLE [dbo].[Catalogo_Tipo_Cuenta] (
  [id_tipo_cuenta] int  IDENTITY(1,1) PRIMARY KEY,
  [nombre] nvarchar(150) COLLATE Modern_Spanish_CI_AS  NULL,
  [descripcion] nvarchar(150) COLLATE Modern_Spanish_CI_AS  NULL,
  [estado] varchar(10) COLLATE Modern_Spanish_CI_AS  NULL,
  
)
GO
ALTER TABLE [dbo].[Catalogo_Cuentas] ADD CONSTRAINT [cuentas_sucursales_fk] FOREIGN KEY ([id_sucursal]) REFERENCES [Catalogo_Sucursales] ([Id_Sucursal]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

CREATE TABLE Permisos_Cuentas (
    id_permiso INT PRIMARY KEY,
    id_cuenta_origen INT,
    id_cuenta_destino INT,
    permite_debito BIT,
    permite_credito BIT,
    FOREIGN KEY (id_cuenta_origen) REFERENCES Catalogo_Cuentas(id_tipo_cuenta),
    FOREIGN KEY (id_cuenta_destino) REFERENCES Catalogo_Cuentas(id_tipo_cuenta)
);