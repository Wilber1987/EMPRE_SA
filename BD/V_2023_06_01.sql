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