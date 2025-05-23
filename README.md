# apgsembly-emulator

An emulator for [APGsembly](https://conwaylife.com/wiki/APGsembly) 2.0

## Development

### Requirements

- `deno`
  - Above v2.0
  - https://docs.deno.com/runtime/getting_started/installation/

### Usage

- `$ deno task dev` Local server
  - access to [http://localhost:1123/](http://localhost:1123/)
- `$ deno task t` Unit tests
- `$ deno task w` Unit tests with file watcher
- `$ deno task lint` Linting
- `$ deno task build` Production Build

### Structure

- `src/` an emulator for APGsembly
- `test/` unit tests
- `frontend/` UI of the emulator
- `e2e/` E2E testing

## E2E Testing

### Requirements

- `deno`
- `npm`
  - Run `$ npm install`

### Usage

- `$ deno task e2e-update` Install browsers
- `$ deno task e2e` E2E tests
