ALTER TABLE
	EMPRE_SA.dbo.Catalogo_Clientes
ALTER COLUMN
	fecha datetime NULL;

go
	EXEC sp_rename 'Catalogo_Clientes.id_departemento',
	'id_departamento';

go
ALTER TABLE
	Catalogo_Clientes
ADD
	CONSTRAINT users_municipio_fk FOREIGN KEY (id_municipio) REFERENCES Catalogo_Municipio (id_municipio);

go
ALTER TABLE
	Catalogo_Clientes
ADD
	CONSTRAINT users_departamento_fk FOREIGN KEY (id_departamento) REFERENCES catalogo_departamento (id_departamento);

go
alter table
	Catalogo_Clientes
alter column
	correo nvarchar(50);

go
alter table
	Catalogo_Clientes
alter column
	telefono nvarchar(50);

go
alter table
	Catalogo_Clientes
alter column
	direccion nvarchar(500);

go
alter table
	Catalogo_Clientes
alter column
	hora nvarchar(50);

go
alter table
	Catalogo_Clientes
alter column
	estado_civil nvarchar(50);

go
alter table
	Catalogo_Clientes
alter column
	solo_acreedor nvarchar(50);

go
	EXEC sp_rename 'Catalogo_Tipo_Identificacion.Id_Tipo_Identificacion',
	'id_tipo_identificacion';

go
	EXEC sp_rename 'Catalogo_Clientes.id_tipo_Identificacion',
	'id_tipo_identificacion';

go
ALTER TABLE
	EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
ADD
	porcentaje float NULL;

go
ALTER TABLE
	EMPRE_SA.administrative_access.Transactional_Configuraciones
ADD
	Tipo_Configuracion varchar(100) NULL;

go
UPDATE
	EMPRE_SA.administrative_access.Transactional_Configuraciones
SET
	Nombre = N'TITULO',
	Descripcion = N'Encabezado de página',
	Valor = N'EMPRE S.A.',
	Tipo_Configuracion = N'THEME'
WHERE
	Id_Configuracion = 1;

go
UPDATE
	EMPRE_SA.administrative_access.Transactional_Configuraciones
SET
	Nombre = N'SUB_TITULO',
	Descripcion = N'Subtitulo que se muestra en el encabezado',
	Valor = N'Prestamos, empeños y más',
	Tipo_Configuracion = N'THEME'
WHERE
	Id_Configuracion = 2;

go
UPDATE
	EMPRE_SA.administrative_access.Transactional_Configuraciones
SET
	Nombre = N'NOMBRE_EMPRESA',
	Descripcion = N'nombre de la empresa',
	Valor = N'EMPRE S.A.',
	Tipo_Configuracion = N'THEME'
WHERE
	Id_Configuracion = 3;

go
UPDATE
	EMPRE_SA.administrative_access.Transactional_Configuraciones
SET
	Nombre = N'LOGO_PRINCIPAL',
	Descripcion = N'Logo que se muestra en los encabezados',
	Valor = N'logo.png',
	Tipo_Configuracion = N'THEME'
WHERE
	Id_Configuracion = 4;

go
