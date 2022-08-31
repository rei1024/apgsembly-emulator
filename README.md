# apgsembly-emulator-2
An emulator for APGsembly 2.0

## Testing
### Requirements
* `deno`
    * https://deno.land/#installation
    * `file_server`
        * https://deno.land/std@0.153.0/http
* `npm`
    * Run `$ npm install`

### Usage
* `$ deno task up` Local server
    * access to [http://localhost:1123/](http://localhost:1123/)
* `$ deno task t` Unit tests
* `$ deno task w` Unit tests with file watcher
* `$ deno task lint` Linting
* `$ deno task cy` E2E tests
