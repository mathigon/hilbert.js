'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// =============================================================================
// Hilbert.js | Expression Errors
// (c) Mathigon
// =============================================================================
/** Expression Error Class */
class ExprError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
    // ---------------------------------------------------------------------------
    // Eval Errors
    static undefinedVariable(x) {
        return new ExprError('EvalError', `Undefined variable “${x}”.`);
    }
    static undefinedFunction(x) {
        return new ExprError('EvalError', `Undefined function “${x}”.`);
    }
    // ---------------------------------------------------------------------------
    // Syntax Errors
    static invalidCharacter(x) {
        return new ExprError('SyntaxError', `Unknown symbol “${x}”.`);
    }
    static conflictingBrackets(x) {
        return new ExprError('SyntaxError', `Conflicting brackets “${x}”.`);
    }
    static unclosedBracket(x) {
        return new ExprError('SyntaxError', `Unclosed bracket “${x}”.`);
    }
    static startOperator(x) {
        return new ExprError('SyntaxError', `A term cannot start with a “${x}”.`);
    }
    static endOperator(x) {
        return new ExprError('SyntaxError', `A term cannot end with a “${x}”.`);
    }
    static consecutiveOperators(x, y) {
        return new ExprError('SyntaxError', `A “${x}” cannot be followed by a “${y}”.`);
    }
    static invalidExpression() {
        return new ExprError('SyntaxError', `This expression is invalid.`);
    }
}

// =============================================================================
/** Checks if x is strictly equal to any one of the following arguments. */
function isOneOf(x, ...values) {
    return values.includes(x);
}
/**
 * Function wrapper that modifies a function to cache its return values. This
 * is useful for performance intensive functions which are called repeatedly
 * with the same arguments. However it can reduce performance for functions
 * which are always called with different arguments. Note that argument
 * comparison doesn't not work with Objects or nested arrays.
 */
function cache(fn) {
    let cached = new Map();
    return function (...args) {
        let argString = args.join('--');
        if (!cached.has(argString))
            cached.set(argString, fn(...args));
        return cached.get(argString);
    };
}

// =============================================================================
/** Returns the last item in an array, or the ith item from the end. */
function last(array, i = 0) {
    return array[array.length - 1 - i];
}
/** Filters all duplicate elements from an array. */
function unique(array) {
    return array.filter((a, i) => array.indexOf(a) === i);
}
/** Flattens a nested array into a single list. */
function flatten(array) {
    return array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}
/** Join multiple Arrays */
function join(...arrays) {
    return arrays.reduce((a, x) => a.concat(x), []);
}

// =============================================================================
/** Splits a string into space separated words. */
function words(str, divider = /\s+/) {
    if (!str)
        return [];
    return str.trim().split(divider);
}

// ============================================================================
// Fermat.js | Utility Functions
// (c) Mathigon
// ============================================================================
const PRECISION = 0.000001;
// -----------------------------------------------------------------------------
// Checks and Comparisons
/** Checks if two numbers are nearly equals. */
function nearlyEquals(x, y, t = PRECISION) {
    if (isNaN(x) || isNaN(y))
        return false;
    return Math.abs(x - y) < t;
}

// =============================================================================
// Core.ts | Utility Functions
// (c) Mathigon
// =============================================================================
/** Creates a random UID string of a given length. */
function uid(n = 10) {
    return Math.random().toString(36).substr(2, n);
}

// =============================================================================
// Core.ts | Array Functions
// (c) Mathigon
// =============================================================================
/** Creates an array of size `n`, containing `value` at every entry. */
function repeat(value, n) {
    return new Array(n).fill(value);
}
/** Creates a matrix of size `x` by `y`, containing `value` at every entry. */
function repeat2D(value, x, y) {
    const result = [];
    for (let i = 0; i < x; ++i) {
        result.push(repeat(value, y));
    }
    return result;
}
/**
 * Creates a matrix of size `x` by `y`, with the result of `fn(i, j)` at
 * position (i, j.
 */
function tabulate2D(fn, x, y) {
    const result = [];
    for (let i = 0; i < x; ++i) {
        const row = [];
        for (let j = 0; j < y; ++j) {
            row.push(fn(i, j));
        }
        result.push(row);
    }
    return result;
}
/** Creates an array of numbers from 0 to a, or from a to b. */
function list(a, b, step = 1) {
    const arr = [];
    if (b === undefined && a >= 0) {
        for (let i = 0; i < a; i += step)
            arr.push(i);
    }
    else if (b === undefined) {
        for (let i = 0; i > a; i -= step)
            arr.push(i);
    }
    else if (a <= b) {
        for (let i = a; i <= b; i += step)
            arr.push(i);
    }
    else {
        for (let i = a; i >= b; i -= step)
            arr.push(i);
    }
    return arr;
}
/** Finds the sum of all elements in an numeric array. */
function total(array) {
    return array.reduce((t, v) => t + v, 0);
}

// =============================================================================
var Matrix;
(function (Matrix) {
    // ---------------------------------------------------------------------------
    // Constructors
    /** Fills a matrix of size x, y with a given value. */
    function fill(value, x, y) {
        return repeat2D(value, x, y);
    }
    Matrix.fill = fill;
    /** Returns the identity matrix of size n. */
    function identity(n = 2) {
        const x = fill(0, n, n);
        for (let i = 0; i < n; ++i)
            x[i][i] = 1;
        return x;
    }
    Matrix.identity = identity;
    function rotation(angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return [[cos, -sin], [sin, cos]];
    }
    Matrix.rotation = rotation;
    function shear(lambda) {
        return [[1, lambda], [0, 1]];
    }
    Matrix.shear = shear;
    function reflection(angle) {
        const sin = Math.sin(2 * angle);
        const cos = Math.cos(2 * angle);
        return [[cos, sin], [sin, -cos]];
    }
    Matrix.reflection = reflection;
    // ---------------------------------------------------------------------------
    // Matrix Operations
    /** Calculates the sum of two or more matrices. */
    function sum(...matrices) {
        const [M1, ...rest] = matrices;
        const M2 = rest.length > 1 ? sum(...rest) : rest[0];
        if (M1.length !== M2.length || M1[0].length !== M2[0].length)
            throw new Error('Matrix sizes don’t match');
        const S = [];
        for (let i = 0; i < M1.length; ++i) {
            const row = [];
            for (let j = 0; j < M1[i].length; ++j) {
                row.push(M1[i][j] + M2[i][j]);
            }
            S.push(row);
        }
        return S;
    }
    Matrix.sum = sum;
    /** Multiplies a matrix M by a scalar v. */
    function scalarProduct(M, v) {
        return M.map(row => row.map((x, i) => x * v));
    }
    Matrix.scalarProduct = scalarProduct;
    /** Calculates the matrix product of multiple matrices. */
    function product(...matrices) {
        let [M1, ...rest] = matrices;
        let M2 = rest.length > 1 ? product(...rest) : rest[0];
        if (M1[0].length !== M2.length)
            throw new Error('Matrix sizes don’t match.');
        let P = [];
        for (let i = 0; i < M1.length; ++i) {
            let row = [];
            for (let j = 0; j < M2[0].length; ++j) {
                let value = 0;
                for (let k = 0; k < M2.length; ++k) {
                    value += M1[i][k] * M2[k][j];
                }
                row.push(value);
            }
            P.push(row);
        }
        return P;
    }
    Matrix.product = product;
    // ---------------------------------------------------------------------------
    // Matrix Properties
    /** Calculates the transpose of a matrix M. */
    function transpose(M) {
        let T = [];
        for (let j = 0; j < M[0].length; ++j) {
            let row = [];
            for (let i = 0; i < M.length; ++i) {
                row.push(M[i][j]);
            }
            T.push(row);
        }
        return T;
    }
    Matrix.transpose = transpose;
    /** Calculates the determinant of a matrix M. */
    function determinant(M) {
        if (M.length !== M[0].length)
            throw new Error('Not a square matrix.');
        let n = M.length;
        // Shortcuts for small n
        if (n === 1)
            return M[0][0];
        if (n === 2)
            return M[0][0] * M[1][1] - M[0][1] * M[1][0];
        let det = 0;
        for (let j = 0; j < n; ++j) {
            let diagLeft = M[0][j];
            let diagRight = M[0][j];
            for (let i = 1; i < n; ++i) {
                diagRight *= M[i][j + i % n];
                diagLeft *= M[i][j - i % n];
            }
            det += diagRight - diagLeft;
        }
        return det;
    }
    Matrix.determinant = determinant;
    /** Calculates the inverse of a matrix M. */
    function inverse(M) {
        // Perform Gaussian elimination:
        // (1) Apply the same operations to both I and C.
        // (2) Turn C into the identity, thereby turning I into the inverse of C.
        let n = M.length;
        if (n !== M[0].length)
            throw new Error('Not a square matrix.');
        let I = identity(n);
        let C = tabulate2D((x, y) => M[x][y], n, n); // Copy of original matrix
        for (let i = 0; i < n; ++i) {
            // Loop over the elements e in along the diagonal of C.
            let e = C[i][i];
            // If e is 0, we need to swap this row with a lower row.
            if (!e) {
                for (let ii = i + 1; ii < n; ++ii) {
                    if (C[ii][i] !== 0) {
                        for (let j = 0; j < n; ++j) {
                            [C[ii][j], C[i][j]] = [C[i][j], C[ii][j]];
                            [I[ii][j], I[i][j]] = [I[i][j], I[ii][j]];
                        }
                        break;
                    }
                }
                e = C[i][i];
                if (!e)
                    throw new Error('Matrix not invertible.');
            }
            // Scale row by e, so that we have a 1 on the diagonal.
            for (let j = 0; j < n; ++j) {
                C[i][j] = C[i][j] / e;
                I[i][j] = I[i][j] / e;
            }
            // Subtract a multiple of this row from all other rows,
            // so that they end up having 0s in this column.
            for (let ii = 0; ii < n; ++ii) {
                if (ii === i)
                    continue;
                let f = C[ii][i];
                for (let j = 0; j < n; ++j) {
                    C[ii][j] -= f * C[i][j];
                    I[ii][j] -= f * I[i][j];
                }
            }
        }
        return I;
    }
    Matrix.inverse = inverse;
})(Matrix || (Matrix = {}));

// ============================================================================
var Random;
(function (Random) {
    /** Randomly shuffles the elements in an array a. */
    function shuffle(a) {
        a = a.slice(0); // create copy
        for (let i = a.length - 1; i > 0; --i) {
            let j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    Random.shuffle = shuffle;
    /** Generates a random integer between 0 and a, or between a and b. */
    function integer(a, b) {
        let start = (b === undefined ? 0 : a);
        let length = (b === undefined ? a : b - a + 1);
        return start + Math.floor(length * Math.random());
    }
    Random.integer = integer;
    /** Chooses a random index value from weights [2, 5, 3] */
    function weighted(weights) {
        const x = Math.random() * total(weights);
        let cum = 0;
        return weights.findIndex((w) => (cum += w) >= x);
    }
    Random.weighted = weighted;
    // ---------------------------------------------------------------------------
    // Smart Random Number Generators
    const SMART_RANDOM_CACHE = new Map();
    /**
     * Returns a random number between 0 and n, but avoids returning the same
     * number multiple times in a row.
     */
    function smart(n, id) {
        if (!id)
            id = uid();
        if (!SMART_RANDOM_CACHE.has(id))
            SMART_RANDOM_CACHE.set(id, repeat(1, n));
        const cache = SMART_RANDOM_CACHE.get(id);
        const x = weighted(cache.map(x => x * x));
        cache[x] -= 1;
        if (cache[x] <= 0)
            SMART_RANDOM_CACHE.set(id, cache.map(x => x + 1));
        return x;
    }
    Random.smart = smart;
    // ---------------------------------------------------------------------------
    // Probability Distribution
    /** Generates a Bernoulli random variable. */
    function bernoulli(p = 0.5) {
        return (Math.random() < p ? 1 : 0);
    }
    Random.bernoulli = bernoulli;
    /** Generates a Binomial random variable. */
    function binomial(n = 1, p = 0.5) {
        let t = 0;
        for (let i = 0; i < n; ++i)
            t += bernoulli(p);
        return t;
    }
    Random.binomial = binomial;
    /** Generates a Poisson random variable. */
    function poisson(l = 1) {
        if (l <= 0)
            return 0;
        const L = Math.exp(-l);
        let p = 1;
        let k = 0;
        for (; p > L; ++k)
            p *= Math.random();
        return k - 1;
    }
    Random.poisson = poisson;
    /** Generates a uniform random variable. */
    function uniform(a = 0, b = 1) {
        return a + (b - a) * Math.random();
    }
    Random.uniform = uniform;
    /** Generates a normal random variable with mean m and variance v. */
    function normal(m = 0, v = 1) {
        const u1 = Math.random();
        const u2 = Math.random();
        const rand = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return rand * Math.sqrt(v) + m;
    }
    Random.normal = normal;
    /** Generates an exponential random variable. */
    function exponential(l = 1) {
        return l <= 0 ? 0 : -Math.log(Math.random()) / l;
    }
    Random.exponential = exponential;
    /** Generates a geometric random variable. */
    function geometric(p = 0.5) {
        if (p <= 0 || p > 1)
            return undefined;
        return Math.floor(Math.log(Math.random()) / Math.log(1 - p));
    }
    Random.geometric = geometric;
    /** Generates an Cauchy random variable. */
    function cauchy() {
        let rr, v1, v2;
        do {
            v1 = 2 * Math.random() - 1;
            v2 = 2 * Math.random() - 1;
            rr = v1 * v1 + v2 * v2;
        } while (rr >= 1);
        return v1 / v2;
    }
    Random.cauchy = cauchy;
    // ---------------------------------------------------------------------------
    // PDFs and CDFs
    /** Generates pdf(x) for the normal distribution with mean m and variance v. */
    function normalPDF(x, m = 1, v = 0) {
        return Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
    }
    Random.normalPDF = normalPDF;
    const G = 7;
    const P = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];
    function gamma(z) {
        if (z < 0.5)
            return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
        z -= 1;
        let x = P[0];
        for (let i = 1; i < G + 2; i++)
            x += P[i] / (z + i);
        let t = z + G + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }
    /** Riemann-integrates fn(x) from xMin to xMax with an interval size dx. */
    function integrate(fn, xMin, xMax, dx = 1) {
        let result = 0;
        for (let x = xMin; x < xMax; x += dx) {
            result += (fn(x) * dx || 0);
        }
        return result;
    }
    Random.integrate = integrate;
    /** The chi CDF function. */
    function chiCDF(chi, deg) {
        let int = integrate(t => Math.pow(t, (deg - 2) / 2) * Math.exp(-t / 2), 0, chi);
        return 1 - int / Math.pow(2, deg / 2) / gamma(deg / 2);
    }
    Random.chiCDF = chiCDF;
})(Random || (Random = {}));

// =============================================================================
var Regression;
(function (Regression) {
    /**
     * Finds a linear regression that best approximates a set of data. The result
     * will be an array [c, m], where y = m * x + c.
     */
    function linear(data, throughOrigin = false) {
        let sX = 0, sY = 0, sXX = 0, sXY = 0;
        const len = data.length;
        for (let n = 0; n < len; n++) {
            sX += data[n][0];
            sY += data[n][1];
            sXX += data[n][0] * data[n][0];
            sXY += data[n][0] * data[n][1];
        }
        if (throughOrigin) {
            const gradient = sXY / sXX;
            return [0, gradient];
        }
        const gradient = (len * sXY - sX * sY) / (len * sXX - sX * sX);
        const intercept = (sY / len) - (gradient * sX) / len;
        return [intercept, gradient];
    }
    Regression.linear = linear;
    /**
     * Finds an exponential regression that best approximates a set of data. The
     * result will be an array [a, b], where y = a * e^(bx).
     */
    function exponential(data) {
        const sum = [0, 0, 0, 0, 0, 0];
        for (const d of data) {
            sum[0] += d[0];
            sum[1] += d[1];
            sum[2] += d[0] * d[0] * d[1];
            sum[3] += d[1] * Math.log(d[1]);
            sum[4] += d[0] * d[1] * Math.log(d[1]);
            sum[5] += d[0] * d[1];
        }
        const denominator = (sum[1] * sum[2] - sum[5] * sum[5]);
        const a = Math.exp((sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
        const b = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;
        return [a, b];
    }
    Regression.exponential = exponential;
    /**
     * Finds a logarithmic regression that best approximates a set of data. The
     * result will be an array [a, b], where y = a + b * log(x).
     */
    function logarithmic(data) {
        const sum = [0, 0, 0, 0];
        const len = data.length;
        for (const d of data) {
            sum[0] += Math.log(d[0]);
            sum[1] += d[1] * Math.log(d[0]);
            sum[2] += d[1];
            sum[3] += Math.pow(Math.log(d[0]), 2);
        }
        const b = (len * sum[1] - sum[2] * sum[0]) /
            (len * sum[3] - sum[0] * sum[0]);
        const a = (sum[2] - b * sum[0]) / len;
        return [a, b];
    }
    Regression.logarithmic = logarithmic;
    /**
     * Finds a power regression that best approximates a set of data. The result
     * will be an array [a, b], where y = a * x^b.
     */
    function power(data) {
        const sum = [0, 0, 0, 0];
        const len = data.length;
        for (const d of data) {
            sum[0] += Math.log(d[0]);
            sum[1] += Math.log(d[1]) * Math.log(d[0]);
            sum[2] += Math.log(d[1]);
            sum[3] += Math.pow(Math.log(d[0]), 2);
        }
        const b = (len * sum[1] - sum[2] * sum[0]) /
            (len * sum[3] - sum[0] * sum[0]);
        const a = Math.exp((sum[2] - b * sum[0]) / len);
        return [a, b];
    }
    Regression.power = power;
    /**
     * Finds a polynomial regression of given `order` that best approximates a set
     * of data. The result will be an array giving the coefficients of the
     * resulting polynomial.
     */
    function polynomial(data, order = 2) {
        // X = [[1, x1, x1^2], [1, x2, x2^2], [1, x3, x3^2]
        // y = [y1, y2, y3]
        let X = data.map(d => list(order + 1).map(p => Math.pow(d[0], p)));
        let XT = Matrix.transpose(X);
        let y = data.map(d => [d[1]]);
        let XTX = Matrix.product(XT, X); // XT*X
        let inv = Matrix.inverse(XTX); // (XT*X)^(-1)
        let r = Matrix.product(inv, XT, y); // (XT*X)^(-1) * XT * y
        return r.map(x => x[0]); // Flatten matrix
    }
    Regression.polynomial = polynomial;
    // ---------------------------------------------------------------------------
    // Regression Coefficient
    /**
     * Finds the regression coefficient of a given data set and regression
     * function.
     */
    function coefficient(data, fn) {
        let total = data.reduce((sum, d) => sum + d[1], 0);
        let mean = total / data.length;
        // Sum of squares of differences from the mean in the dependent variable
        let ssyy = data.reduce((sum, d) => sum + (d[1] - mean) ** 2, 0);
        // Sum of squares of residuals
        let sse = data.reduce((sum, d) => sum + (d[1] - fn(d[0])) ** 2, 0);
        return 1 - (sse / ssyy);
    }
    Regression.coefficient = coefficient;
    const types = [{
            name: 'linear',
            regression: linear,
            fn: (p, x) => p[0] + x * p[1]
        }, {
            name: 'quadratic',
            regression: polynomial,
            fn: (p, x) => p[0] + x * p[1] + x * x * p[2]
        }, {
            name: 'cubic',
            regression: (data) => polynomial(data, 3),
            fn: (p, x) => p[0] + x * p[1] + x * x * p[2] + x * x * x *
                p[3]
        }, {
            name: 'exponential',
            regression: exponential,
            fn: (p, x) => p[0] * Math.pow(Math.E, p[1] * x)
        }];
    /** Finds the most suitable regression for a given dataset. */
    function find(data, threshold = 0.9) {
        if (data.length > 1) {
            for (const t of types) {
                const params = t.regression(data);
                const fn = t.fn.bind(undefined, params);
                const coeff = coefficient(data, fn);
                if (coeff > threshold)
                    return { type: t.name, fn, params, coeff };
            }
        }
        return { type: undefined, fn: () => { }, params: [], coeff: undefined };
    }
    Regression.find = find;
})(Regression || (Regression = {}));

// =============================================================================
// Hilbert.js | Symbols
// (c) Mathigon
// =============================================================================
const CONSTANTS = {
    pi: Math.PI,
    π: Math.PI,
    e: Math.E
};
const BRACKETS = {
    '(': ')',
    '[': ']',
    '{': '}',
    '|': '|'
};
const SPECIAL_OPERATORS = {
    '*': '·',
    '**': '∗',
    '//': '//',
    '+-': '±',
    '–': '−',
    '-': '−',
    xx: '×',
    sum: '∑',
    prod: '∏',
    int: '∫',
    del: '∂',
    grad: '∇',
    aleph: 'ℵ',
    not: '¬',
    AA: '∀',
    EE: '∃',
    '\'': '’',
    '!=': '≠',
    '<=': '≤',
    '>=': '≥',
    in: '∈',
    '!in': '∉',
    '==': '≡',
    '~=': '≅',
    '~~': '≈',
    sub: '⊂',
    sube: '⊆',
    prop: '∝',
    oo: '∞',
    '<-': '←',
    '->': '→',
    '=>': '⇒',
    '<=>': '⇔',
    '|->': '↦',
    uarr: '↑',
    darr: '↓',
    lArr: '⇐',
    CC: 'ℂ',
    NN: 'ℕ',
    QQ: 'ℚ',
    RR: 'ℝ',
    ZZ: 'ℤ'
};
const SPECIAL_IDENTIFIERS = {
    Gamma: 'Γ',
    Delta: 'Δ',
    Theta: 'Θ',
    Lambda: 'Λ',
    Xi: 'Ξ',
    Pi: 'Π',
    Sigma: 'Σ',
    Phi: 'Φ',
    Psi: 'Ψ',
    Omega: 'Ω',
    alpha: 'α',
    beta: 'β',
    gamma: 'γ',
    delta: 'δ',
    epsilon: 'ɛ',
    zeta: 'ζ',
    eta: 'η',
    theta: 'θ',
    iota: 'ι',
    kappa: 'κ',
    lambda: 'λ',
    mu: 'μ',
    nu: 'ν',
    xi: 'ξ',
    pi: 'π',
    rho: 'ρ',
    sigma: 'σ',
    tau: 'τ',
    upsilon: 'υ',
    phi: 'φ',
    chi: 'χ',
    psi: 'ψ',
    omega: 'ω'
};
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const LOWERCASE = ALPHABET.split('');
const UPPERCASE = ALPHABET.toUpperCase().split('');
const GREEK = Object.values(SPECIAL_IDENTIFIERS);
const IDENTIFIER_SYMBOLS = [...LOWERCASE, ...UPPERCASE, ...GREEK, '$'];
const SIMPLE_SYMBOLS = '|()[]{}÷,!<>=*/+-–−~^_…°•∥⊥\'∠:%∼△';
const COMPLEX_SYMBOLS = Object.values(SPECIAL_OPERATORS);
const OPERATOR_SYMBOLS = [...SIMPLE_SYMBOLS, ...COMPLEX_SYMBOLS];
const ESCAPES = {
    '<': '&lt;',
    '>': '&gt;'
};
function escape(char) {
    return (char in ESCAPES) ? ESCAPES[char] : char;
}
const SPECIAL = new Set(['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'arcsin',
    'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'sech', 'csch', 'coth', 'exp',
    'log', 'ln', 'det', 'dim', 'mod', 'gcd', 'lcm', 'min', 'max']);
function isSpecialFunction(fn) {
    return SPECIAL.has(fn);
}
const VOICE_STRINGS = {
    '+': 'plus',
    '−': 'minus',
    '·': 'times',
    '×': 'times',
    '/': 'over',
    '//': 'divided by',
    '%': 'percent',
    '!': 'factorial',
    '±': 'plus-minus',
    '=': 'equals',
    '≠': 'does not equal',
    '<': 'is less than',
    '>': 'is greater than',
    '≤': 'is less than or equal to',
    '≥': 'is greater than or equal to',
    'π': 'pi'
};

// =============================================================================
/**
 * Maths Expression
 */
class ExprElement {
    /** Evaluates an expression using a given map of variables and functions. */
    evaluate(vars = {}) { return NaN; }
    /** Substitutes a new expression for a variable. */
    substitute(vars = {}) { return this; }
    /** Returns the simplest mathematically equivalent expression. */
    get simplified() { return this; }
    /** Returns a list of all variables used in the expression. */
    get variables() { return []; }
    /** Returns a list of all functions called by the expression. */
    get functions() { return []; }
    /** Collapses all terms into functions. */
    collapse() { return this; }
    /** Converts the expression to a plain text string. */
    toString() { return ''; }
    /** Converts the expression to a MathML string. */
    toVoice(custom = {}) { return ''; }
    /** Converts the expression to a MathML string. */
    toMathML(custom = {}) { return ''; }
}
// -----------------------------------------------------------------------------
class ExprNumber extends ExprElement {
    constructor(n) {
        super();
        this.n = n;
    }
    evaluate() { return this.n; }
    toString() { return '' + this.n; }
    toVoice() { return '' + this.n; }
    toMathML() { return `<mn>${this.n}</mn>`; }
}
class ExprIdentifier extends ExprElement {
    constructor(i) {
        super();
        this.i = i;
    }
    evaluate(vars = {}) {
        if (this.i in vars)
            return vars[this.i];
        if (this.i in CONSTANTS)
            return CONSTANTS[this.i];
        throw ExprError.undefinedVariable(this.i);
    }
    toMathML() {
        const variant = isSpecialFunction(this.i) ? ' mathvariant="normal"' : '';
        return `<mi${variant}>${this.i}</mi>`;
    }
    substitute(vars = {}) { return vars[this.i] || this; }
    get variables() { return [this.i]; }
    toString() { return this.i; }
    toVoice(custom = {}) {
        return (this.i in custom) ? custom[this.i] : VOICE_STRINGS[this.i] || this.i;
    }
}
class ExprString extends ExprElement {
    constructor(s) {
        super();
        this.s = s;
    }
    evaluate(vars = {}) {
        if (this.s in vars)
            return vars[this.s];
        throw ExprError.undefinedVariable(this.s);
    }
    toString() { return '"' + this.s + '"'; }
    toVoice() { return this.s; }
    toMathML() { return `<mtext>${this.s}</mtext>`; }
}
class ExprSpace extends ExprElement {
    toString() { return ' '; }
    toMathML() { return `<mspace/>`; }
}
class ExprOperator extends ExprElement {
    constructor(o) {
        super();
        this.o = o;
    }
    toString() { return this.o.replace('//', '/'); }
    toVoice(custom = {}) {
        return (this.o in custom) ? custom[this.o] : VOICE_STRINGS[this.o] || this.o;
    }
    get functions() { return [this.o]; }
    toMathML() {
        const op = escape(this.toString());
        return `<mo value="${op}">${op}</mo>`;
    }
}

// =============================================================================
const PRECEDENCE = words('+ − * × · / ÷ // sup sub');
const COMMA = '<mo value="," lspace="0">,</mo>';
function needsBrackets(expr, parentFn) {
    if (!PRECEDENCE.includes(parentFn))
        return false;
    if (expr instanceof ExprTerm)
        return true;
    if (!(expr instanceof ExprFunction))
        return false;
    if (!PRECEDENCE.includes(expr.fn))
        return false;
    return PRECEDENCE.indexOf(parentFn) > PRECEDENCE.indexOf(expr.fn);
}
function addMFence(expr, fn, string) {
    return needsBrackets(expr, fn) ? `<mfenced>${string}</mfenced>` : string;
}
function addMRow(expr, string) {
    const needsRow = (expr instanceof ExprTerm) || (expr instanceof ExprFunction);
    return needsRow ? `<mrow>${string}</mrow>` : string;
}
class ExprFunction extends ExprElement {
    constructor(fn, args = []) {
        super();
        this.fn = fn;
        this.args = args;
    }
    evaluate(vars = {}) {
        const args = this.args.map(a => a.evaluate(vars));
        if (this.fn in vars)
            return vars[this.fn](...args);
        switch (this.fn) {
            case '+':
                return args.reduce((a, b) => a + b, 0);
            case '−':
                return (args.length > 1) ? args[0] - args[1] : -args[0];
            case '*':
            case '·':
            case '×':
                return args.reduce((a, b) => a * b, 1);
            case '/':
                return args[0] / args[1];
            case 'sin':
                return Math.sin(args[0]);
            case 'cos':
                return Math.sin(args[0]);
            case 'tan':
                return Math.sin(args[0]);
            case 'log':
                return Math.log(args[0]) / Math.log(args[1] || Math.E);
            case 'sup':
                return Math.pow(args[0], args[1]);
            case 'sqrt':
                return Math.sqrt(args[0]);
            case 'root':
                return Math.pow(args[0], 1 / args[1]);
            case '(':
                return args[0];
            // TODO Implement for all functions
        }
        throw ExprError.undefinedFunction(this.fn);
    }
    substitute(vars = {}) {
        return new ExprFunction(this.fn, this.args.map(a => a.substitute(vars)));
    }
    collapse() {
        if (this.fn === '(')
            return this.args[0].collapse();
        return new ExprFunction(this.fn, this.args.map(a => a.collapse()));
    }
    get simplified() {
        // TODO Write CAS simplification algorithms
        return this;
    }
    get variables() {
        return unique(flatten(this.args.map(a => a.variables)));
    }
    get functions() {
        return unique([this.fn, ...flatten(this.args.map(a => a.functions))]);
    }
    toString() {
        const args = this.args.map(a => needsBrackets(a, this.fn) ?
            '(' + a.toString() + ')' : a.toString());
        if (this.fn === '−')
            return args.length > 1 ? args.join(' − ') : '−' + args[0];
        if (this.fn === 'sup')
            return args.join('^');
        if (this.fn === 'sub')
            return args.join('_');
        if (words('+ * × · / = < > ≤ ≥ ≈').includes(this.fn))
            return args.join(' ' + this.fn + ' ');
        if (isOneOf(this.fn, '(', '[', '{'))
            return this.fn + this.args.join(', ') + BRACKETS[this.fn];
        if (isOneOf(this.fn, '!', '%'))
            return args[0] + this.fn;
        // TODO Implement other functions
        return `${this.fn}(${args.join(', ')})`;
    }
    toMathML(custom = {}) {
        const args = this.args.map(a => a.toMathML(custom));
        const argsF = this.args.map((a, i) => addMFence(a, this.fn, args[i]));
        if (this.fn in custom) {
            const argsX = args.map((a, i) => ({
                toString: () => a,
                val: this.args[i]
            }));
            return custom[this.fn](...argsX);
        }
        if (this.fn === '−')
            return argsF.length > 1 ?
                argsF.join('<mo value="−">−</mo>') :
                '<mo rspace="0" value="−">−</mo>' + argsF[0];
        if (isOneOf(this.fn, '+', '=', '<', '>', '≤', '≥', '≈')) {
            const fn = escape(this.fn);
            return argsF.join(`<mo value="${fn}">${fn}</mo>`);
        }
        if (isOneOf(this.fn, '*', '×', '·')) {
            let str = argsF[0];
            for (let i = 1; i < argsF.length - 1; ++i) {
                // We only show the × symbol between consecutive numbers.
                const showTimes = (this.args[0] instanceof ExprNumber &&
                    this.args[1] instanceof ExprNumber);
                str += (showTimes ? `<mo value="×">×</mo>` : '') + argsF[1];
            }
            return str;
        }
        if (this.fn === '//')
            return argsF.join(`<mo value="/">/</mo>`);
        if (this.fn === 'sqrt')
            return `<msqrt>${argsF[0]}</msqrt>`;
        if (isOneOf(this.fn, '/', 'root')) {
            // Fractions or square roots don't have brackets around their arguments
            const el = (this.fn === '/' ? 'mfrac' : 'mroot');
            const args1 = this.args.map((a, i) => addMRow(a, args[i]));
            return `<${el}>${args1.join('')}</${el}>`;
        }
        if (isOneOf(this.fn, 'sup', 'sub')) {
            // Sup and sub only have brackets around their first argument.
            const args1 = [addMRow(this.args[0], argsF[0]),
                addMRow(this.args[1], args[1])];
            return `<m${this.fn}>${args1.join('')}</m${this.fn}>`;
        }
        if (isOneOf(this.fn, '(', '[', '{'))
            return `<mfenced open="${this.fn}" close="${BRACKETS[this.fn]}">${argsF.join(COMMA)}</mfenced>`;
        if (isOneOf(this.fn, '!', '%'))
            return argsF[0] + `<mo value="${this.fn}" lspace="0">${this.fn}</mo>`;
        if (this.fn === 'abs')
            return `<mfenced open="|" close="|">${argsF.join(COMMA)}</mfenced>`;
        if (this.fn === 'bar')
            return `<mover>${addMRow(this.args[0], argsF[0])}<mo value="‾">‾</mo></mover>`;
        if (this.fn === 'vec')
            return `<mover>${addMRow(this.args[0], argsF[0])}<mo value="→">→</mo></mover>`;
        // TODO Implement other functions
        const variant = isSpecialFunction(this.fn) ? ' mathvariant="normal"' : '';
        return `<mi${variant}>${this.fn}</mi><mfenced>${argsF.join(COMMA)}</mfenced>`;
    }
    toVoice(custom = {}) {
        const args = this.args.map(a => a.toVoice(custom));
        const joined = args.join(' ');
        if (this.fn in custom && !custom[this.fn])
            return joined;
        if (isOneOf(this.fn, '(', '[', '{'))
            return `open bracket ${joined} close bracket`;
        if (this.fn === 'sqrt')
            return `square root of ${joined}`;
        if (this.fn === '%')
            return `${joined} percent`;
        if (this.fn === '!')
            return `${joined} factorial`;
        if (this.fn === '/')
            return `${args[0]} over ${args[1]}`;
        if (this.fn === '//')
            return `${args[0]} divided by ${args[1]}`;
        if (this.fn === 'sup')
            return `${args[0]} to the power of ${args[1]}`;
        if (this.fn === 'sup')
            return `${args[0]} to the power of ${args[1]}`;
        if (this.fn === 'sub')
            return joined;
        if (VOICE_STRINGS[this.fn])
            return args.join(` ${VOICE_STRINGS[this.fn]} `);
        // TODO Implement other cases
        if (isSpecialFunction(this.fn))
            return `${this.fn} ${joined}`;
        return `${this.fn} of ${joined}`;
    }
}
// -----------------------------------------------------------------------------
class ExprTerm extends ExprElement {
    constructor(items) {
        super();
        this.items = items;
    }
    evaluate(vars = {}) { return this.collapse().evaluate(vars); }
    substitute(vars = {}) { return this.collapse().substitute(vars); }
    get simplified() { return this.collapse().simplified; }
    get variables() { return unique(join(...this.items.map(i => i.variables))); }
    get functions() { return this.collapse().functions; }
    toString() { return this.items.map(i => i.toString()).join(' '); }
    toMathML(custom = {}) {
        return this.items.map(i => i.toMathML(custom)).join('');
    }
    toVoice(custom = {}) {
        return this.items.map(i => i.toVoice(custom)).join(' ');
    }
    collapse() { return collapseTerm(this.items).collapse(); }
}

// =============================================================================
// -----------------------------------------------------------------------------
// Tokenizer
var TokenType;
(function (TokenType) {
    TokenType[TokenType["UNKNOWN"] = 0] = "UNKNOWN";
    TokenType[TokenType["SPACE"] = 1] = "SPACE";
    TokenType[TokenType["STR"] = 2] = "STR";
    TokenType[TokenType["NUM"] = 3] = "NUM";
    TokenType[TokenType["VAR"] = 4] = "VAR";
    TokenType[TokenType["OP"] = 5] = "OP";
})(TokenType || (TokenType = {}));
function createToken(buffer, type) {
    if (!buffer || !type)
        return undefined;
    if (type === TokenType.SPACE && buffer.length > 1)
        return new ExprSpace();
    if (type === TokenType.STR)
        return new ExprString(buffer);
    if (type === TokenType.NUM) {
        // This can happen if users simply type ".", which get parsed as number.
        if (isNaN(+buffer))
            throw ExprError.invalidExpression();
        return new ExprNumber(+buffer);
    }
    if (type === TokenType.VAR) {
        if (buffer in SPECIAL_IDENTIFIERS) {
            return new ExprIdentifier(SPECIAL_IDENTIFIERS[buffer]);
        }
        else if (buffer in SPECIAL_OPERATORS) {
            return new ExprOperator(SPECIAL_OPERATORS[buffer]);
        }
        else {
            return new ExprIdentifier(buffer);
        }
    }
    if (type === TokenType.OP) {
        if (buffer in SPECIAL_OPERATORS) {
            return new ExprOperator(SPECIAL_OPERATORS[buffer]);
        }
        else {
            return new ExprOperator(buffer);
        }
    }
}
function tokenize(str) {
    const tokens = [];
    let buffer = '';
    let type = TokenType.UNKNOWN;
    for (let s of str) {
        // Handle Strings
        if (s === '"') {
            const newType = ((type === TokenType.STR) ?
                TokenType.UNKNOWN : TokenType.STR);
            const token = createToken(buffer, type);
            if (token)
                tokens.push(token);
            buffer = '';
            type = newType;
            continue;
        }
        else if (type === TokenType.STR) {
            buffer += s;
            continue;
        }
        const sType = s.match(/[0-9.]/) ? TokenType.NUM :
            IDENTIFIER_SYMBOLS.includes(s) ? TokenType.VAR :
                OPERATOR_SYMBOLS.includes(s) ? TokenType.OP :
                    s.match(/\s/) ? TokenType.SPACE : TokenType.UNKNOWN;
        if (!sType)
            throw ExprError.invalidCharacter(s);
        if (!type || (type === TokenType.NUM && sType !== TokenType.NUM) ||
            (type === TokenType.VAR && sType !== TokenType.VAR && sType !==
                TokenType.NUM) ||
            (type === TokenType.OP && !((buffer + s) in SPECIAL_OPERATORS)) ||
            (type === TokenType.SPACE && sType !== TokenType.SPACE)) {
            const token = createToken(buffer, type);
            if (token)
                tokens.push(token);
            buffer = '';
            type = sType;
        }
        buffer += s;
    }
    const token = createToken(buffer, type);
    if (token)
        tokens.push(token);
    return tokens;
}
// -----------------------------------------------------------------------------
// Utility Functions
function makeTerm(items) {
    if (items.length > 1)
        return new ExprTerm(items);
    if (items[0] instanceof ExprOperator)
        return new ExprTerm(items);
    return items[0];
}
function splitArray(items, check) {
    const result = [[]];
    for (let i of items) {
        if (check(i)) {
            result.push([]);
        }
        else {
            last(result).push(i);
        }
    }
    return result;
}
function isOperator(expr, fns) {
    return expr instanceof ExprOperator && words(fns).includes(expr.o);
}
function removeBrackets(expr) {
    return (expr instanceof ExprFunction && expr.fn === '(') ? expr.args[0] :
        expr;
}
function findBinaryFunction(tokens, fn, toFn) {
    if (isOperator(tokens[0], fn))
        throw ExprError.startOperator(tokens[0]);
    if (isOperator(last(tokens), fn))
        throw ExprError.endOperator(last(tokens));
    for (let i = 1; i < tokens.length - 1; ++i) {
        if (!isOperator(tokens[i], fn))
            continue;
        const token = tokens[i];
        const a = tokens[i - 1];
        const b = tokens[i + 1];
        if (a instanceof ExprOperator)
            throw ExprError.consecutiveOperators(a.o, token.o);
        if (b instanceof ExprOperator)
            throw ExprError.consecutiveOperators(token.o, b.o);
        const args = [removeBrackets(a), removeBrackets(b)];
        tokens.splice(i - 1, 3, new ExprFunction(toFn || token.o, args));
        i -= 2;
    }
}
// -----------------------------------------------------------------------------
// Match Brackets
function prepareTerm(tokens) {
    // TODO Combine sup and sub calls into a single supsub function.
    findBinaryFunction(tokens, '^', 'sup');
    findBinaryFunction(tokens, '_', 'sub');
    findBinaryFunction(tokens, '/');
    return makeTerm(tokens);
}
function matchBrackets(tokens) {
    const stack = [[]];
    for (let t of tokens) {
        const lastOpen = last(stack).length ? last(stack)[0].o :
            undefined;
        if (isOperator(t, ') ] }') || (isOperator(t, '|') && lastOpen === '|')) {
            if (!isOperator(t, BRACKETS[lastOpen]))
                throw ExprError.conflictingBrackets(t.o);
            const closed = stack.pop();
            const term = last(stack);
            // Check if this is a normal bracket, or a function call.
            // Terms like x(y) are treated as functions, rather than implicit
            // multiplication, except for π(y).
            const isFn = (isOperator(t, ')') && last(term) instanceof
                ExprIdentifier && last(term).i !== 'π');
            const fnName = isFn ? term.pop().i :
                isOperator(t, '|') ? 'abs' :
                    closed[0].o;
            // Support multiple arguments for function calls.
            const args = splitArray(closed.slice(1), a => isOperator(a, ','));
            term.push(new ExprFunction(fnName, args.map(prepareTerm)));
        }
        else if (isOperator(t, '( [ { |')) {
            stack.push([t]);
        }
        else {
            last(stack).push(t);
        }
    }
    if (stack.length > 1)
        throw ExprError.unclosedBracket(last(stack)[0].o);
    return prepareTerm(stack[0]);
}
// -----------------------------------------------------------------------------
// Collapse term items
function findAssociativeFunction(tokens, symbol, implicit = false) {
    const result = [];
    let buffer = [];
    let lastWasSymbol = false;
    function clearBuffer() {
        if (lastWasSymbol)
            throw ExprError.invalidExpression();
        if (!buffer.length)
            return;
        result.push(buffer.length > 1 ? new ExprFunction(symbol[0], buffer) : buffer[0]);
        buffer = [];
    }
    for (let t of tokens) {
        if (isOperator(t, symbol)) {
            if (lastWasSymbol || !buffer.length)
                throw ExprError.invalidExpression();
            lastWasSymbol = true;
        }
        else if (t instanceof ExprOperator) {
            clearBuffer();
            result.push(t);
            lastWasSymbol = false;
        }
        else {
            // If implicit=true, we allow implicit multiplication, except where the
            // second factor is a number. For example, "3 5" is invalid.
            const noImplicit = (!implicit || t instanceof ExprNumber);
            if (buffer.length && !lastWasSymbol &&
                noImplicit)
                throw ExprError.invalidExpression();
            buffer.push(t);
            lastWasSymbol = false;
        }
    }
    clearBuffer();
    return result;
}
function collapseTerm(tokens) {
    // Filter out whitespace.
    tokens = tokens.filter(t => !(t instanceof ExprSpace));
    if (!tokens.length)
        throw ExprError.invalidExpression();
    // Match percentage and factorial operators.
    if (isOperator(tokens[0], '%!'))
        throw ExprError.startOperator(tokens[0]);
    for (let i = 0; i < tokens.length; ++i) {
        if (!isOperator(tokens[i], '%!'))
            continue;
        tokens.splice(i - 1, 2, new ExprFunction(tokens[i].o, [tokens[i - 1]]));
        i -= 1;
    }
    // Match comparison and division operators.
    findBinaryFunction(tokens, '= < > ≤ ≥');
    findBinaryFunction(tokens, '// ÷', '/');
    // Match multiplication operators.
    tokens = findAssociativeFunction(tokens, '× * ·', true);
    // Match - and ± operators.
    if (isOperator(tokens[0], '− ±')) {
        tokens.splice(0, 2, new ExprFunction(tokens[0].o, [tokens[1]]));
    }
    findBinaryFunction(tokens, '− ±');
    // Match + operators.
    if (isOperator(tokens[0], '+'))
        tokens = tokens.slice(1);
    tokens = findAssociativeFunction(tokens, '+');
    if (tokens.length > 1)
        throw ExprError.invalidExpression();
    return tokens[0];
}

// =============================================================================
/** Parses a string to an expression. */
function parse(str, collapse = false) {
    const expr = matchBrackets(tokenize(str));
    return collapse ? expr.collapse() : expr;
}
/**
 * Checks numerically if two expressions are equal. Obviously this is not a
 * very robust solution, but much easier than the full CAS simplification.
 */
function numEquals(expr1, expr2) {
    try {
        const vars = unique([...expr1.variables, ...expr2.variables]);
        const fn1 = expr1.collapse();
        const fn2 = expr2.collapse();
        // We only test positive random numbers, because negative numbers raised
        // to non-integer powers return NaN.
        for (let i = 0; i < 5; ++i) {
            const substitution = {};
            for (let v of vars)
                substitution[v] = CONSTANTS[v] || Math.random() * 5;
            const a = fn1.evaluate(substitution);
            const b = fn2.evaluate(substitution);
            if (isNaN(a) || isNaN(b))
                continue; // This might happen in square roots.
            if (!nearlyEquals(a, b))
                return false;
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
const Expression = {
    numEquals,
    parse: cache(parse)
};

exports.ExprElement = ExprElement;
exports.ExprError = ExprError;
exports.Expression = Expression;
