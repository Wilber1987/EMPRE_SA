EXEC EMPRE_SA.sys.sp_rename N'EMPRE_SA.dbo.Detail_Prendas.pprenda' , N'monto_aprobado_cordobas', 'COLUMN';
ALTER TABLE EMPRE_SA.dbo.Detail_Prendas ADD monto_aprobado_dolares float NULL;
