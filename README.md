# API-typescript

## Como configurar o TypeScript
## Requisitos

- Node.js 22.18+ ou 24+ (executa TypeScript nativamente)
- npm

## Instalação

```bash
npm install
```

Dependências do projeto:

```bash
npm i express
npm i -D typescript @types/node @types/express
```

> Não use `ts-node`. A última versão estável (10.9.2) é de dez/2023 e é
> incompatível com o TypeScript 7. O Node executa `.ts` direto.

## Scripts

```bash
npm run dev        # sobe o servidor com hot reload
npm run typecheck  # verifica os tipos
npm run build      # compila para dist/
npm start          # roda o build
```

```json
"type": "module",
"scripts": {
  "dev": "node --watch src/server.ts",
  "typecheck": "tsc --noEmit",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "rewriteRelativeImportExtensions": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src/**/*"]
}
```

Os flags importantes:

| Flag | Para quê |
|---|---|
| `module: nodenext` | Faz o `tsc` seguir o `type` do package.json — evita gerar CommonJS num projeto ESM |
| `verbatimModuleSyntax` | Acusa erro de compilação se ESM e CommonJS se misturarem |
| `erasableSyntaxOnly` | Bloqueia sintaxe que o Node não executa (`enum`, `namespace`, decorators) |
| `rewriteRelativeImportExtensions` | Converte `.ts` → `.js` nos imports ao compilar |

### O que está acontecendo

Quando alguém acessa um endereço tipo `meusite.com/usuarios/7`, aquele `7` é uma informação que vem grudada no endereço. O programa guarda isso numa "gaveta" chamada `req.params.id`.

O problema é que o que vem do endereço **sempre chega como texto**, nunca como número. Chega o texto `"7"`, não o número `7`. E texto e número são coisas diferentes para o computador: com o número 7 dá pra fazer conta, com o texto `"7"` não.

Por isso se usa `parseInt()` — pense nele como uma **maquininha que converte texto em número**. Você enfia o papelzinho escrito "7" nela e sai o número 7.

### Onde a coisa quebra

Essa maquininha é chata: ela só aceita **um papelzinho por vez**. Se você tentar enfiar um maço de papéis, ela trava.

Aí entra o detalhe: no Express 5 (este projeto usa `express ^5.2.1`), a gaveta `req.params.id` passou a poder guardar **ou um papelzinho, ou um maço de papéis**. Isso porque a versão nova permite endereços mais complicados, onde o mesmo nome aparece várias vezes e vira uma lista.

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

É preciso avisar o TypeScript: *"nessa rota aqui o `id` é sempre um papelzinho só, nunca um maço."*

Isso se faz com o pedacinho `<{ id: string }>`, que é um bilhete colado na função dizendo "aqui dentro, `id` é texto simples":

```ts
get_user(req: Request<{ id: string }>, res: Response){
    const id = parseInt(req.params.id)
    // ...
}
```

E o TypeScript **está certo em confiar** no bilhete, porque quando a rota for registrada como `/:id`, o endereço realmente só pode trazer um valor ali.

Nada muda em como o programa funciona — só se tirou uma dúvida que o compilador tinha.
