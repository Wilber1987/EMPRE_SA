ALTER TABLE EMPRE_SA.dbo.Detail_Prendas DROP CONSTRAINT FK_Detail_Prendas_Transaction_Contratos;

ALTER TABLE EMPRE_SA.dbo.Transaction_Contratos ADD CONSTRAINT Transaction_Contratos_PK PRIMARY KEY (numero_contrato);

ALTER TABLE EMPRE_SA.dbo.Detail_Prendas ADD CONSTRAINT Detail_Prendas_FK FOREIGN KEY (numero_contrato) REFERENCES EMPRE_SA.dbo.Transaction_Contratos(numero_contrato);

ALTER TABLE EMPRE_SA.dbo.Tbl_Cuotas DROP CONSTRAINT FK__Tbl_Cuota__numer__3D2915A8;
ALTER TABLE EMPRE_SA.dbo.Tbl_Cuotas ADD CONSTRAINT Tbl_Cuotas_FK FOREIGN KEY (numero_contrato) REFERENCES EMPRE_SA.dbo.Transaction_Contratos(numero_contrato);

ALTER TABLE EMPRE_SA.administrative_access.Transactional_Configuraciones ADD CONSTRAINT Transactional_Configuraciones_UN UNIQUE (Nombre);

INSERT INTO EMPRE_SA.administrative_access.Transactional_Configuraciones
( Nombre, Descripcion, Valor, Tipo_Configuracion)
VALUES( N'MORA_CONTRATOS_EMP', N' Porsentaje del interes aplicado a la mora(este valor se divide entre 100 al momento de realizar calculos)', N'0.5', N'INTERES_MORA');

ALTER TABLE EMPRE_SA.dbo.Transaction_Contratos ADD CONSTRAINT Transaction_Contratos_FK FOREIGN KEY (codigo_cliente) REFERENCES EMPRE_SA.dbo.Catalogo_Clientes(codigo_cliente);
ALTER TABLE EMPRE_SA.dbo.Transaction_Contratos ALTER COLUMN tipo nvarchar(50) NULL;
ALTER TABLE EMPRE_SA.dbo.Transaction_Contratos DROP COLUMN entregado;
ALTER TABLE EMPRE_SA.dbo.Transaction_Contratos DROP COLUMN interes_actual;
ALTER TABLE EMPRE_SA.dbo.Transaction_Contratos DROP COLUMN id_agente;
