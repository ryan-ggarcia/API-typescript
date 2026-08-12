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