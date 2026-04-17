import { createStore } from "andrew-tiger";
import { Component } from "./core/component";
import { Router } from "./router/router";
import { useSelector } from "./dom/helper";
import { IRoute } from "./types/types";

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

const store_notas = createStore((set) => ({
    notes: [],
    addNotes: (note: string) => set((state: {
        notes: string[]
    })=> ({
        notes: [...state!.notes, note]
    }))
}));

class BlocoNotas extends Component {
    constructor(){
        super({
            title: "Exemplo Bloco de Notas"
        });
        this.bindStore(store_notas);
    }

    render(){
        return `
            <div class="flex flex-col gap-4 min-w-[70%]">
                <h1>${this.props.title}</h1>
                <hr/>
                <div class="flex gap-4 justify-between">
                    <input id="new-todo" class="border p-2 flex-grow" placeholder="Nova tarefa...">
                    <button id="add-todo" class="px-6 py-2 bg-red-500 hover:bg-red-800 text-white font-semibold rounded-lg transition-colors shadow-md active:transform active:scale-95">
                        Adicionar
                    </button>
                </div>
                <hr/>
                <ul id="list">
                    ${store_notas!.getState()!.notes!.map((t, i) => `<li>${i} - ${t}</li>`).join('')}
                </ul>
            </div>
        `
    }

    afterRender(){
        const addButton: Element = useSelector(this?.ref!, "#add-todo");
        
        if(addButton) addButton.onclick = () => {
            const value = (useSelector(this?.ref!, "#new-todo") as HTMLInputElement).value;
            
            if(value != "" && value != undefined) store_notas.getState().addNotes(value)
        }
    }
}

const routes: IRoute[] = [
    { path: '/', component: BotaoComponente },
    { path: '/contador', component: Contador },
    { path: '/notas', component: BlocoNotas }
];

new Router('#root', routes);

/**
 * criar classe que extende components
 * instancia
 * monta
 */