// @ts-check

import { Action } from "./actions/Action.js";
import { parseAction } from "./actions/parse.js";

export class ComponentsHeader {
    /**
     * 
     * @param {string} content
     */
    constructor(content) {
        this.content = content;
    }
}

export class RegistersHeader {
    /**
     * 
     * @param {string} content 
     */
    constructor(content) {
        this.content = content;
    }
}

export class Comment {
    /**
     * 
     * @param {string} str 
     */
    constructor(str) {
        /**
         * @private
         */
        this.str = str;
    }

    /**
     * 
     * @returns {string}
     */
    getString() {
        return this.str;
    }

}

export class Command {
    /**
     * 
     * @param {{
     *    state: string;
     *    input: "Z" | "NZ" | "ZZ" | "*";
     *    nextState: string;
     *    actions: Action[]
     * }} param0 
     */
    constructor({ state, input, nextState, actions }) {
        this.state = state;
        this.input = input;
        this.nextState = nextState;
        this.actions = actions;   
    }

    /**
     * CommandまたはCommentまたは空行またはエラーメッセージ
     * @param {string} str 
     * @returns {Command | RegistersHeader | ComponentsHeader | Comment | undefined | string}
     */
    static parse(str) {
        if (typeof str !== 'string') {
            throw TypeError('str is not a string');
        }
        const trimmedStr = str.trim();
        if (trimmedStr === "") {
            return undefined;
        }
        if (trimmedStr.startsWith("#")) {
            if (trimmedStr.startsWith('#COMPONENTS')) {
                return new ComponentsHeader(trimmedStr.slice('#COMPONENTS'.length).trim());
            } else if (trimmedStr.startsWith('#REGISTERS')) {
                return new RegistersHeader(trimmedStr.slice('#REGISTERS'.length).trim());
            }
            return new Comment(str);
        }
        const array = trimmedStr.split(/\s*;\s*/);
        if (array.length < 4) {
            return "invalid command";
        }
        if (array.length > 4) {
            if (array[4] === "") {
                return "extraneous semicolon";
            }
            return "invalid command";
        }
        const state = array[0] ?? this.error();
        const inputStr = array[1] ?? this.error();
        const nextState = array[2] ?? this.error();
        const actionsStr = array[3] ?? this.error();
        const actionStrs = actionsStr.trim().split(/\s*,\s*/);

        /** @type {Action[]} */
        const actions = [];
        for (const actionsStr of actionStrs) {
            const result = parseAction(actionsStr);
            if (result === undefined) {
                return `unkown action "${actionsStr}" at "${str}"`;
            }
            actions.push(result);
        }

        if (!["Z", "NZ", "ZZ", "*"].includes(inputStr)) {
            return `unkown input "${inputStr}" at "${str}"`;
        }

        /** @type {"Z" | "NZ" | "ZZ" | "*"} */
        // @ts-ignore
        const input = inputStr;

        return new Command({
            state: state,
            input: input,
            nextState: nextState,
            actions: actions
        });
    }

    /**
     * @returns {never}
     */
    static error() {
        throw Error('internal error');
    }

    /**
     * @returns {string}
     */
    pretty() {
        return `${this.state}; ${this.input}; ${this.nextState}; ${this.actions.map(a => a.pretty()).join(", ")}`;
    }
}
