import { THTMLContent, TProps } from "../types/types";

export abstract class Component {
    protected ref: HTMLElement | null = null;
    private deleteStore: () => void = () => { };
    props: TProps = {};

    constructor(props?: TProps) {
        this.props = props ?? {};
    }

    abstract render(): THTMLContent;

    afterRender(): void { }

    mount(parent: string) {
        const parent_el = document.querySelector(parent);

        if (parent_el) {
            const container = document.createElement("div");
            this.ref = container;

            this.updateDOM();

            parent_el.appendChild(this.ref);
        } else {
            throw new Error(`Element ${parent} not found in DOM tree`);
        }
    }

    private updateDOM() {
        if (this.ref) {
            this.ref.innerHTML = this.render();
            this.afterRender();
        }
    }

    bindStore(store: any) {
        this.deleteStore = store.subscribe(() => {
            this.updateDOM();
        });
    }

    unmount() {
        this.deleteStore();
        if (this.ref && this.ref.parentNode) {
            this.ref.parentNode.removeChild(this.ref);
        }
        this.ref = null;
    }

    attachChild(instance: Component, selector: string): void {
        const target = this.ref?.querySelector(selector);

        if (target) {
            instance.ref = target as HTMLElement;
            instance.afterRender();
        } else {
            console.warn(`Target ${selector} não encontrado para o componente ${instance.constructor.name}`);
        }
    }
}