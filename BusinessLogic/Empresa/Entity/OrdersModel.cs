using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessLogic.Empresa.Entity
{
    public enum EstadoOrden
    {
        PENDIENTE,      // Orden creada, esperando aprobación
        APROBADA,       // Aprobada pero no ejecutada
        RECHAZADA,      // Rechazada por el aprobador
        EJECUTADA,      // Movimiento ya ejecutado
        ANULADA         // Anulada después de ejecución
    }
    
}