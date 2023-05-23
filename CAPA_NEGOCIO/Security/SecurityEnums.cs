using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CAPA_DATOS;

namespace CAPA_NEGOCIO.Security
{
    public enum RoleEnum
    {
       ADMIN    
    }
    public enum PermissionsEnum
    {
       ADMIN_ACCESS,
       HOME_ACCESS,
       GESTION_CLIENTES,
       GESTION_INGRESOS,
       GESTION_EGRESOS,
       GESTION_CONTRATOS,
       GESTION_SUCURSALES,
       GESTION_MOVIMIENTOS,//PERMITE INGRESOS Y EGRESOS, Y MOVIMIENTOS DE CAJA
    }
}
