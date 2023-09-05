delete from EMPRE_SA.administrative_access.Transactional_Configuraciones where Tipo_Configuracion = 'INTERESES'

INSERT INTO
	EMPRE_SA.administrative_access.Transactional_Configuraciones (Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES
(
		N'GASTOS_ADMINISTRATIVOS',
		N' Gastos administrativos',
		N'5',
		N'INTERESES'
	);

go
INSERT INTO
	EMPRE_SA.administrative_access.Transactional_Configuraciones (Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES
(
		N'COMISIONES',
		N' comisiones',
		N'1',
		N'INTERESES'
	);

go
INSERT INTO
	EMPRE_SA.administrative_access.Transactional_Configuraciones (Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES
(
		N'MANTENIMIENTO_VALOR',
		N'mantenimineto de valor de la prenda',
		N'1',
		N'INTERESES'
	);

go
INSERT INTO
	EMPRE_SA.administrative_access.Transactional_Configuraciones (Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES
(
		N'GASTOS_LEGALES',
		N'gastos legales',
		N'1',
		N'INTERESES'
	);

go
INSERT INTO
	EMPRE_SA.administrative_access.Transactional_Configuraciones (Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES
(
		N'GESTIONES_CREDITICIAS',
		N'gestiones crediticias',
		N'1',
		N'INTERESES'
	);

go