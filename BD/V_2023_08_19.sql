


ALTER TABLE Catalogo_Cuentas 
ADD id_categoria int  NULL;


CREATE TABLE Categoria_Cuentas (
    id_categoria int  IDENTITY(1,1) PRIMARY KEY,
    descripcion nvarchar(150) COLLATE Modern_Spanish_CI_AS  NULL
);

GO
ALTER TABLE [dbo].[Catalogo_Cuentas] ADD CONSTRAINT [cuentas_categoria_fk] FOREIGN KEY ([id_categoria]) REFERENCES [Categoria_Cuentas] ([id_categoria]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

CREATE TABLE Categoria_Cuentas (
    id_categoria int  IDENTITY(1,1) PRIMARY KEY,
    descripcion nvarchar(150) COLLATE Modern_Spanish_CI_AS  NULL
);



CREATE TABLE Movimientos_Cuentas(
    id_movimiento int  IDENTITY(1,1) PRIMARY KEY,
    descripcion nvarchar(250) COLLATE Modern_Spanish_CI_AS  NULL,
    concepto nvarchar(250) COLLATE Modern_Spanish_CI_AS  NULL,
    id_cuenta_origen int not null,
    id_cuenta_destino int not null,
    monto float,
    tasa_cambio float,
    total float,
    id_usuario_crea int,
    fecha datetime DEFAULT GETDATE(),
    FOREIGN KEY (id_cuenta_origen) REFERENCES Catalogo_Cuentas(id_cuentas),
    FOREIGN KEY (id_cuenta_destino) REFERENCES Catalogo_Cuentas(id_cuentas)
);