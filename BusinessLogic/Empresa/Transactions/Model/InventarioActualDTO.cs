using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Business;
using Transactions;

namespace BusinessLogic.Empresa.Transactions.Model
{

    /// <summary>
    /// DTO para reportar ajustes de denominaciones
    /// </summary>
    public class AjusteDenominacionDTO
    {
        public int id_denominacion { get; set; }
        public int diferencia_cantidad { get; set; }  // Positivo = sobrante, Negativo = faltante
        public string motivo { get; set; }
    }

    /// <summary>
    /// DTO para el inventario actual
    /// </summary>
    public class InventarioActualDTO
    {
        public int id_denominacion { get; set; }
        public decimal valor { get; set; }
        public MonedaEnum moneda { get; set; }
        public string tipo { get; set; }
        public int cantidad { get; set; }
        public decimal total { get; set; }
        public DateTime? ultima_actualizacion { get; set; }
        public Denominacion_Catalogo? Denominacion_Catalogo { get;  set; }
    }

}