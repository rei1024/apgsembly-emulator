
/**
 * ```
 * to = to + from
 * from = 0
 * ```
 * @param {number} from
 * @param {number} to
 */
 function move_u(from, to) {
    return [
        while_non_zero(tdec_u(from), [
            inc_u(to)
        ])
    ]
}

function set_b2dx_to_zero() {
    return while_non_zero(tdec_b2dx(), [])
}

const TEMP = 2;
const WIDTH = 0;
const HEIGHT = 1;

const DATA = 0;

main = [
    while_non_zero(tdec_u(HEIGHT), [
        while_non_zero(tdec_u(WIDTH), [
            if_non_zero(read_b(DATA), [
                set_b2d()
            ], [
            ]),
            inc_b(DATA),
            inc_b2dx(),
            inc_u(TEMP)
        ]),
        move_u(TEMP, WIDTH),
        inc_b2dy(),
        set_b2dx_to_zero()
    ])
]

// headers = [
//     '#COMPONENTS U0',
//     '#REGISTERS { "U0": 3, "U1": 3, "B0": [0, "101010101"] }'
// ]

/**
 *
 * @param {(0 | 1)[][]} array
 * @returns {string[]}
 */
function createHeaderFromArray(array) {
    const height = array.length;
    const width = array[0]?.length ?? 0;
    return  [
        `#REGISTERS { "U0": ${width}, "U1": ${height}, "B0": [0, "${array.flat().join('')}"] }`
    ]
}

class Complex {
    /**
     *
     * @param {number} r
     * @param {number} i
     */
    constructor(r, i) {
        this.r = r;
        this.i = i;
    }

    /**
     *
     * @param {Complex} other
     * @returns {Complex}
     */
    mul(other) {
        return new Complex(
            this.r * other.r - this.i * other.i,
            this.r * other.i + this.i * other.r,
        );
    }

    /**
     *
     * @param {Complex} other
     * @returns {Complex}
     */
    add(other) {
        return new Complex(this.r + other.r, this.i + other.i);
    }

    /**
     *
     * @returns {number}
     */
    abs() {
        const sqrt = Math.sqrt(this.r ** 2, this.i ** 2);
        if (isNaN(sqrt)) {
            return Infinity
        }
        return sqrt;
    }
}

/**
 *
 * @param {number} start1
 * @param {number} end1
 * @param {number} start2
 * @param {number} end2
 * @param {number} value
 */
function mapping(start1, end1, start2, end2, value) {
    return (value / (end1 - start1)) * (end2 - start2) + start2;
}

/**
 * @returns {(0 | 1)[][]}
 */
function makeMandelbrot() {
    const N = 300;
    return Array(N).fill(undefined).map((_, i) => {
        return Array(N).fill(undefined).map((_, j) => {
            const x = mapping(0, N - 1, -2, 2, j);
            const y = mapping(0, N - 1, -2, 2, i);
            const c = new Complex(x, y);
            let acc = new Complex(0, 0);
            for (let i = 0; i < 100; i++) {
                acc = acc.mul(acc).add(c);
            }
            return acc.abs() > 2 ? 0 : 1;
        });
    });
}

headers = createHeaderFromArray(makeMandelbrot())
