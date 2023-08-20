


ALTER TABLE Catalogo_Cuentas 
ADD id_categoria int  NULL;


CREATE TABLE Categoria_Cuentas (
    id_categoria int  IDENTITY(1,1) PRIMARY KEY,
    descripcion nvarchar(150) COLLATE Modern_Spanish_CI_AS  NULL
);

GO
ALTER TABLE [dbo].[Catalogo_Cuentas] ADD CONSTRAINT [cuentas_categoria_fk] FOREIGN KEY ([id_categoria]) REFERENCES [Categoria_Cuentas] ([id_categoria]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

ALTER TABLE Permisos_Cuentas 
ADD id_categoria int  NULL;