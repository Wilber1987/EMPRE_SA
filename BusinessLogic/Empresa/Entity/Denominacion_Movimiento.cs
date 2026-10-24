using System;
using System.Collections.Generic;
using APPCORE;
using DataBaseModel;

namespace Transactions
{
    /// <summary>
    /// Representa las denominaciones específicas que entraron o salieron en un movimiento
    /// </summary>
    public class Denominacion_Movimiento
    {
        public int? id_denominacion { get; set; }
        public int? cantidad { get; set; }
        public decimal? subtotal { get; set; }
        public DirectionEnum? tipo_operacion { get; set; }  // INGRESO o EGRESO

    } 
   
}