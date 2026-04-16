# ANDREW-JS

Este é um projeto experimental que propõe criar um MVP de um framework JavaScript para fins de estudos.

This is an experimental project that proposes the creation of an MVP for a JavaScript framework for studying purposes.

## TECNOLOGIAS EMPREGADAS

- Vite
- TypeScript
- Andrew-Tiger (meu próprio gerenciador de estado, instalável com `npm install andrew-tiger`)

## CRIAÇÃO DE COMPONENTES

Um componente em AndrewJS é uma instância da classe `Component`, que contém alguns métodos como:

- `render()` que retorna código HTML no formato de template, a fim de renderizar o componente na tela. O método realiza também a montagem dele na árvore DOM.
- `afterRender()` executa algo depois da renderização do componente como, por exemplo, a adição de eventos ao componente.
- `bindStore()` para conectar o estado ao componente, permitindo a sua rerenderização quando o estado mudar.

```ts
class Contador extends Component {
    constructor() {
        super();
        this.bindStore(store); 
    }

    render() {
        return `<div>${store.getState().count}</div> 
                <button id="add"> + </button>`;
    }

    afterRender() {
        const btn = this.ref?.querySelector("#add");
        if (btn) btn.onclick = () => store.getState().increment();
    }
}
```

## ROTEAMENTO

O array de rotas contem um objeto com o caminho da rota e o componente a ser renderizado. Por enquanto, as rotas tem o formato `#/nome_da_rota`, por ser mais fácil de implementar e não requerer modificações no servidor.

Depois, monta-se o roteador em `root`, o contêiner da aplicação.

```ts
const routes = [
    { path: '/', component: BotaoComponente },
    { path: '/contador', component: Contador }
];

new Router('#root', routes);
```

## CRIAÇÃO DE STORE

Com esse modelo você pode criar uma store para guardar os dados que serão usados dentro dos componentes, ou seja, o estado.

```ts
const store = createStore((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 }))
}));
```

## EXEMPLO BLOCO DE NOTAS

```ts
import { createStore } from "andrew-tiger";
import { Component } from "./core/component";

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
                    <button id="add-todo" class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-md active:transform active:scale-95">
                        Adicionar
                    </button>
                </div>
                <hr/>
                <ul id="list">
                    ${store_notas.getState().notes.map((t, i) => `<li>${i} - ${t}</li>`).join('')}
                </ul>
            </div>
        `
    }

    afterRender(){
        const addButton = this?.ref?.querySelector("#add-todo");
        if(addButton) addButton.onclick = () => {
            const value = (this?.ref?.querySelector("#new-todo") as HTMLInputElement).value;
            
            if(value != "" && value != undefined) store_notas.getState().addNotes(value)
        }
    }
}
```

## HELPERS

Os helpers são utilitários para auxiliar em algumas tarefas, reduzindo a quantidade de código necessária.

`useSelector(ref, id)`.

Exemplo:

```ts
//Seleciona o elemento com o id #add-todo
const addButton: Element = useSelector(this?.ref!, "#add-todo");
```

