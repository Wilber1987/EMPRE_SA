IF OBJECT_ID(N'dbo.Catalogo_Categoria', N'U') IS NULL begin CREATE TABLE [dbo].[Catalogo_Categoria] (
    [id_categoria] int IDENTITY(1, 1) PRIMARY KEY,
    [tipo] nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
    [descripcion] varchar(50) COLLATE Modern_Spanish_CI_AS NULL,
    [plazo_limite] int not NULL,
    [prioridad] int NULL unique
)
end
go
INSERT INTO
    EMPRE_SA.dbo.Catalogo_Categoria (
        tipo,
        descripcion,
        plazo_limite,
        prioridad
    )
VALUES
(N'Electrónico', N'electronico', 3, 2);

INSERT INTO
    EMPRE_SA.dbo.Catalogo_Categoria (
        tipo,
        descripcion,
        plazo_limite,
        prioridad
    )
VALUES
(N'Vehículos', N'vehiculos', 12, 1);

INSERT INTO
    EMPRE_SA.dbo.Catalogo_Categoria (
        tipo,
        descripcion,
        plazo_limite,
        prioridad
    )
VALUES
(N'Otros', N'otros', 6, 3);

go
ALTER TABLE
    EMPRE_SA.dbo.Transactional_Valoracion
ADD
    id_categoria int NULL;

go
ALTER TABLE
    EMPRE_SA.dbo.Transactional_Valoracion
ADD
    CONSTRAINT Transactional_Valoracion_categoria_FK FOREIGN KEY (id_categoria) REFERENCES EMPRE_SA.dbo.Catalogo_Categoria(id_categoria);
go

ALTER TABLE
    EMPRE_SA.dbo.Detail_Prendas
ADD
    id_categoria int NULL;

go
ALTER TABLE
    EMPRE_SA.dbo.Detail_Prendas
ADD
    CONSTRAINT Detail_Prendas_categoria_FK FOREIGN KEY (id_categoria) REFERENCES EMPRE_SA.dbo.Catalogo_Categoria(id_categoria);