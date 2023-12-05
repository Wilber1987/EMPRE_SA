ALTER TABLE Transaction_Movimiento
ADD is_transaction BIT DEFAULT 0;

ALTER TABLE EMPRE_SA.dbo.Catalogo_Categoria 
ADD isEditable bit DEFAULT 1 NULL;


ALTER TABLE EMPRE_SA.dbo.Catalogo_Categoria DROP CONSTRAINT UQ__Catalogo__146C3B26908A525B;
ALTER TABLE EMPRE_SA.dbo.Catalogo_Categoria ADD CONSTRAINT Catalogo_Categoria_UN UNIQUE (tipo);

-- DROP TABLE Cat_Paises;

CREATE TABLE security.Cat_Paises (
	Id_Pais int IDENTITY(1,1) NOT NULL,
	Estado nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	Descripcion nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	CONSTRAINT PK_Cat_Nacionalidad PRIMARY KEY (Id_Pais)
);
-- Tbl_Profile definition

-- Drop table

-- DROP TABLE Tbl_Profile;

CREATE TABLE security.Tbl_Profile (
	Id_Perfil int IDENTITY(1,1) NOT NULL,
	Nombres nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	Apellidos nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	FechaNac date NULL,
	IdUser int NULL,
	Sexo nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	Foto nvarchar(MAX) COLLATE Modern_Spanish_CI_AS NULL,
	DNI nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	Correo_institucional nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	Id_Pais_Origen int NULL,
	Estado nvarchar(50) COLLATE Modern_Spanish_CI_AS NULL,
	CONSTRAINT PK_Tbl_InvestigatorProfile PRIMARY KEY (Id_Perfil)
);


-- Tbl_Profile foreign keys

ALTER TABLE Tbl_Profile ADD CONSTRAINT FK_Tbl_InvestigatorProfile_Cat_Nacionalidad FOREIGN KEY (Id_Pais_Origen) REFERENCES security.Cat_Paises(Id_Pais);
ALTER TABLE Tbl_Profile ADD CONSTRAINT FK_Tbl_InvestigatorProfile_Security_Users FOREIGN KEY (IdUser) REFERENCES [security].Security_Users(Id_User);



ALTER TABLE EMPRE_SA.dbo.Transaction_Contratos ADD reestructurado int NULL;
EXEC EMPRE_SA.sys.sp_addextendedproperty 'MS_Description', N'numero de reestructuraciones', 'schema', N'dbo', 'table', N'Transaction_Contratos', 'column', N'reestructurado';
