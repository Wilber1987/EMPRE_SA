using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CAPA_DATOS;

namespace AppGenerator
{
    internal class JsEnviroment
    {
        public static void setJsHeaders(out StringBuilder entityString)
        {
            entityString = new StringBuilder();
            entityString.AppendLine("import { EntityClass } from \"../WDevCore/WModules/EntityClass.js\";");
            entityString.AppendLine("import { WAjaxTools } from \"../WDevCore/WModules/WComponentsTools.js\";");
        }
        public static void mapJsEntity(StringBuilder entityString, EntitySchema table, string schema, string typeshema)
        {
            entityString.AppendLine("class " + table.TABLE_NAME + " extends EntityClass {");
            entityString.AppendLine("   constructor(props) {");
            entityString.AppendLine("       super(props, '" + (typeshema == "VIEW" ? "View" : "Entity") + schema.ToUpper() + "');");
            entityString.AppendLine("       for (const prop in props) {");
            entityString.AppendLine("           this[prop] = props[prop];");
            entityString.AppendLine("       }");
            entityString.AppendLine("   }");
            //entityString.AppendLine("   Namespace = '" + (typeshema == "VIEW" ? "View" : "Entity") + schema.ToUpper() + "';");
            foreach (var entity in SqlADOConexion.SQLM.describeEntity(table.TABLE_NAME))
            {
                string type = "";
                switch (entity.DATA_TYPE)
                {
                    case "int": type = "number"; break;
                    case "smallint": type = "number"; break;
                    case "bigint": type = "number"; break;
                    case "decimal": type = "number"; break;
                    case "money": type = "number"; break;
                    case "float": type = "number"; break;
                    case "char": type = "text"; break;
                    case "nchar": type = "text"; break;
                    case "varchar": type = "text"; break;
                    case "nvarchar": type = "text"; break;
                    case "uniqueidentifier": type = "text"; break;
                    case "datetime": type = "date"; break;
                    case "date": type = "date"; break;
                    case "bit": type = "checkbox"; break;
                }
                if (!SqlADOConexion.SQLM.isForeinKey(table.TABLE_NAME, entity.COLUMN_NAME))
                {
                    entityString.AppendLine("   " + entity.COLUMN_NAME + " = { type: '" + type + "'"
                    + (SqlADOConexion.SQLM.isPrimary(table.TABLE_NAME, entity.COLUMN_NAME) ? ", primary: true" : "") + " };");
                }

            }
            foreach (var entity in SqlADOConexion.SQLM.ManyToOneKeys(table.TABLE_NAME))
            {
                var oneToMany = SqlADOConexion.SQLM.oneToManyKeys(entity.REFERENCE_TABLE_NAME);
                var find = oneToMany.Find(o => o.FKTABLE_NAME == table.TABLE_NAME);
                string controlType = "WSELECT";
                if (entity.REFERENCE_TABLE_NAME.ToLower().StartsWith("catalogo")
                    || entity.REFERENCE_TABLE_NAME.ToLower().StartsWith("catalog"))
                {
                    controlType = "WSELECT";
                    entityString.AppendLine("   " + entity.REFERENCE_TABLE_NAME + " = { type: '" + controlType
                       + "',  ModelObject: ()=> new " + entity.REFERENCE_TABLE_NAME + "()};");
                    continue;
                }
                else if (entity.REFERENCE_TABLE_NAME.ToLower().StartsWith("detail")
                    || entity.REFERENCE_TABLE_NAME.ToLower().StartsWith("detalle"))
                {
                    if (!table.TABLE_NAME.ToLower().StartsWith("catalogo"))
                    {
                        controlType = "WSELECT";
                        entityString.AppendLine("   " + entity.REFERENCE_TABLE_NAME + " = { type: '" + controlType
                           + "',  ModelObject: ()=> new " + entity.REFERENCE_TABLE_NAME + "()};");
                        continue;
                    }
                    //controlType = "WSELECT";
                }
                else if (entity.REFERENCE_TABLE_NAME.ToLower().StartsWith("transaction"))
                {
                    controlType = "Model";
                    if (table.TABLE_NAME.ToLower().StartsWith("transaction"))
                    {
                        controlType = "WSELECT";
                    }
                    if (!table.TABLE_NAME.ToLower().StartsWith("detail")
                        && !table.TABLE_NAME.ToLower().StartsWith("catalogo"))
                    {
                        entityString.AppendLine("   " + entity.REFERENCE_TABLE_NAME + " = { type: '" + controlType
                            + "',  ModelObject: ()=> new " + entity.REFERENCE_TABLE_NAME + "()};");
                    }
                    continue;
                }
                else if (entity.REFERENCE_TABLE_NAME.ToLower().StartsWith("relational")
                    || entity.REFERENCE_TABLE_NAME.ToLower().StartsWith("relacional"))
                {
                    controlType = "Model";
                    entityString.AppendLine("   " + entity.REFERENCE_TABLE_NAME + " = { type: '" + controlType
                            + "',  ModelObject: ()=> new " + entity.REFERENCE_TABLE_NAME + "()};");
                    continue;
                }

            }
            foreach (var entity in SqlADOConexion.SQLM.oneToManyKeys(table.TABLE_NAME))
            {
                string mapType = "MasterDetail";
                if ((entity.FKTABLE_NAME.ToLower().StartsWith("catalogo") || (table.TABLE_NAME.ToLower().StartsWith("transaction")
                    && entity.FKTABLE_NAME.ToLower().ToLower().StartsWith("transaction"))))
                {
                    mapType = "MULTYSELECT";
                }
                if (entity.FKTABLE_NAME.ToLower().StartsWith("detail") && table.TABLE_NAME.ToLower().StartsWith("detail"))
                {
                    mapType = "WSELECT";
                }
                if ((!table.TABLE_NAME.ToLower().StartsWith("catalogo")
                    || entity.FKTABLE_NAME.ToLower().StartsWith("relational"))
                    & !entity.FKTABLE_NAME.ToLower().StartsWith("transaction"))
                {
                    entityString.AppendLine("   " + entity.FKTABLE_NAME + " = { type: '" + mapType + "',  ModelObject: ()=> new " + entity.FKTABLE_NAME + "()};");
                }
            }
            entityString.AppendLine("}");
            entityString.AppendLine("export { " + table.TABLE_NAME + " }");
        }
        public static void setJsViewBuilder(string schema, string name, string type)
        {
            if (name.ToLower().StartsWith("relational") || name.ToLower().StartsWith("detail") || name.ToLower().StartsWith("catalogo_"))
            {
                return;
            }
            var entityString = new StringBuilder();
            entityString.AppendLine("import { WRender, ComponentsManager, WAjaxTools } from \"../WDevCore/WModules/WComponentsTools.js\";");
            entityString.AppendLine("import { StylesControlsV2, StyleScrolls } from \"../WDevCore/StyleModules/WStyleComponents.js\"");
            entityString.AppendLine("import { WTableComponent } from \"../WDevCore/WComponents/WTableComponent.js\"");
            entityString.AppendLine("import { WFilterOptions } from \"../WDevCore/WComponents/WFilterControls.js\"");
            entityString.AppendLine("import { " + name + " } from \"../FrontModel/" + schema.ToUpper() + (type == "VIEW" ? "ViewModel.js\"" : "DataBaseModel.js\""));
            entityString.AppendLine("class " + name + "View extends HTMLElement {");
            entityString.AppendLine("   constructor(props) {");
            entityString.AppendLine("       super();");
            entityString.AppendLine("       this.Draw();");
            entityString.AppendLine("   }");
            entityString.AppendLine("   Draw = async () => {");
            entityString.AppendLine("       const model = new  " + name + "();");
            entityString.AppendLine("       const dataset = await model.Get();");
            entityString.AppendLine("       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })");
            entityString.AppendLine("       this.MainComponent = new WTableComponent({ ModelObject: model, Dataset: dataset, Options: {");
            if (type != "VIEW")
            {
                entityString.AppendLine("           Add: true, UrlAdd: \"../api/Api" + (type == "VIEW" ? "View" : "Entity") + schema.ToUpper() + "/save" + name + "\",");
                entityString.AppendLine("           Edit: true, UrlUpdate: \"../api/Api" + (type == "VIEW" ? "View" : "Entity") + schema.ToUpper() + "/update" + name + "\",");
            }
            entityString.AppendLine("           Search: true, UrlSearch: \"../api/Api" + (type == "VIEW" ? "View" : "Entity") + schema.ToUpper() + "/get" + name + "\"");
            entityString.AppendLine("       }})");
            entityString.AppendLine("       this.TabContainer.append(this.MainComponent)");
            entityString.AppendLine("       this.FilterOptions = new WFilterOptions({");
            entityString.AppendLine("           Dataset: dataset,");
            entityString.AppendLine("           ModelObject: model,");
            entityString.AppendLine("           FilterFunction: (DFilt) => {");
            entityString.AppendLine("               this.MainComponent.DrawTable(DFilt);");
            entityString.AppendLine("           }");
            entityString.AppendLine("      });");


            entityString.AppendLine("       this.append(");
            entityString.AppendLine("           StylesControlsV2.cloneNode(true),");
            entityString.AppendLine("           StyleScrolls.cloneNode(true),");
            entityString.AppendLine("           this.FilterOptions,");
            entityString.AppendLine("           this.TabContainer");
            entityString.AppendLine("       );");
            entityString.AppendLine("   }");
            entityString.AppendLine("}");
            entityString.AppendLine("customElements.define('w-" + name.ToLower() + "', " + name + "View );");
            entityString.AppendLine(@"window.addEventListener('load', async () => {  MainBody.append(new " + name + @"View())  })");

            AppGenerator.CSharpEnviroment.createCSharpView(name);
            AppGenerator.Utility.createFile(@"../AppGenerateFiles/Views\" + name + "View.js", entityString.ToString());

        }
        public static void setJsCatalogoBuilder(string schema, List<string> names)
        {

            var entityString = new StringBuilder();
            entityString.AppendLine("//@ts-check");
            entityString.AppendLine("import { WRender, ComponentsManager, WAjaxTools } from \"../WDevCore/WModules/WComponentsTools.js\";");
            entityString.AppendLine("import { WOrtograficValidation } from \"../WDevCore/WModules/WOrtograficValidation.js\";");
            entityString.AppendLine("import { StylesControlsV2, StyleScrolls } from \"../WDevCore/StyleModules/WStyleComponents.js\"");
            entityString.AppendLine("import { WTableComponent } from \"../WDevCore/WComponents/WTableComponent.js\"");
            entityString.AppendLine("import { WAppNavigator } from \"../WDevCore/WComponents/WAppNavigator.js\"");
            entityString.AppendLine("import { " + String.Join(',', names) + " } from \"../FrontModel/" + schema.ToUpper() + "DataBaseModel.js\"");

            entityString.AppendLine("class CatalogosManagerView extends HTMLElement {");
            entityString.AppendLine("   constructor() {");
            entityString.AppendLine("       super();");
            entityString.AppendLine("       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })");
            entityString.AppendLine("       this.TabManager = new ComponentsManager({ MainContainer: this.TabContainer });");
            entityString.AppendLine("       this.append(");
            entityString.AppendLine("           StylesControlsV2.cloneNode(true),");
            entityString.AppendLine("           StyleScrolls.cloneNode(true),");
            entityString.AppendLine("          this.MainNav,");
            entityString.AppendLine("           this.TabContainer");
            entityString.AppendLine("       );");
            entityString.AppendLine("   }");

            entityString.AppendLine("   /** @param {Object} Model*/");
            entityString.AppendLine("   NavigateFunction = (Model)=>{");
            entityString.AppendLine("       const mainComponent = new WTableComponent({ ModelObject: model, Dataset: [], Options: {");
            entityString.AppendLine("           Add: true,");
            entityString.AppendLine("           Edit: true,");
            entityString.AppendLine("           Search: true,");
            entityString.AppendLine("           Delete: true");
            entityString.AppendLine("       }})");
            entityString.AppendLine("       this.TabManager.NavigateFunction(Model.constructor.name, mainComponent);");
            entityString.AppendLine("   }");

            entityString.AppendLine("    MainNav = new WAppNavigator({  Elements: [");
            foreach (var name in names)
            {
                entityString.AppendLine("       { name: WOrtograficValidation.es('" + name + "'), action : async ()=> {");
                entityString.AppendLine("           this.NavigateFunction(new " + name + "())");
                entityString.AppendLine("        }},");
            }
            entityString.AppendLine("   ]});");
            entityString.AppendLine("}");
            entityString.AppendLine("customElements.define('w-catalogos_manager', CatalogosManagerView );");
            entityString.AppendLine(@"window.addEventListener('load', async () => {  MainBody.append(new CatalogosManagerView()) })");

            AppGenerator.CSharpEnviroment.createCSharpView(schema.ToUpper() + "CatalogosManager");
            AppGenerator.Utility.createFile(@"../AppGenerateFiles/Views/" + schema.ToUpper() + "CatalogosManagerView.js", entityString.ToString());

        }
    }
}
