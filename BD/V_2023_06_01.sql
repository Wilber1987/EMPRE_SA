ALTER TABLE EMPRE_SA.dbo.Catalogo_Clientes ALTER COLUMN fecha datetime NULL;

EXEC sp_rename 'Catalogo_Clientes.id_departemento', 'id_departamento';


ALTER TABLE Catalogo_Clientes ADD CONSTRAINT users_municipio_fk FOREIGN KEY (id_municipio) REFERENCES Catalogo_Municipio (id_municipio);
ALTER TABLE Catalogo_Clientes ADD CONSTRAINT users_departamento_fk FOREIGN KEY (id_departamento) REFERENCES catalogo_departamento (id_departamento);


alter table Catalogo_Clientes 
alter column correo nvarchar(50);
alter table Catalogo_Clientes 
alter column telefono nvarchar(50);
alter table Catalogo_Clientes 
alter column direccion nvarchar(500);
alter table Catalogo_Clientes 
alter column hora nvarchar(50);
alter table Catalogo_Clientes 
alter column estado_civil nvarchar(50);
alter table Catalogo_Clientes 
alter column solo_acreedor nvarchar(50);

	EXEC sp_rename 'Catalogo_Tipo_Identificacion.Id_Tipo_Identificacion', 'id_tipo_identificacion';
	EXEC sp_rename 'Catalogo_Clientes.id_tipo_Identificacion', 'id_tipo_identificacion';
ALTER TABLE EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente ADD porcentaje float NULL;
UPDATE EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET Descripcion=N'EXECELENTE', Estado=N'ACTIVO', porcentaje=1
WHERE id_clasificacion=1;
UPDATE EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET Descripcion=N'MUY BUENO', Estado=N'ACTIVO', porcentaje=2
WHERE id_clasificacion=2;
UPDATE EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET Descripcion=N'BUENO', Estado=N'ACTIVO', porcentaje=3
WHERE id_clasificacion=3;
UPDATE EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET Descripcion=N'REGULAR', Estado=N'ACTIVO', porcentaje=4
WHERE id_clasificacion=4;
UPDATE EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET Descripcion=N'DEFICIENTE', Estado=N'ACTIVO', porcentaje=5
WHERE id_clasificacion=5;
UPDATE EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET Descripcion=N'NO DEFINIDO', Estado=N'ACTIVO', porcentaje=6
WHERE id_clasificacion=6;


ALTER TABLE EMPRE_SA.administrative_access.Transactional_Configuraciones ADD Tipo_Configuracion varchar(100) NULL;

UPDATE EMPRE_SA.administrative_access.Transactional_Configuraciones
SET Nombre=N'TITULO', Descripcion=N'Encabezado de página', Valor=N'EMPRE S.A.', Tipo_Configuracion=N'THEME'
WHERE Id_Configuracion=1;
UPDATE EMPRE_SA.administrative_access.Transactional_Configuraciones
SET Nombre=N'SUB_TITULO', Descripcion=N'Subtitulo que se muestra en el encabezado', Valor=N'Prestamos, empeños y más', Tipo_Configuracion=N'THEME'
WHERE Id_Configuracion=2;
UPDATE EMPRE_SA.administrative_access.Transactional_Configuraciones
SET Nombre=N'NOMBRE_EMPRESA', Descripcion=N'nombre de la empresa', Valor=N'EMPRE S.A.', Tipo_Configuracion=N'THEME'
WHERE Id_Configuracion=3;
UPDATE EMPRE_SA.administrative_access.Transactional_Configuraciones
SET Nombre=N'LOGO_PRINCIPAL', Descripcion=N'Logo que se muestra en los encabezados', Valor=N'logo.png', Tipo_Configuracion=N'THEME'
WHERE Id_Configuracion=4;

INSERT INTO EMPRE_SA.administrative_access.Transactional_Configuraciones
(Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES( N'GASTOS_ADMINISTRATIVOS', N' Gastos administrativos', N'5', N'INTERESES');
INSERT INTO EMPRE_SA.administrative_access.Transactional_Configuraciones
(Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES( N'COMISIONES', N' gastos legales', N'1', N'INTERESES');
INSERT INTO EMPRE_SA.administrative_access.Transactional_Configuraciones
(Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES( N'MANTENIMIENTO_VALOR', N'Comisiones', N'1', N'INTERESES');
INSERT INTO EMPRE_SA.administrative_access.Transactional_Configuraciones
(Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES( N'GASTOS_LEGALES', N'mantenimiento al valor de   la prenda', N'1', N'INTERESES');
