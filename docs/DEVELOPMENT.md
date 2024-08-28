# TG-OLLAMA — Information for developers

## Prerequisites
- [**Follow Tauri prerequisites**](https://v2.tauri.app/start/prerequisites/)
- [**Install Ollama**](https://ollama.com/download) and [**any model**](https://ollama.com/library)
- **Bun v1.1.22** and **rustc 1.82.0-nightly**

## Local development
### First install bun deps
```sh
bun install
```

### Run project in dev mode
```sh
bun dev
```
> It spins up Next.js development server on http://localhost:3000 and Tauri app in watch mode configured to listen to it

### Compile for production
```sh
bun build:prod
```
> Output is located in [core/target/release](../core/target/release/)

### Before you commit
Make sure to check code quality via running
```sh
bun lint:check
```
> You can also fix linting issues with `:fix` postfix
