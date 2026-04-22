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
        const fullHash = window.location.hash.replace(/^#/, '') || '/';
        const [path, queryString] = fullHash.split('?');

        const routeConfig = this.routes?.find(r => r.path === path);

        if (routeConfig) {
            if (this.currentInstance) {
                this.currentInstance.unmount();
            }

            const params = new URLSearchParams(queryString || "");
            const props = Object.fromEntries(params.entries());

            this.currentInstance = new routeConfig.component(props);
            this.currentInstance!.mount(this.parentId);
        } else {
            console.error(`Rota não encontrada: ${path}`);
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