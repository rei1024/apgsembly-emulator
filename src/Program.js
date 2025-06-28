// @ts-check

import { Command, ComponentsHeader, RegistersHeader } from "./Command.js";
import { Action } from "./actions/Action.js";
import { BRegAction } from "./actions/BRegAction.js";
import { LegacyTRegAction } from "./actions/LegacyTRegAction.js";
import { URegAction } from "./actions/URegAction.js";
import { ProgramLines } from "./ProgramLines.js";
import { validateAll } from "./validate.js";
import { expandTemplate } from "./expandTemplate.js";
import { AddAction } from "./actions/AddAction.js";
import { MulAction } from "./actions/MulAction.js";
import { SubAction } from "./actions/SubAction.js";
import { B2DAction } from "./actions/B2DAction.js";
import { OutputAction } from "./actions/OutputAction.js";
import { parseComponentsHeader } from "./parser/parseComponentsHeader.js";
import { internalError } from "./internalError.js";

/**
 * APGsembly program
 */
export class Program {
    /**
     * @param {ReadonlyArray<Command>} commands
     * @param {ComponentsHeader[]} componentsHeaders
     * @param {RegistersHeader[]} registersHeaders
     * @throw Error
     */
    constructor(commands, componentsHeaders, registersHeaders) {
        /**
         * @readonly
         * @type {ReadonlyArray<Command>}
         */
        this.commands = commands;

        /**
         * @readonly
         * @type {ComponentsHeader[]}
         */
        this.componentsHeader = componentsHeaders;

        /**
         * @readonly
         * @type {RegistersHeader[]}
         */
        this.registersHeader = registersHeaders;
    }

    /**
     * プログラムまたはエラーメッセージ
     * Program or error message
     * @param {string} str
     * @param {{ noValidate?: boolean, libraryFiles?: { name: string; content: string }[] }} param1
     * @returns {Program | string}
     */
    static parse(str, { noValidate, libraryFiles } = {}) {
        const programLines = ProgramLines.parse(str);
        if (typeof programLines === "string") {
            return programLines;
        }

        /** @type {{ name: string; programLines: ProgramLines }[]} */
        const libraries = [];
        for (const libraryFile of libraryFiles ?? []) {
            const libraryProgramLines = ProgramLines.parse(libraryFile.content);
            if (typeof libraryProgramLines === "string") {
                return libraryProgramLines;
            }
            libraries.push({
                name: libraryFile.name,
                programLines: libraryProgramLines,
            });
        }

        /** @type {Command[]} */
        const commands = expandTemplate(programLines, libraries);
        // validation
        if (!noValidate) {
            if (commands.length === 0) {
                return "Program is empty";
            }

            const errorOrUndefined = validateAll(commands);
            if (typeof errorOrUndefined === "string") {
                return errorOrUndefined;
            }
        }

        return new Program(
            commands,
            programLines.getArray().flatMap((x) => {
                return x instanceof ComponentsHeader ? [x] : [];
            }),
            programLines.getArray().flatMap((x) => {
                return x instanceof RegistersHeader ? [x] : [];
            }),
        );
    }
}

/**
 * 要素を一意にしてソートする
 * @param {number[]} array
 * @returns {number[]}
 */
const sortNub = (array) => {
    return [...new Set(array)].sort((a, b) => a - b);
};

/**
 * @typedef {{
 * unary: string[],
 * binary: string[],
 * legacyT: number[],
 * hasAdd: boolean,
 * hasSub: boolean,
 * hasMul: boolean,
 * hasB2D: boolean,
 * hasOutput: boolean, }} AnalyzeProgramResult
 */

/**
 * プログラムから使用されているレジスタ番号を抽出
 * @param {Program} program
 * @returns {AnalyzeProgramResult}
 */
export const analyzeProgram = (program) => {
    /** @type {readonly Action[]} */
    const actions = program.commands.flatMap((command) => command.actions);

    /**
     * @template {Action & { regNumber: number }} T
     * @param {new (...args: any[]) => T} klass
     * @returns {number[]}
     */
    const getNumbers = (klass) => {
        return sortNub(actions.flatMap(
            (action) => action instanceof klass ? [action.regNumber] : [],
        ));
    };

    /**
     * @template {Action & { regNumber: string }} T
     * @param {new (...args: any[]) => T} klass
     * @returns {string[]}
     */
    const getStrings = (klass) => {
        const all = actions.flatMap(
            (action) => action instanceof klass ? [action.regNumber] : [],
        );
        return numberOrStringSort([...new Set(all)]);
    };

    let hasAdd = false;
    let hasSub = false;
    let hasMul = false;
    let hasB2D = false;
    let hasOutput = false;

    for (const action of actions) {
        if (action instanceof AddAction) {
            hasAdd = true;
        } else if (action instanceof SubAction) {
            hasSub = true;
        } else if (action instanceof MulAction) {
            hasMul = true;
        } else if (action instanceof B2DAction) {
            hasB2D = true;
        } else if (action instanceof OutputAction) {
            hasOutput = true;
        }
    }

    return {
        unary: getStrings(URegAction),
        binary: getStrings(BRegAction),
        legacyT: getNumbers(LegacyTRegAction),
        hasAdd,
        hasSub,
        hasMul,
        hasB2D,
        hasOutput,
    };
};

/**
 * @param {string[]} array
 * @returns {string[]}
 */
function numberOrStringSort(array) {
    return array.sort((a, b) => {
        // 数字([0-9]+)であれば先にソートする
        const aIsNumber = /[0-9]+/.test(a);
        const bIsNumber = /[0-9]+/.test(b);
        if (aIsNumber && bIsNumber) {
            return Number(a) - Number(b); // 数字同士は数値として比較
        }
        if (aIsNumber) {
            return -1; // 数字は文字列より先に来る
        }
        if (bIsNumber) {
            return 1; // 文字列は数字の後に来る
        }
        if (a < b) {
            return -1; // 文字列同士はアルファベット順
        }
        if (a > b) {
            return 1; // 文字列同士はアルファベット順
        }
        return 0; // 同じ場合は等しい
    });
}

/**
 * @param {ComponentsHeader[]} componentsHeaders
 * @param {AnalyzeProgramResult} analyzeResult
 */
export const validateComponentsHeader = (componentsHeaders, analyzeResult) => {
    /** @type {string[]} */
    const errors = [];
    const components = new Set(
        componentsHeaders.flatMap((c) => parseComponentsHeader(c.content)),
    );

    /**
     * @param {string} comp
     * @returns {string}
     */
    const errorMessage = (comp) =>
        `Program uses ${comp} component but the #COMPONENTS header does not include it.`;

    if (analyzeResult.hasAdd && !components.has("ADD")) {
        errors.push(errorMessage("ADD"));
    }

    if (analyzeResult.hasSub && !components.has("SUB")) {
        errors.push(errorMessage("SUB"));
    }

    if (analyzeResult.hasMul && !components.has("MUL")) {
        errors.push(errorMessage("MUL"));
    }

    if (analyzeResult.hasB2D && !components.has("B2D")) {
        errors.push(errorMessage("B2D"));
    }

    if (analyzeResult.hasOutput && !components.has("OUTPUT")) {
        errors.push(errorMessage("OUTPUT"));
    }

    /** @type {string[]} */
    const neededUnary = [];
    for (const u of analyzeResult.unary) {
        if (!components.has("U" + u)) {
            neededUnary.push(u);
        }
    }

    if (neededUnary.length > 0) {
        errors.push(
            `Program uses ${
                neededUnary.map((u) => "U" + u).join(", ")
            } component${
                neededUnary.length === 1 ? "" : "s"
            } but the #COMPONENTS header does not include ${
                neededUnary.length === 1 ? "it" : "them"
            }.`,
        );
    }

    /** @type {string[]} */
    const neededBinary = [];
    for (const b of analyzeResult.binary) {
        if (!components.has("B" + b)) {
            neededBinary.push(b);
        }
    }

    if (neededBinary.length > 0) {
        errors.push(
            `Program uses ${
                neededBinary.map((u) => "B" + u).join(", ")
            } component${
                neededBinary.length === 1 ? "" : "s"
            } but the #COMPONENTS header does not include ${
                neededBinary.length === 1 ? "it" : "them"
            }.`,
        );
    }

    if (errors.length !== 0) {
        throw new Error(errors.join("\n"));
    }
};

/**
 * @param {string[]} arr sorted
 * @returns {string[]}
 */
function compactRangesString(arr) {
    const onlyNumbers = arr.filter((x) => /^[0-9]+$/.test(x)).map((x) =>
        parseInt(x, 10)
    );
    const notNumbers = arr.filter((x) => !/^[0-9]+$/.test(x));
    return compactRanges(onlyNumbers).concat(notNumbers);
}

/**
 * @param {number[]} arr sorted
 * @returns {string[]}
 */
function compactRanges(arr) {
    const len = arr.length;
    if (len === 0) {
        return [];
    }
    const result = [];
    let start = arr[0];
    let end = arr[0] ?? internalError();

    for (let i = 1; i < len; i++) {
        const item = arr[i] ?? internalError();
        if (item === end + 1) {
            end = item;
        } else {
            result.push(start === end ? `${start}` : `${start}-${end}`);
            start = item;
            end = item;
        }
    }

    result.push(start === end ? `${start}` : `${start}-${end}`);
    return result;
}

/**
 * Generate #COMPONENTS header content
 * @param {AnalyzeProgramResult} analyzeResult
 * @returns {string} `"U0-2,ADD"`
 */
export const generateComponentsHeader = (analyzeResult) => {
    /** @type {string[]} */
    let components = [];

    if (analyzeResult.hasB2D) {
        components.push("B2D");
    }

    const binary = numberOrStringSort(analyzeResult.binary.slice());
    components = components.concat(
        compactRangesString(binary).map((x) => "B" + x),
    );

    const unary = numberOrStringSort(analyzeResult.unary.slice());
    components = components.concat(
        compactRangesString(unary).map((x) => "U" + x),
    );

    if (analyzeResult.hasAdd) {
        components.push("ADD");
    }

    if (analyzeResult.hasSub) {
        components.push("SUB");
    }

    if (analyzeResult.hasMul) {
        components.push("MUL");
    }

    if (analyzeResult.hasOutput) {
        components.push("OUTPUT");
    }

    return components.join(", ");
};
