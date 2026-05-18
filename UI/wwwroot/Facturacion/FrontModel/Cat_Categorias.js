//@ts-check
import { Catalogo_Estados_Articulos_ModelComponent } from "../../FrontModel/DBODataBaseModel.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { Cat_Producto } from './Cat_Producto.js';
class Cat_Categorias extends EntityClass {
    /**
     * @param {Partial<Cat_Categorias>} props
     */
    constructor(props) {
        super(props, 'EntityFacturacion');
        Object.assign(this, props);
    }
   /**@type {Number?}*/ Id_Categoria = null;
   /**@type {String?}*/ Descripcion = null;
   /**@type {String?}*/ Estado = null;
   /**@type {Number?} */ plazo_limite = null;
   /**@type {Array<Cat_Producto>} OneToMany*/ Cat_Producto = [];
   /**@type {Array<Catalogo_Estados_Articulos_ModelComponent>} OneToMany*/ Catalogo_Estados_Articulos = [];
}
export { Cat_Categorias };

