--clasificacion de cliente
UPDATE
	EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET
	Descripcion = N'EXCELENTE',
	Estado = N'ACTIVO',
	porcentaje = 1
WHERE
	id_clasificacion = 1;

go
UPDATE
	EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET
	Descripcion = N'MUY BUENO',
	Estado = N'ACTIVO',
	porcentaje = 2
WHERE
	id_clasificacion = 2;

go
UPDATE
	EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET
	Descripcion = N'BUENO',
	Estado = N'ACTIVO',
	porcentaje = 3
WHERE
	id_clasificacion = 3;

go
UPDATE
	EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET
	Descripcion = N'REGULAR',
	Estado = N'ACTIVO',
	porcentaje = 4
WHERE
	id_clasificacion = 4;

go
UPDATE
	EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET
	Descripcion = N'DEFICIENTE',
	Estado = N'ACTIVO',
	porcentaje = 5
WHERE
	id_clasificacion = 5;

go
UPDATE
	EMPRE_SA.dbo.Catalogo_Clasificacion_Cliente
SET
	Descripcion = N'NO DEFINIDO',
	Estado = N'ACTIVO',
	porcentaje = 6
WHERE
	id_clasificacion = 6;