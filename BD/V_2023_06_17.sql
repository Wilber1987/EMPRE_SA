IF OBJECT_ID(N'dbo.Catalogo_Categoria', N'U') IS NULL
begin 
    CREATE TABLE [dbo].[Catalogo_Categoria] (
        [id_categoria] int  IDENTITY(1,1) PRIMARY KEY,
        [tipo] nvarchar(50) COLLATE Modern_Spanish_CI_AS  NULL,
        [descripcion] varchar(50) COLLATE Modern_Spanish_CI_AS  NULL,
        [plazo_limite] int not NULL,
        [prioridad] int NULL unique
    )       
end
go