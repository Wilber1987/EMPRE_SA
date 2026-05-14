using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APPCORE;
using Transactions;

namespace BusinessLogic.Facturacion.Mapping.Querys
{
    public class TransactionReport : QueryClass
    {
        public int? Id_sucursal { get; set; }
        public string? Nombre { get; set; }
        public string? Moneda { get; set; }
        public TipoMovimiento? Tipo_movimiento { get; set; }
        public decimal? Debito { get; set; }
        public decimal? Credito { get; set; }
        public decimal? Debito_dolares { get; set; }
        public decimal? Credito_dolares { get; set; }
        public override string GetQuery()
        {
            //todo arreglar lo de los filtros
            return @$"SELECT
                    c.id_sucursal,
                    c.nombre,
                    tm.moneda,
                    tm.Tipo_movimiento,
                    SUM(dm.debito) as Debito,
                    SUM(dm.credito) as Credito,
                    SUM(dm.debito_dolares) as Debito_dolares,
                    SUM(dm.credito_dolares) as Credito_dolares

                FROM EMPRE_SA.dbo.Detail_Movimiento dm
                INNER JOIN EMPRE_SA.dbo.Catalogo_Cuentas c 
                    ON c.id_cuentas = dm.id_cuenta
                INNER JOIN EMPRE_SA.dbo.Transaction_Movimiento tm 
                    ON tm.id_movimiento = dm.id_movimiento
                WHERE {string.Join(" AND ", filterData.Where(filter => filter.Values?.Count > 0)
                    .Select(filter => $"{filter.PropName} {filter.FilterType} '{filter.Values[0]}'")
                    .ToList())}
                GROUP BY c.id_sucursal, c.nombre, tm.moneda, tm.Tipo_movimiento            
            ";
        }
    }
}