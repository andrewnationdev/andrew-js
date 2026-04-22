import { createStore } from "andrew-tiger";
import { Component } from "./core/component";
import { Router } from "./router/router";
import { useSelector } from "./dom/helper";
import { IChildren, IRoute } from "./types/types";

class BotaoComponente extends Component {
    render() {
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
    }) => ({
        notes: [...state!.notes, note]
    }))
}));

class ListaTarefasComponente extends Component {
    constructor() {
        super({
            title: "Lista de Tarefas"
        });
        this.bindStore(store_notas);
    }

    render() {
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

    afterRender() {
        const addButton = useSelector(this?.ref!, "#add-todo")!;

        if (addButton) addButton.onclick = () => {
            const value = (useSelector(this?.ref!, "#new-todo") as HTMLInputElement).value;

            if (value != "" && value != undefined) store_notas.getState().addNotes(value)
        }
    }
}

class Header extends Component {
    render() {
        return `
        <header class="w-full bg-slate-800 text-white shadow-md">
            <div class="container mx-auto px-4 py-3 flex justify-between items-center">
                <div class="text-xl font-bold tracking-tight">
                    <span class="text-blue-400">Andrew</span>JS
                </div>
                
                <nav>
                    <ul class="flex space-x-6 text-sm font-medium">
                        <li class="hover:text-blue-400 cursor-pointer transition">Home</li>
                        <li class="hover:text-blue-400 cursor-pointer transition">Docs</li>
                        <li class="hover:text-blue-400 cursor-pointer transition">GitHub</li>
                    </ul>
                </nav>
            </div>
        </header>
        `
    }
}

class Footer extends Component {
    render() {
        return `
        <footer class="w-full bg-slate-100 border-t border-slate-200 py-8 mt-auto">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-600">
                    <div>
                        <h3 class="font-bold text-slate-900 mb-3 text-sm uppercase">Sobre o Projeto</h3>
                        <p class="text-xs leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Desenvolvendo um framework leve e analítico.
                        </p>
                    </div>
                    
                    <div>
                        <h3 class="font-bold text-slate-900 mb-3 text-sm uppercase">Links Úteis</h3>
                        <ul class="text-xs space-y-2">
                            <li class="hover:underline cursor-pointer">Documentação</li>
                            <li class="hover:underline cursor-pointer">Exemplos</li>
                            <li class="hover:underline cursor-pointer">Contribuir</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 class="font-bold text-slate-900 mb-3 text-sm uppercase">Status do Sistema</h3>
                        <div class="flex items-center space-x-2">
                            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span class="text-xs font-mono italic">Build: v1.0.4-beta</span>
                        </div>
                        <p class="text-[10px] mt-2 text-slate-400 italic">
                            Ponta Grossa, PR - 2026
                        </p>
                    </div>
                </div>
            </div>
        </footer>
        `
    }
}

class HomePage extends Component {
    header = new Header();
    footer = new Footer();
    listaNotas = new ListaTarefasComponente();

    render() {
        return `
            <div class="min-h-screen min-w-[100%]">
                <div id="header">${this.header.render()}</div>
                <div id="content" class="my-12 p-12">${this.listaNotas.render()}</div>
                <div id="footer">${this.footer.render()}</div>
            </div>
        `;
    }

    afterRender() {
        this.attachChild(this.header, "#header");
        this.attachChild(this.listaNotas, "#content");
        this.attachChild(this.footer, "#footer");
    }
}

const routes: IRoute[] = [
    { path: '/', component: BotaoComponente },
    { path: '/contador', component: Contador },
    { path: '/notas', component: ListaTarefasComponente },
    { path: '/home', component: HomePage }
];

new Router('#root', routes);

/**
 * criar classe que extende components
 * instancia
 * monta
 */