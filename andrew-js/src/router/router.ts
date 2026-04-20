import { Component } from "../core/component";
import { IRoute } from "../types/types";

export class Router {
    public routes: IRoute[] | null = null;
    public parentId: string;
    private currentInstance: Component | null = null;

    constructor(parentId: string, routes: IRoute[]){
        this.parentId = parentId;
        this.routes = routes;

        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute(){
        let hash = window.location.hash.replace(/^#/, '') || '/';

        const routeConfig = this.routes?.find(r => r.path === hash);

        if (routeConfig) {
            if (this.currentInstance) {
                this.currentInstance.unmount();
            }

            /*
            const params = handleURLParams();
            injetar params no componente, como props.
            */
            const params = new URLSearchParams(window.location.search);
            console.log(params)

            this.currentInstance = new routeConfig.component();
            this.currentInstance!.mount(this.parentId);
        } else {
            console.error(`Rota não encontrada: ${hash}`);
        }
    }
}


interface IRouterParams {
    property: string;
    value: string;
}

function handleURLParams(){
    const params = new URLSearchParams(window.location.search);

    return params;
}