// @ts-check
// deno-lint-ignore-file no-unused-vars

import { Action } from "./actions/Action.js";
import { parseAction } from "./actionParse.js";

/**
 * 初期状態
 */
export const INITIAL_STATE = "INITIAL";

/**
 * @abstract
 */
export class ProgramLine {
    /**
     * @returns {string}
     */
    pretty() {
        return `unimplemented`;
    }
}

/**
 * `#COMPONENTS`
 */
export class ComponentsHeader extends ProgramLine {
    /**
     *
     * @param {string} content
     */
    constructor(content) {
        super();

        /**
         * @readonly
         */
        this.content = content;
    }

    /**
     * @returns {string}
     */
    static get key() {
        return "#COMPONENTS";
    }

    /**
     *
     * @returns {string}
     * @override
     */
    pretty() {
        return ComponentsHeader.key + " " + this.content;
    }
}

/**
 * `#REGISTERS`
 */
export class RegistersHeader extends ProgramLine {
    /**
     *
     * @param {string} content
     */
    constructor(content) {
        super();

        /**
         * @readonly
         */
        this.content = content;
    }

    /**
     * @returns {string}
     */
    static get key() {
        return "#REGISTERS";
    }

    /**
     * @override
     * @returns {string}
     */
    pretty() {
        return RegistersHeader.key + " " + this.content;
    }
}

/**
 * コメント
 */
export class Comment extends ProgramLine {
    /**
     *
     * @param {string} str with #
     */
    constructor(str) {
        super();

        /**
         * @readonly
         * @private
         */
        this.str = str;
    }

    /**
     * シャープを含む
     * @returns {string}
     */
    getString() {
        return this.str;
    }

    /**
     * @override
     */
    pretty() {
        return this.getString();
    }
}

/**
 * 空行
 * Empty line
 */
export class EmptyLine extends ProgramLine {
    constructor() {
        super();
    }

    /**
     * @override
     */
    pretty() {
        return "";
    }
}

/**
 *
 * @param {string} inputStr
 * @returns {"Z" | "NZ" | "ZZ" | "*" | undefined}
 */
function parseInput(inputStr) {
    switch (inputStr) {
        case "Z": return inputStr;
        case "NZ": return inputStr;
        case "ZZ": return inputStr;
        case "*": return inputStr;
        default: return undefined;
    }
}

/**
 * A line of APGsembly program
 */
export class Command extends ProgramLine {
    /**
     *
     * @param {{
     *    state: string;
     *    input: "Z" | "NZ" | "ZZ" | "*";
     *    nextState: string;
     *    actions: ReadonlyArray<Action>;
     *    line?: number | undefined;
     * }} param0
     */
    constructor({ state, input, nextState, actions, line }) {
        super();

        /**
         * @readonly
         */
        this.state = state;

        /**
         * @readonly
         */
        this.input = input;

        /**
         * @readonly
         */
        this.nextState = nextState;

        /**
         * @type {ReadonlyArray<Action>}
         * @readonly
         */
        this.actions = actions;

        /**
         * 1始まりの行数
         * @readonly
         */
        this.line = line;

        /**
         * 文字列表現のキャッシュ
         * @readonly
         * @private
         */
        this._string = `${this.state}; ${this.input}; ${this.nextState}; ${this.actions.map(a => a.pretty()).join(", ")}`;
    }

    /**
     * 文字列化する
     * @override
     * @returns {string}
     */
    pretty() {
        return this._string; // `${this.state}; ${this.input}; ${this.nextState}; ${this.actions.map(a => a.pretty()).join(", ")}`;
    }
}

/**
 * @private
 * @returns {never}
 */
function error() {
    throw Error('internal error');
}

/**
 * CommandまたはCommentまたは空行またはエラーメッセージ
 * @param {string} str
 * @param {number} [line]
 * @returns {Command | RegistersHeader | ComponentsHeader | Comment | EmptyLine | string}
 */
export function parseProgramLine(str, line = undefined) {
    if (typeof str !== 'string') {
        throw TypeError('str is not a string');
    }
    const trimmedStr = str.trim();
    if (trimmedStr === "") {
        return new EmptyLine();
    }
    if (trimmedStr.startsWith("#")) {
        // ヘッダーをパースする
        if (trimmedStr.startsWith(ComponentsHeader.key)) {
            return new ComponentsHeader(trimmedStr.slice(ComponentsHeader.key.length).trim());
        } else if (trimmedStr.startsWith(RegistersHeader.key)) {
            return new RegistersHeader(trimmedStr.slice(RegistersHeader.key.length).trim());
        }
        return new Comment(str);
    }
    const array = trimmedStr.split(/\s*;\s*/u);
    if (array.length < 4) {
        return `Invalid line "${str}"${lineNumberMessage(line)}`;
    }
    if (array.length > 4) {
        if (array[4] === "") {
            return `Extraneous semicolon "${str}"${lineNumberMessage(line)}`;
        }
        return `Invalid line "${str}"${lineNumberMessage(line)}`;
    }
    // arrayの長さは4
    const state = array[0] ?? error();
    const inputStr = array[1] ?? error();
    const nextState = array[2] ?? error();
    const actionsStr = array[3] ?? error();
    // 空文字を除く
    const actionStrs = actionsStr.trim().split(/\s*,\s*/u).filter(x => x !== "");

    /** @type {Action[]} */
    const actions = [];
    for (const actionsStr of actionStrs) {
        const result = parseAction(actionsStr);
        if (result === undefined) {
            return `Unknown action "${actionsStr}" in "${str}"${lineNumberMessage(line)}`;
        }
        actions.push(result);
    }

    const input = parseInput(inputStr);
    if (input === undefined) {
        return `Unknown input "${inputStr}" in "${str}"${lineNumberMessage(line)}. Expect "Z", "NZ", "ZZ", or "*"`;
    }

    return new Command({
        state: state,
        input: input,
        nextState: nextState,
        actions: actions,
        line: line
    });
}

/**
 *
 * @param {number | undefined} line
 * @returns {string}
 */
function lineNumberMessage(line) {
    if (line !== null && line !== undefined) {
        return ` at line ${line}`;
    } else {
        return "";
    }
}

/**
 *
 * @param {Command} command
 * @returns {string}
 */
export function addLineNumber(command) {
    return lineNumberMessage(command.line);
}
