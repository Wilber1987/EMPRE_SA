
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Transaccion_Factura' 
               AND COLUMN_NAME = 'numero_contrato')
BEGIN
    ALTER TABLE Transaccion_Factura
    ADD numero_contrato INT;
END;