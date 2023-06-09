
alter table Catalogo_Cuentas add  tipo_transaccion varchar(50)
go

alter table Catalogo_Cuentas add  cuenta_propia varchar(10)
go

alter table Catalogo_Cuentas add  id_sucursal int
go

ALTER TABLE Catalogo_Cuentas ADD CONSTRAINT cuentas_sucursales_fk FOREIGN KEY (id_sucursal) REFERENCES Catalogo_Sucursales (Id_Sucursal)
go