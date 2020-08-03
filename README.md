# Hilbert.ts

Hilbert.ts is a TypeScript library for expression parsing, simplification, and
MathML rendering. It was developed for [Mathigon.org](https://mathigon.org), an
award-winning mathematics education project.

[![npm](https://img.shields.io/npm/v/@mathigon/hilbert.svg)](https://www.npmjs.com/package/@mathigon/hilbert)
[![npm](https://img.shields.io/github/license/mathigon/hilbert.js.svg)](https://github.com/mathigon/hilbert.js/blob/master/LICENSE)


## Open Issues

* [ ] Support for functions with subscripts (e.g. `log_a(b)`).
* [ ] Support for conditional probability brackets (e.g. `P(A|B)`)
* [ ] Support for large operators (sum, product and integral).
* [ ] Parse ^ and _ operator from right to left (e.g. `2^2^2 == 2^(2^2)`).
* [ ] Add `evaluate()`, `toString()` and `toMathML()` methods for many more
      special functions.
* [ ] Write CAS Expression simplification algorithms, `equals()` and `same()` methods.
* [ ] Write many more tests. Visual tests for MathML.


## Usage

First, install Hilbert.ts from [NPM](https://www.npmjs.com/package/@mathigon/hilbert)
using

```npm install @mathigon/hilbert```

We recommend using Hibert.ts together with [Rollup](https://rollupjs.org/), using
using the [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)
plugin.

Now, simply import all functions and classes you need, using

```js
import {Expression} from '@mathigon/hilbert'
```


## Contributing

We welcome community contributions: please file any bugs you find or send us
pull requests with improvements. You can find out more on
[Mathigon.io](https://mathigon.io).

Before submitting a pull request, you will need to sign the [Mathigon Individual
Contributor License Agreement](https://gist.github.com/plegner/5ad5b7be2948a4ad073c50b15ac01d39).


## Copyright and License

Copyright © Mathigon ([dev@mathigon.org](mailto:dev@mathigon.org))  
Released under the [MIT license](LICENSE)
