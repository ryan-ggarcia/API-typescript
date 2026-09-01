# API-typescript

API REST em TypeScript que roda **nativamente no Node** — sem `ts-node`, sem etapa de build
obrigatória. O Node executa os arquivos `.ts` direto; o `tsc` entra apenas para validar os tipos.

---

## Requisitos

- **Node.js 22.18+** (ou 24+) — versões que executam `.ts` sem flag nenhuma
- **npm**

```bash
node --version
```

Se for menor que 22.18, atualize antes de continuar.

---

## Como o projeto lida com TypeScript

| Tarefa | Ferramenta | Observação |
|---|---|---|
| **Rodar o código** | Node nativo (`node src/server.ts`) | Apaga os tipos e executa. **Não** checa tipos. |
| **Validar os tipos** | `tsc --noEmit` | Roda no editor, sob demanda e no CI. Não gera arquivo. |
| **Compilar para `dist/`** (opcional) | `tsc` | Só se você quiser um artefato `.js` para produção. |

Nada de `ts-node`: a última versão estável (10.9.2, dez/2023) não acompanha o TypeScript atual e
tem atrito com ESM. O Node moderno tornou a ferramenta desnecessária.

---

## Tutorial: configurar TypeScript no Node do zero

Reproduz exatamente a configuração deste repositório.

### 1. Conferir a versão do Node

```bash
node --version   # precisa ser >= 22.18
```

Desde a 22.18 o Node faz *type stripping* nativo: lê o `.ts`, remove as anotações de tipo e
executa o JavaScript que sobra. Sem flag, sem transpilador.

### 2. Criar o projeto

```bash
npm init -y
```

### 3. Ativar ESM e definir os scripts

Abra o `package.json` e ajuste:

```json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node src/server.ts"
  }
}
```

`"type": "module"` é obrigatório — sem ele o projeto é CommonJS e entra em conflito com
`module: nodenext` do `tsconfig`.

### 4. Instalar as dependências

```bash
npm install express
npm install -D typescript @types/node @types/express
```

- `typescript` → só para o `tsc --noEmit`; não participa da execução
- `@types/node`, `@types/express` → tipos das libs, usados apenas na checagem

### 5. Criar o `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

Cuidados comuns que quebram aqui:

- `rootDir` / `outDir` têm que ser **relativos** (`./src`), não `/src` — barra no começo aponta
  para a raiz do disco.
- Sem `"include"`, o `tsc` varre a pasta inteira e reclama de qualquer `.ts` fora de `src/`.

### 6. Criar a estrutura e o servidor

```
src/
  server.ts
```

`src/server.ts`:

```ts
import express from "express"

const app = express()
app.use(express.json())

app.get("/", (_req, res) => {
  res.json({ status: "ok" })
})

app.listen(5000, () => {
  console.log("http://localhost:5000")
})
```

### 7. Rodar e validar

```bash
npm run dev        # sobe o servidor; --watch reinicia ao salvar
npm run typecheck  # confere os tipos (outro terminal, ou antes de commitar)
```

Acesse `http://localhost:5000/` — se responder `{"status":"ok"}`, está funcionando.

---

## Os flags do `tsconfig.json`

| Flag | Para quê |
|---|---|
| `module` / `moduleResolution: nodenext` | Faz o `tsc` seguir o campo `type` do `package.json` e as regras reais de resolução do Node. |
| `verbatimModuleSyntax` | Erro de compilação se ESM e CommonJS se misturarem; imports usados só como tipo têm que ser marcados com `import type`. |
| `erasableSyntaxOnly` | Bloqueia sintaxe que o Node nativo não executa: `enum`, `namespace` com valor, decorators, parameter properties (`constructor(private x)`). |
| `allowImportingTsExtensions` | Permite escrever a extensão no import (`"./router/user_router.ts"`) — necessário no modo nativo com ESM. |
| `rewriteRelativeImportExtensions` | No `npm run build`, reescreve `./x.ts` → `./x.js` no JavaScript gerado. |
| `esModuleInterop` | Deixa `import express from "express"` funcionar com libs CommonJS. |
| `skipLibCheck` | Pula a checagem dos `.d.ts` de terceiros; acelera o `typecheck`. |
| `strict` | Liga todas as checagens rígidas de tipo. |

---

## Regras do modo nativo no dia a dia

1. **Imports relativos precisam da extensão:**
   `import UserRouter from "./router/user_router.ts"` — não `"./router/user_router"`.

2. **Sintaxe proibida** (o `erasableSyntaxOnly` avisa antes de o Node quebrar):
   `enum`, `namespace` com valor, decorators (`@Controller`), parameter properties.
   Se precisar disso, troque `node --watch` por `tsx watch` e ajuste o `tsconfig`.

3. **O código roda mesmo com erro de tipo.** O Node só apaga os tipos, não os valida.
   Por isso o `npm run typecheck` tem que rodar no CI.

---

## Scripts

```bash
npm run dev        # node --watch src/server.ts — desenvolvimento
npm run typecheck  # tsc --noEmit — valida os tipos, não gera nada
npm run build      # tsc — compila para dist/ (opcional)
npm start          # node src/server.ts — execução direta
```

---

## Entendendo o código: `req.params.id` no Express 5

### O que está acontecendo

Quando alguém acessa um endereço tipo `meusite.com/usuarios/7`, aquele `7` é uma informação que
vem grudada no endereço. O programa guarda isso numa "gaveta" chamada `req.params.id`.

O problema é que o que vem do endereço **sempre chega como texto**, nunca como número. Chega o
texto `"7"`, não o número `7`. E texto e número são coisas diferentes para o computador: com o
número 7 dá pra fazer conta, com o texto `"7"` não.

Por isso se usa `parseInt()` — pense nele como uma **maquininha que converte texto em número**.
Você enfia o papelzinho escrito "7" nela e sai o número 7.

### Onde a coisa quebra

Essa maquininha é chata: ela só aceita **um papelzinho por vez**. Se você tentar enfiar um maço
de papéis, ela trava.

Aí entra o detalhe: no Express 5 (este projeto usa `express ^5.2.1`), a gaveta `req.params.id`
passou a poder guardar **ou um papelzinho, ou um maço de papéis**. Isso porque a versão nova
permite endereços mais complicados, onde o mesmo nome aparece várias vezes e vira uma lista.

Dá pra ver isso na própria definição de tipos do Express:

```ts
// node_modules/@types/express-serve-static-core/index.d.ts
export interface ParamsDictionary {
    [key: string]: string | string[];
    [key: number]: string;
}
```

No Express 4 ali era só `string`, por isso o mesmo código funcionava antes.

### A solução

É preciso avisar o TypeScript: *"nessa rota aqui o `id` é sempre um papelzinho só, nunca um
maço."*

Isso se faz com o pedacinho `<{ id: string }>`, que é um bilhete colado na função dizendo "aqui
dentro, `id` é texto simples":

```ts
get_user(req: Request<{ id: string }>, res: Response){
    const id = parseInt(req.params.id)
    // ...
}
```

E o TypeScript **está certo em confiar** no bilhete, porque quando a rota for registrada como
`/:id`, o endereço realmente só pode trazer um valor ali.

Nada muda em como o programa funciona — só se tirou uma dúvida que o compilador tinha.
