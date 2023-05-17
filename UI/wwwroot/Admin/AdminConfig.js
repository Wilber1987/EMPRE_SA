import { WRender , ComponentsManager} from '../WDevCore/WModules/WComponentsTools.js';
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { DBOCatalogosManagerView } from "./DBOCatalogosManagerView.js";
const DOMManager = new ComponentsManager({ MainContainer: Main });
window.addEventListener("load", async () => {            
    Aside.append(WRender.Create({tagName: "h3", innerText: "Mantenimiento"}));
    Aside.append(new WAppNavigator({
        DarkMode: false,
        Direction: "column",
        Elements: [
            { name: "Catalogos", action: ()=> {
                 DOMManager.NavigateFunction("DBOCatalogosManagerView", new DBOCatalogosManagerView());
            } }
        ]
    }));
});