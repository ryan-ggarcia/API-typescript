# API-typescript

## Como configurar o TypeScript

### 1. Iniciar o projeto

```bash
npm init -y
```

### 2. Instalar as dependências

```bash
npm install -D typescript ts-node @types/node
```

- `typescript` — compilador
- `ts-node` — roda arquivos `.ts` sem compilar antes
- `@types/node` — tipos do Node (fs, path, process...)

### 3. Criar o `tsconfig.json`

```bash
npx tsc --init
```

Ajuste as opções principais:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

- `rootDir` — onde fica o código `.ts`
- `outDir` — onde o JavaScript compilado é gerado
- `strict` — ativa a checagem de tipos rigorosa

### 4. Criar a pasta do código

```
src/
  server.ts
```

### 5. Adicionar os scripts no `package.json`

```json
"scripts": {
  "dev": "ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### 6. Ignorar a pasta compilada no `.gitignore`

```
node_modules/
dist/
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Roda o projeto em desenvolvimento |
| `npm run build` | Compila `src/` para `dist/` |
| `npm start` | Roda o código já compilado |

## Erro no `req.params.id` (Express 5)

```
error TS2345: Argument of type 'string | string[]'
is not assignable to parameter of type 'string'.
```

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