import { createStore } from "andrew-tiger";
import { Component } from "./core/component";
import { Router } from "./core/router";

class BotaoComponente extends Component {
    render(){
        return `<button class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md active:transform active:scale-95">Clique-me</button>`;
    }
}

const store = createStore((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 }))
}));

class Contador extends Component {
    constructor() {
        super({
            title: "Hello World"
        });
        this.bindStore(store); 
    }

    render() {
        return `<div>${store.getState().count}</div> 
                <h1>${this.props.title}</h1>
                <button id="add"> + </button>`;
    }

    afterRender() {
        const btn = this.ref?.querySelector("#add");
        if (btn) btn.onclick = () => store.getState().increment();
    }
}

const routes = [
    { path: '/', component: BotaoComponente },
    { path: '/contador', component: Contador }
];

new Router('#root', routes);

/**
 * criar classe que extende components
 * instancia
 * monta
 */