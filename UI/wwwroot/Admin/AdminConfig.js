//@ts-check
import { WRender, ComponentsManager } from '../WDevCore/WModules/WComponentsTools.js';
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { DBOCatalogosManagerView } from "./DBOCatalogosManagerView.js";
import { Transactional_ConfiguracionesView } from './Transactional_ConfiguracionesView.js';


window.addEventListener("load", async () => {
    Main.append(WRender.Create({ tagName: "h3", innerText: "Mantenimiento" }));
    Main.append(new WAppNavigator({
        DarkMode: false,
        NavStyle: "tab",
        Inicialize: true,
        Elements: [
            {
                name: "Config", action: () => {
                    return new Transactional_ConfiguracionesView();
                }
            },
            {
                name: "Catalogos", action: () => {
                    return new DBOCatalogosManagerView();
                }
            }
        ]
    }));
});