ALTER TABLE
    dbo.Detail_Prendas
ADD
    id_valoracion int NULL;

go
ALTER TABLE
    dbo.Detail_Prendas
ADD
    CONSTRAINT Detail_Prendas_valoracion_FK 
    FOREIGN KEY (id_valoracion) 
    REFERENCES dbo.Transactional_Valoracion(id_valoracion);

    -- dbo.Catalogo_Clasificacion_Cliente definition

-- Drop table

-- DROP TABLE dbo.Catalogo_Clasificacion_Cliente;

CREATE TABLE dbo.Catalogo_Clasificacion_Interes (
	id_clasificacion_interes int IDENTITY(1,1) NOT NULL,
	Descripcion nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	Estado nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	porcentaje float NULL,
	CONSTRAINT PK_Catalogo_Clasificacion_Cliente PRIMARY KEY (id_clasificacion_interes)
);

INSERT INTO dbo.Catalogo_Clasificacion_Interes
(Descripcion, Estado, porcentaje)
VALUES(N'RANGO 1', N'ACTIVO', 1.0);
INSERT INTO dbo.Catalogo_Clasificacion_Interes
(Descripcion, Estado, porcentaje)
VALUES(N'RANGO 2', N'ACTIVO', 2.0);
INSERT INTO dbo.Catalogo_Clasificacion_Interes
(Descripcion, Estado, porcentaje)
VALUES(N'RANGO 3', N'ACTIVO', 3.0);
INSERT INTO dbo.Catalogo_Clasificacion_Interes
(Descripcion, Estado, porcentaje)
VALUES(N'RANGO 4', N'ACTIVO', 4.0);
INSERT INTO dbo.Catalogo_Clasificacion_Interes
(Descripcion, Estado, porcentaje)
VALUES(N'RANGO 5', N'ACTIVO', 5.0);
INSERT INTO dbo.Catalogo_Clasificacion_Interes
(Descripcion, Estado, porcentaje)
VALUES(N'RANGO 6', N'ACTIVO', 6.0);

ALTER TABLE
    dbo.Catalogo_Clientes
ADD
    id_clasificacion_interes int NULL;

ALTER TABLE dbo.Catalogo_Clientes ADD CONSTRAINT 
FK_Catalogo_Clientes_Catalogo_Clasificacion_Interes 
FOREIGN KEY (id_clasificacion_interes) REFERENCES dbo.Catalogo_Clasificacion_Interes(id_clasificacion_interes);

go

update Catalogo_Clientes set id_clasificacion_interes = id_clasificacion 
go

ALTER TABLE EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente DROP COLUMN porcentaje;

