using System;
using System.Collections.Generic;
using APPCORE;
using Business;
using DataBaseModel;

namespace Transactions
{
    /// <summary>
    /// Representa una denominación específica de billete o moneda
    /// </summary>
    public class Denominacion_Catalogo : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_denominacion { get; set; }
        public decimal? valor { get; set; }  // 10, 20, 50, 100, 200, 500, 1000
        public MonedaEnum? moneda { get; set; }  // CORDOBAS, DOLARES
        public string? tipo { get; set; }    // BILLETE, MONEDA
        public bool? activa { get; set; }
    }
    
    /// <summary>
    /// Registro de denominaciones en un corte de caja específico
    /// </summary>
    public class Denominacion_Caja
    {
        public int? id_corte_caja { get; set; }
        public int? id_denominacion { get; set; }
        public int? cantidad { get; set; }  // Número de billetes/monedas
        public decimal? subtotal { get; set; }  // cantidad * valor
        public Denominacion_Catalogo? Denominacion_Catalogo { get; set; }
    }
}