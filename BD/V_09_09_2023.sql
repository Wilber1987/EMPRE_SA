
CREATE TABLE Recibos (
    /***datos del recibo**/
    id_recibo int  IDENTITY(1,1) PRIMARY KEY,
    consecutivo int,
    temporal bit,
    numero_contrato INT,
    monto float,
    saldo_actual_cordobas float,
    saldo_actual_dolares float,
    plazo float,
    interes_cargos float,
    tasa_cambio float,
    tasa_cambio_compra FLOAT,
    interes_demas_cargos_pagar_cordobas float,
    interes_demas_cargos_pagar_dolares float,
    abono_capital_cordobas float,
    abono_capital_dolares float,
    cuota_pagar_cordobas float,
    cuota_pagar_dolares float,
    mora_cordobas float,
    mora_dolares float,
    mora_interes_cordobas float,
    mora_interes_dolares float,
    total_cordobas float,
    total_dolares float,
    total_parciales float,
    fecha_roc date,
    paga_cordobas float,
    paga_dolares float,
    solo_abono bit,
    cancelar bit,
    /***END DATOS DEL RECIBO****/    
    /****proyeccion de pago****/
    
    /****END proyeccion de pago****/
    /****DETALLE de pago****/    
    FOREIGN KEY (numero_contrato) REFERENCES Transaction_Contratos(numero_contrato)
);