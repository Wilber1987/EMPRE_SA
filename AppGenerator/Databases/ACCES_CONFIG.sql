INSERT INTO [security].Security_Permissions
( Descripcion, Estado)
VALUES( N'ADMIN_ACCESS', N'Activo');

INSERT INTO [security].Security_Permissions
( Descripcion, Estado)
VALUES( N'HOME_ACCESS', N'Activo');

INSERT INTO [security].Security_Permissions
(Descripcion, Estado)
VALUES( N'PERFIL_ACCESS', N'Activo');

INSERT INTO [security].Security_Roles
(Descripcion, Estado)
VALUES(N'ADMIN', N'Activo');

INSERT INTO [security].Security_Permissions_Roles 
(Id_Permission , Id_Role)
VALUES(1, 1);

INSERT INTO [security].Security_Users
(Nombres, Estado, Descripcion, Password, Mail, Token, Token_Date, Token_Expiration_Date)
VALUES(N'Admin', N'Activo', N'', N'b???_??????Q3', N'admin@admin.net', NULL, NULL, NULL);

INSERT INTO [security].Security_Users_Roles  
(Id_User , Id_Role)
VALUES(1, 1);
-- pass: zaxscd