// @ts-check

import { HaltOutAction } from "./actions/HaltOutAction.js";
import { Command, INITIAL_STATE } from "./Command.js";

/**
 * 全てのバリデーションを通す
 * @param {Command[]} commands
 * @returns {undefined | string} string is error
 */
export function validateAll(commands) {
    const duplicateError = validateNoDuplicatedAction(commands);
    if (typeof duplicateError === 'string') {
        return duplicateError;
    }

    const returnOnceError = validateActionReturnOnce(commands);
    if (typeof returnOnceError === 'string') {
        return returnOnceError;
    }

    const noSameComponentError = validateNoSameComponent(commands);
    if (typeof noSameComponentError === 'string') {
        return noSameComponentError;
    }

    const nextStateIsNotInitialError = validateNextStateIsNotINITIAL(commands);
    if (typeof nextStateIsNotInitialError === 'string') {
        return nextStateIsNotInitialError;
    }

    const zAndNZError = validateZAndNZ(commands);
    if (typeof zAndNZError === 'string') {
        return zAndNZError;
    }

    return undefined;
}

/**
 * @returns {never}
 */
function internalError() {
    throw Error('internal error');
}

/**
 *
 * @param {Command} command
 * @returns {string | undefined}
 */
function validateNextStateIsNotINITIALCommand(command) {
    if (command.nextState === INITIAL_STATE) {
        return `Return to initial state in "${command.pretty()}"`;
    }
    return undefined;
}

/**
 *
 * @param {Command} command
 * @returns {string | undefined}
 */
function validateNoDuplicatedActionCommand(command) {
    if (command.actions.length <= 1) {
        return undefined;
    }
    const actionStrs = command.actions.map(x => x.pretty());
    actionStrs.sort();
    for (let i = 0; i < actionStrs.length - 1; i++) {
        const act1 = actionStrs[i];
        const act2 = actionStrs[i + 1];
        if (act1 === act2) {
            return `Duplicated actions "${act1}" in "${command.pretty()}"`;
        }
    }
    return undefined;
}

/**
 * 同じアクションが複数含まれていないか検査する
 * エラーメッセージを返却する
 * @param {Command[]} commands
 * @returns {string | undefined}
 */
export function validateNoDuplicatedAction(commands) {
    for (const command of commands) {
        const err = validateNoDuplicatedActionCommand(command);
        if (typeof err === 'string') {
            return err;
        }
    }
    return undefined;
}

/**
 *
 * @param {Command} command
 * @returns {string | undefined}
 */
function validateActionReturnOnceCommand(command) {
    // HALT_OUTの場合は一旦無視
    // FIXME
    if (command.actions.find(x => x instanceof HaltOutAction) !== undefined) {
        return undefined;
    }
    const valueReturnActions = command.actions.filter(x => x.doesReturnValue());
    if (valueReturnActions.length === 1) {
        return undefined;
    } else if (valueReturnActions.length === 0) {
        return `Does not produce the return value in "${command.pretty()}"`;
    } else {
        return `Does not contain exactly one action that produces a return value "${
            command.pretty()
        }": Actions that produce value are ${
            valueReturnActions.map(x => x.pretty()).join(', ')
        }`;
    }
}

/**
 * アクションが値を一度だけ返すか検査する
 * エラーメッセージを返却する
 * @param {Command[]} commands
 * @returns {string | undefined}
 */
export function validateActionReturnOnce(commands) {
    for (const command of commands) {
        const err = validateActionReturnOnceCommand(command);
        if (typeof err === 'string') {
            return err;
        }
    }
    return undefined;
}

/**
 *
 * @param {Command} command
 * @returns {string | undefined}
 */
function validateNoSameComponentCommand(command) {
    // HALT_OUTの場合は一旦無視
    // FIXME
    if (command.actions.find(x => x instanceof HaltOutAction) !== undefined) {
        return undefined;
    }
    const actions = command.actions;
    const len = actions.length;

    if (len <= 1) {
        return undefined;
    }

    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            // if (i === j) {
            //     continue;
            // }
            const a = actions[i] ?? internalError();
            const b = actions[j] ?? internalError();
            if (a.isSameComponent(b)) {
                return `Actions "${
                    a.pretty()
                }" and "${
                    b.pretty()
                }" use same component in "${command.pretty()}"`;
            }
        }
    }
    return undefined;
}

/**
 * アクションが同じコンポーネントを使用していないか検査する
 * エラーメッセージを返却する
 * @param {Command[]} commands
 * @returns {string | undefined}
 */
export function validateNoSameComponent(commands) {
    for (const command of commands) {
        const err = validateNoSameComponentCommand(command);
        if (typeof err === 'string') {
            return err;
        }
    }
    return undefined;
}

/**
 * 次の状態が初期状態でないか検査する
 * エラーメッセージを返却する
 * @param {Command[]} commands
 * @returns {string | undefined}
 */
export function validateNextStateIsNotINITIAL(commands) {
    for (const command of commands) {
        const err = validateNextStateIsNotINITIALCommand(command);
        if (typeof err === 'string') {
            return err;
        }
    }
    return undefined;
}

/**
 * ZとNZがペアになっていることを検査する
 * エラーメッセージを返却する
 * @param {Command[]} commands
 * @returns {string | undefined}
 */
export function validateZAndNZ(commands) {
    for (let i = 0; i < commands.length - 1; i++) {
        const a = commands[i] ?? internalError();
        const b = commands[i + 1] ?? internalError();

        if (a.input === "Z" && b.input !== 'NZ') {
            return `Need Z line followed by NZ line at "${a.pretty()}"`;
        }

        if (b.input === "NZ" && a.input !== 'Z') {
            return `Need Z line followed by NZ line at "${b.pretty()}"`;
        }
    }

    const lastLine = commands[commands.length - 1];
    if (lastLine !== undefined) {
        if (lastLine.input === 'Z') {
            return `Need Z line followed by NZ line at "${lastLine.pretty()}"`;
        }
    }

    return undefined;
}
