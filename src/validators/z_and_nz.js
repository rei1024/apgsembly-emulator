// @ts-check

import { Command } from "../Command.js";

/**
 * @returns {never}
 */
function internalError() {
    throw Error('internal error');
}

/**
 *
 * @param {Command} command1
 * @param {Command} [command2]
 * @returns {string}
 */
function addLineNumberTwo(command1, command2) {
    if (command1.line !== undefined && command2?.line !== undefined) {
        return ` at line ${command1.line} and ${command2.line}`;
    } else {
        return "";
    }
}

/**
 * ZとNZがペアになっていることを検査する
 * エラーメッセージを返却する
 * @param {Command[]} commands
 * @returns {string[] | undefined}
 */
 export function validateZAndNZ(commands) {
    /**
     *
     * @param {Command} c1
     * @param {Command} [c2]
     */
    const errMsg = (c1, c2) => `Need Z line followed by NZ line in "${c1.pretty()}"${addLineNumberTwo(c1, c2)}`;

    for (let i = 0; i < commands.length - 1; i++) {
        const a = commands[i] ?? internalError();
        const b = commands[i + 1] ?? internalError();

        if (a.input === "Z" && b.input !== 'NZ') {
            return [errMsg(a, b)];
        }

        if (b.input === "NZ" && a.input !== 'Z') {
            return [errMsg(a, b)];
        }

        if (a.input === "Z" && b.input === "NZ" && a.state !== b.state) {
            return [errMsg(a, b)];
        }
    }

    const lastLine = commands[commands.length - 1];
    if (lastLine !== undefined) {
        if (lastLine.input === 'Z') {
            return [errMsg(lastLine)];
        }
    }

    return undefined;
}
