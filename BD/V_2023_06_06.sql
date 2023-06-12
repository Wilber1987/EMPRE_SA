

alter table Catalogo_Cuentas add  id_tipo_transaccion int
go
ALTER TABLE Catalogo_Cuentas ADD CONSTRAINT catalogo_tipo_transaccion_fk FOREIGN KEY (id_tipo_transaccion) REFERENCES Catalogo_Tipo_Transaccion (id_tipo_transaccion)
go

alter table Catalogo_Cuentas add  tipo_cuenta varchar(15)
-- EXEC sp_rename 'Catalogo_Cuentas.cuenta_propia', 'tipo_cuenta'; si ya tenes ejecutado el script
go

alter table Catalogo_Cuentas add  id_sucursal int
go

ALTER TABLE Catalogo_Cuentas ADD CONSTRAINT cuentas_sucursales_fk FOREIGN KEY (id_sucursal) REFERENCES Catalogo_Sucursales (Id_Sucursal)
go