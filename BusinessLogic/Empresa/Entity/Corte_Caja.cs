using System;
using System.Collections.Generic;
using System.Linq;
using APPCORE;
using DataBaseModel;

namespace Transactions
{
    public enum EstadoCorteCaja
    {
        ABIERTO,
        CERRADO,
        ARQUEADO  // Cuando se hace conteo físico
    }

    public class Corte_Caja : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_corte_caja { get; set; }
        public int? id_cuenta { get; set; }  // La cuenta tipo PROPIA que es la caja
        public int? id_usuario_apertura { get; set; }
        public int? id_usuario_cierre { get; set; }
        public DateTime? fecha_apertura { get; set; }
        public DateTime? fecha_cierre { get; set; }
        public EstadoCorteCaja? estado { get; set; }  // EstadoCorteCaja
        public int? id_sucursal { get; set; }

        // Montos al inicio
        public decimal? monto_inicial_cordobas { get; set; }
        public decimal? monto_inicial_dolares { get; set; }

        // Montos al cierre (esperados según sistema)
        public decimal? monto_esperado_cordobas { get; set; }
        public decimal? monto_esperado_dolares { get; set; }

        // Montos al cierre (conteo físico)
        public decimal? monto_fisico_cordobas { get; set; }
        public decimal? monto_fisico_dolares { get; set; }

        // Diferencias (sobrante/faltante)
        public decimal? diferencia_cordobas { get; set; }
        public decimal? diferencia_dolares { get; set; }

        public string? observaciones_apertura { get; set; }
        public string? observaciones_cierre { get; set; }

        [ManyToOne(TableName = "Catalogo_Cuentas", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
        public Catalogo_Cuentas? Catalogo_Cuentas { get; set; }

        // Denominaciones al cierre
        [JsonProp]
        public List<Denominacion_Caja> Denominaciones_Apertura { get; set; } = [];

        // Denominaciones al cierre
        [JsonProp]
        public List<Denominacion_Caja> Denominaciones_Cierre { get; set; } = [];

    }
}