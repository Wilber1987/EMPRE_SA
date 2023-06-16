INSERT INTO EMPRE_SA.[security].Security_Permissions
(Descripcion, Estado)
VALUES(N'GESTION_CLIENTES', N'ACTIVO');
INSERT INTO EMPRE_SA.[security].Security_Permissions
(Descripcion, Estado)
VALUES(N'GESTION_PRESTAMOS_Y_EMPEÑOS', N'ACTIVO');
INSERT INTO EMPRE_SA.[security].Security_Permissions
(Descripcion, Estado)
VALUES(N'GESTION_PRESTAMOS_POR_PERSONAS_NATURALES', N'ACTIVO');
INSERT INTO EMPRE_SA.[security].Security_Permissions
(Descripcion, Estado)
VALUES(N'GESTION_SUCURSALES', N'ACTIVO');
INSERT INTO EMPRE_SA.[security].Security_Permissions
(Descripcion, Estado)
VALUES(N'GESTION_MOVIMIENTOS', N'ACTIVO');


ALTER TABLE EMPRE_SA.dbo.Catalogo_Sucursales ADD id_municipio int NULL;

ALTER TABLE EMPRE_SA.[security].Security_Users ADD id_agente int NULL;
ALTER TABLE EMPRE_SA.[security].Security_Users ADD CONSTRAINT Security_Users_FK FOREIGN KEY (id_agente) REFERENCES EMPRE_SA.dbo.Catalogo_Agentes(id_agente);

