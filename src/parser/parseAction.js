// @ts-check

import { Action } from "../actions/Action.js";
import { AddAction } from "../actions/AddAction.js";
import { B2DAction } from "../actions/B2DAction.js";
import { BRegAction } from "../actions/BRegAction.js";
import { HaltOutAction } from "../actions/HaltOutAction.js";
import { MulAction } from "../actions/MulAction.js";
import { NopAction } from "../actions/NopAction.js";
import { OutputAction } from "../actions/OutputAction.js";
import { SubAction } from "../actions/SubAction.js";
import { URegAction } from "../actions/URegAction.js";
import { LegacyTRegAction } from "../actions/LegacyTRegAction.js";

/**
 * @type {((str: string) => Action | undefined)[]}
 */
const parsers = [
    // NOTE: B2DはBと被っているためB2Dを先にパースする必要がある
    B2DAction.parse,
    BRegAction.parse,
    URegAction.parse,
    NopAction.parse,
    AddAction.parse,
    MulAction.parse,
    SubAction.parse,
    OutputAction.parse,
    HaltOutAction.parse,
    LegacyTRegAction.parse,
];

/**
 * アクションをパースする
 * @param {string} str
 * @returns {Action | undefined}
 */
export const parseAction = (str) => {
    for (const parser of parsers) {
        const result = parser(str);
        if (result !== undefined) {
            return result;
        }
    }

    return undefined;
};
