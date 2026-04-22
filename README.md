# ANDREW-JS

Este é um projeto experimental que propõe criar um MVP de um framework JavaScript para fins de estudos.

This is an experimental project that proposes the creation of an MVP for a JavaScript framework for studying purposes.

## INSTALAÇÃO E CONFIGURAÇÃO

1-Baixe o repositório ou clone-o.
2-Escreva o código em `/src/index.ts`.
3-Importe em seu `index.html` o seguinte `<script type="module" src="../src/index.ts"></script>`.
4-Crie uma `<div>` com o id `#root` para montar a aplicação.
5-Use o comando `cd andrew-js && npx vite` para iniciar o projeto.

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

## PARÂMETROS DE ROTA

Na rota, os parâmetros são passados assim: `#/home?id=9`. Tudo o que estiver depois do `?` são os parâmetros. Para acessá-los dentro do componente, use `this.props.[chave]`. Por exemplo, para acessar o `id` no exemplo anterior use `this.props.id`.

## ANINHAMENTO DE COMPONENTES

Para colocar um componente dentro outro, deve-se instanciar esse componente e depois chamar a função `render()` no local em que ele será renderizado.

```ts
class HomePage extends Component {
    header = new Header();
    footer = new Footer();
    listaNotas = new ListaTarefasComponente();

    render(){
        return `
            <div class="w-full min-h-screen">
                <div id="header">${this.header.render()}</div>
                <div class="my-12">
                 <div id="content">${this.listaNotas.render()}</div>
                </div>
                <div id="footer">${this.footer.render()}</div>
            </div>
        `;
    }

    afterRender(){
        this.attachChild(this.header, "#header");
        this.attachChild(this.listaNotas, "#content");
        this.attachChild(this.footer, "#footer");
    }
}
```