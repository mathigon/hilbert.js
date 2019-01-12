# Hilbert.js

Hilbert.js is a JavaScript library for expression parsing, simplification, and
MathML rendering. It was developed for [Mathigon.org](https://mathigon.org), an
award-winning mathematics education project.

[![npm](https://img.shields.io/npm/v/@mathigon/hilbert.svg)](https://www.npmjs.com/package/@mathigon/hilbert)
[![npm](https://img.shields.io/github/license/mathigon/hilbert.js.svg)](https://github.com/mathigon/hilbert.js/blob/master/LICENSE)


## Open Issues

Note: this library is still under development, and not ready for production use.

* [ ] Write `collapseTerm()` function
* [ ] Write Function `evaluate()`, `toString()` and `toMathML()` methods
* [ ] Lots of testing
* [ ] Write Expression simplification algorithms, `equals()`, `numEquals()` and
      `same()` methods
* [ ] Remove expressions code from `fermat.js`


## Usage

First, install hilbert.js from [NPM](https://www.npmjs.com/package/@mathigon/hilbert)
using

```npm install @mathigon/hilbert --save```

Hilbert.js uses [ES6 imports](http://2ality.com/2014/09/es6-modules-final.html).
While some browsers and platforms now support this feature, we recommend using
a transpiler such as [Babel](http://babeljs.io/) or [Rollup](https://rollupjs.org/). 
Make sure that you configure your compiler to correctly resolve these imports.
For Rollup, we recommend using the
[rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)
plugin.

Now, simply import all functions and classes you need, using

```js
import { Expression } from '@mathigon/hilbert'
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
