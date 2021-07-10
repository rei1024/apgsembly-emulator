// @ts-check

/**
 * @template A
 */
export class Parser {
    /**
     * 
     * @param {(_: string) => { rest: string, value: A } | undefined} parse 
     */
    constructor(parse) {
        this.parse = parse
    }

    /**
     * @template B
     * @param {(_: A) => Parser<B>} parser 
     * @returns {Parser<B>}
     */
    andThen(parser) {
        return new Parser(str => {
            const resultA = this.parse(str);
        });
    }
}
