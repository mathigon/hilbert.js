# Hilbert.ts

[![Build Status](https://travis-ci.org/mathigon/hilbert.js.svg?branch=master)](https://travis-ci.org/mathigon/hilbert.js)
[![npm](https://img.shields.io/npm/v/@mathigon/hilbert.svg)](https://www.npmjs.com/package/@mathigon/hilbert)
[![npm](https://img.shields.io/github/license/mathigon/hilbert.js.svg)](https://github.com/mathigon/hilbert.js/blob/master/LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmathigon%2Fhilbert.js.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmathigon%2Fhilbert.js?ref=badge_shield)

Hilbert.ts is a TypeScript library for expression parsing, simplification, and
MathML rendering. It was developed for [Mathigon.org](https://mathigon.org), an
award-winning mathematics education project.


## Open Issues

* [ ] Support for functions with subscripts (e.g. `log_a(b)`).
* [ ] Support for large operators (sum, product and integral).
* [ ] Parse ^ and _ operator from right to left (e.g. `2^2^2 == 2^(2^2)`).
* [ ] CAS Expression simplification algorithms, `equals()` and `same()` methods.
* [ ] More tests, including visual tests for MathML.


## Usage

First, install Hilbert.ts from [NPM](https://www.npmjs.com/package/@mathigon/hilbert)
using

```npm install @mathigon/hilbert```

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


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmathigon%2Fhilbert.js.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmathigon%2Fhilbert.js?ref=badge_large)