import { createStore } from "andrew-tiger";
import { Component } from "./core/component";

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
    render() {
        const state = store.getState();
        return `
            <div class="text-center">
                <p class="text-xl font-bold">Contagem: ${state.count}</p>
                <button id="btn-add" class="bg-blue-500 text-white p-2 rounded">Adicionar</button>
            </div>
        `;
    }

    afterRender() {
        const btn = this.ref?.querySelector("#btn-add");
        if (btn) {
            btn.onclick = () => store.getState().increment();
        }
    }
}

const app = new Contador();

app.bindStore(store);
app.mount("#root");

/**
 * criar classe que extende components
 * instancia
 * monta
 */