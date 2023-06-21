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