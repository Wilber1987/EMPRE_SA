/****tabla para almacenar los datos laborales del cliente, en un inicio es una relacion de 1 a 1 pero se deja abierto a n a n**/
CREATE TABLE Condicion_Laboral_Cliente
(
	id int IDENTITY(1,1) PRIMARY KEY,
	id_cliente int,
    fecha_ingreso date,
    ocupacion_cargo varchar(255),
    ingresos_mensuales float,
    direccion varchar(600),
	id_municipio int,
    id_departamento int,	
	CONSTRAINT FK_Laboral_Clientes FOREIGN KEY (id_cliente)
        REFERENCES dbo.Catalogo_Clientes (codigo_cliente),
	CONSTRAINT FK_Laboral_Municipios FOREIGN KEY (id_municipio)
        REFERENCES dbo.Catalogo_Municipio (id_municipio),
	CONSTRAINT FK_Laboral_Departamentos FOREIGN KEY (id_departamento)
        REFERENCES dbo.Catalogo_Departamento (id_departamento)
)
