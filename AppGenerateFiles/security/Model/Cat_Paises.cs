using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Cat_Paises : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_Pais { get; set; }
       public string? Estado { get; set; }
       public string? Descripcion { get; set; }
   }
}
