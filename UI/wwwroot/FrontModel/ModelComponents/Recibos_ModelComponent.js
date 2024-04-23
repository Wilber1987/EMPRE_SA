import { WForm } from "../../WDevCore/WComponents/WForm.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { Detail_Prendas_Vehiculos, Tbl_Cuotas } from "../Model.js";
import { Tbl_Cuotas_ModelComponent } from "../ModelComponents.js";
class Recibos_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'Recibos');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {ModelProperty} */ numero_contrato = { type: "number", disabled: true, hidden: true };
    /**@type {ModelProperty} */ title2 = { type: "title", label: "Datos de recibo:" };
    /**@type {ModelProperty} */ fecha = {
        type: "date", hidden: true
    };
    /**@type {ModelProperty} */ id_recibo = { type: "number", primary: true };
    /**@type {ModelProperty} */ consecutivo = { type: "number", hidden: true, require: false };

    /**@type {ModelProperty} */ interes_demas_cargos_pagar_cordobas = { type: "number", hiddenInTable: true, disabled: true, label: "Interes C$" };
    /**@type {ModelProperty} */ abono_capital_cordobas = { type: "number", hiddenInTable: true, disabled: true };
    /**@type {ModelProperty} */ cuota_pagar_cordobas = { type: "number", hiddenInTable: true, disabled: true };
    /**@type {ModelProperty} */ mora_cordobas = { type: "number", hiddenInTable: true, disabled: true };
    /**@type {ModelProperty} */ mora_interes_cordobas = { type: "number", hiddenInTable: true, disabled: true, label: "Interes + Mora C$" };
    /**@type {ModelProperty} */ total_cordobas = { type: "number", hiddenInTable: true, disabled: true };    
    /**@type {ModelProperty} */ perdida_de_documento_monto = { type: "number", disabled: true, defaultValue: 0, require: false };

    /**@type {ModelProperty} */ interes_demas_cargos_pagar_dolares = { type: "number", hiddenInTable: true, disabled: true, label: "Interes $" };
    /**@type {ModelProperty} */ abono_capital_dolares = { type: "number", hiddenInTable: true, disabled: true };
    /**@type {ModelProperty} */ cuota_pagar_dolares = { type: "number", hiddenInTable: true, disabled: true };
    /**@type {ModelProperty} */ mora_dolares = { type: "number", hiddenInTable: true, disabled: true };
    /**@type {ModelProperty} */ mora_interes_dolares = { type: "number", hiddenInTable: true, disabled: true, label: "Interes + Mora $" };
    /**@type {ModelProperty} */ total_dolares = { type: "number", hiddenInTable: true, disabled: true };
    /**@type {ModelProperty} */ reestructurar_monto = { type: "number", disabled: true, defaultValue: 0, require: false };

    /**@type {ModelProperty} */ //total_parciales = { type: "number", hiddenInTable: true, disabled: true };

    /**@type {ModelProperty} */ fecha_roc = { type: "date", disabled: true, hidden: true };


    /**@type {ModelProperty} */ title3 = { type: "title", label: "Opciones:" };
  

    
    /**@type {ModelProperty} */ paga_cordobas = { type: "number", hiddenInTable: true };
    /**@type {ModelProperty} */ paga_dolares = { type: "number", hiddenInTable: true };
    /**@type {ModelProperty} */ temporal = { type: "checkbox", require: false };
    /**@type {ModelProperty} */ cancelar = { type: "checkbox", hiddenInTable: true, require: false };
    /**@type {ModelProperty} */ perdida_de_documento = {
        type: "checkbox", hiddenInTable: true, require: false, action: (recibo, form) => {
            if (recibo.perdida_de_documento == true) {
                recibo.perdida_de_documento_monto = 1;
            } else {
                recibo.perdida_de_documento_monto = 0;
            }
            form.DrawComponent();
        }
    };
    /**@type {ModelProperty} */ solo_abono = { type: "checkbox", hiddenInTable: true, require: false };

    /**@type {ModelProperty} */ solo_interes_mora = {
        type: "checkbox",  require: false,
        action: (recibo, form) => {}
    };
    /**@type {ModelProperty} */ reestructurar = {
        type: "checkbox", hidden: true, require: false,
        action: (recibo, form) => {
            if (recibo.reestructurar == true) {
                this.reestructurar_value.hidden = false;
                //this.reestructurar_monto.hidden = false;  
                recibo.reestructurar_monto = 1;
            } else {
                this.reestructurar_value.hidden = true;
                //this.reestructurar_monto.hidden = true; 
                recibo.reestructurar_monto = 0;
            }
            form.DrawComponent();
        }
    };
    /**@type {ModelProperty} */ total_apagar_dolares = {
        type: "operation", action: (recibo, form) => {
            const val = parseFloat(recibo.paga_dolares ?? 0)
                + parseFloat(recibo.mora_dolares ?? 0)
                + parseFloat(recibo.reestructurar_monto ?? 0)
            return val.toFixed(3);
        }
    };
    
   /**@type {ModelProperty} */ moneda = { type: "radio", Dataset: ["Cordobas", "Dolares"] };
    /**@type {ModelProperty} */ reestructurar_value = { type: "number", label: "meses a reestructurar", placeholder: "número de meses ejm. 1", hidden: true, min: 1, require: false };
    
    
    VerRecibo = async () => {
        return await this.SaveData("PDF/GeneratePdfContract", this)
    }
}
export { Recibos_ModelComponent }