import { Component } from "../core/component";

export interface IRoute {
    path: string;
    component: new () => Component;
}

export type THTMLContent = string;
export type TProps = Record<string, any>;
export type TSelector = string;