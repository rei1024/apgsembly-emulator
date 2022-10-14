import { Program } from "../../src/exports.js";

/**
 *
 * @param {string} apgsemblySource
 * @returns {string} graph definition
 */
export function create(apgsemblySource) {
    const program = Program.parse(apgsemblySource);
    if (typeof program === 'string') {
        throw new Error(program);
    }

    /** @type {Edge[]} */
    const data = [];
    for (const command of program.commands) {
        data.push({
            from: command.state,
            to: command.nextState,
            note: command.input === '*' ? null : command.input
        });
    }
    return createGraphDefinition(data);
}

/**
 * @typedef {{ from: string; to: string; note?: string | undefined | null}} Edge
 */

const map = new Map(" %[]|<>()~^{}".split("").map((c, i) => [c, '__' + i]));

/**
 * @param {string} str
 */
function key(str) {
    return str.replaceAll(
        / |%|\[|\]|\||<|>|\(|\)|~|\^|\{|\}/ug,
        match => map.get(match)
    );
}

/**
 * @param {Edge[]} data
 * @returns {string}
 */
function createGraphDefinition(data) {
    return `graph TB\n` + data.map(item => {
        const from = `${key(item.from)}["${item.from}"]`;
        const to = `${key(item.to)}["${item.to}"]`;
        const note = item.note ? `|"${item.note}"|` : '';
        return `${from}-->${note}${to}`;
    }).join('\n');
}
