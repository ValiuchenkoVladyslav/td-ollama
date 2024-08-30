# TG-OLLAMA — Information for developers

## Prerequisites
- [**Follow Tauri prerequisites**](https://v2.tauri.app/start/prerequisites/)
- [**Install Ollama**](https://ollama.com/download) and [**any model**](https://ollama.com/library)
- **Bun v1.1.22** and **rustc 1.82.0-nightly**

## General information
### Project structure
It's a monorepo containing 2 parts:
- **Desktop app `apps/desktop` (Tauri + Next.js)**
- **Website `apps/website` (Next.js)**

To manage it we use [**turborepo**](https://turbo.build/repo/docs) utilizing it's powerfull caching cabapilities.

### Code quality
Code quality is checked both on your local machine and on push/pull requests on github side via [**actions**](../.github/workflows/ci.yaml).

- [**pre-commit**](../.husky/pre-commit) hook runs `lint:fix` which applies safe fixes to your code via [**Biome**](https://biomejs.dev/) for Next.js parts of application and [**clippy**](https://github.com/rust-lang/rust-clippy) for Rust Tauri part.
- [**pre-push**](../.husky/pre-push) hook runs `build:debug` which checks if your app compiles (in debug mode for Tauri and regular compilation for Next.js parts).

## Local development
### Local setup
First install bun deps
```sh
bun install
```
and then prepare git hooks via Husky
```sh
bun husky
```

### Run desktop app in dev mode
```sh
bun dev:desktop
```
It spins up Next.js dev server on http://localhost:3000 and Tauri app in watch mode configured to listen to it

### Run website in dev mode
```sh
bun dev:website
```
It just runs Next.js dev server on http://localhost:3000.

### Compile the project
```sh
bun build
```
> Compiled desktop app is located in `apps/desktop/core/target/release`

### More info
You can also utilize other commands in `package.json` files so make sure to check them for additional info.
