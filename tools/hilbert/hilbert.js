/**
 * Define the basic movements
 * @typedef { "u" | "d" | "l" | "r"} Move
 */

/**
 * https://en.wikipedia.org/wiki/Hilbert_curve#/media/File:Hilbert_curve_production_rules!.svg
 * @type {Move[][]}
 */
const basePatternMoves = {
    A: ["u", "r", "d"],
    B: ["l", "d", "r"],
    C: ["d", "l", "u"],
    D: ["r", "u", "l"],
};

/**
 * @typedef {'A' | 'B' | 'C' | 'D'} Pattern
 */

// This function recursively determines the K-th move for a given pattern type and order.
// It effectively simulates the L-system expansion with a focus on a single character.
// The recursion depth is `order`, which is O(log K).
// Space complexity: O(log K) on the call stack (simulated work tape for a TM).
// Time complexity: O(log K) for each character lookup.
/**
 * @param {Pattern} patternType
 * @param {number} order
 * @param {number} k
 * @returns {Move}
 */
function getKthMoveDirect(patternType, order, k) {
    if (order === 0) {
        // This case should ideally not be reached if order is always >= 1 for actual moves.
        // If order 0 conceptually represents a single point with no moves, then this error is appropriate.
        throw new Error(
            "Cannot get move for order 0; lowest order with moves is 1.",
        );
    }

    if (order === 1) {
        // Base case: For order 1, directly return the pre-defined move.
        // `k` can be 0, 1, or 2 for a 3-character base move sequence.
        return basePatternMoves[patternType][k];
    }

    // Calculate the length of a sub-curve of order (order-1).
    // A curve of order `n` has `4^n - 1` moves. So, order `n-1` has `4^(n-1) - 1` moves.
    const lenSub = (1 << (2 * (order - 1))) - 1; // Equivalent to Math.pow(4, order - 1) - 1

    // The Hilbert curve (and its variants P0-P3) is composed of 4 sub-curves of `order-1`
    // and 3 single-step connecting moves.
    // The sequence looks like: Sub-curve1 + Move1 + Sub-curve2 + Move2 + Sub-curve3 + Move3 + Sub-curve4.

    // This switch statement implements the specific recursive expansion rules for each pattern type.
    // Each case checks which segment the `k` index falls into and then makes a recursive call
    // with the appropriate `nextPatternType` and adjusted `k` (or returns a direct move).
    switch (patternType) {
        case "A": // D u A r A d B
            if (k < lenSub) {
                return getKthMoveDirect("D", order - 1, k); // P1(n-1)
            } else if (k === lenSub) {
                return "u"; // Connecting move
            } else if (k < 2 * lenSub + 1) {
                return getKthMoveDirect("A", order - 1, k - (lenSub + 1)); // P0(n-1)
            } else if (k === 2 * lenSub + 1) {
                return "r"; // Connecting move
            } else if (k < 3 * lenSub + 2) {
                return getKthMoveDirect("A", order - 1, k - (2 * lenSub + 2)); // P0(n-1)
            } else if (k === 3 * lenSub + 2) {
                return "d"; // Connecting move
            } else {
                return getKthMoveDirect("B", order - 1, k - (3 * lenSub + 3)); // P3(n-1)
            }
        case "B": // C l B d B r A
            if (k < lenSub) {
                return getKthMoveDirect("C", order - 1, k); // P0(n-1)
            } else if (k === lenSub) {
                return "l";
            } else if (k < 2 * lenSub + 1) {
                return getKthMoveDirect("B", order - 1, k - (lenSub + 1)); // P1(n-1)
            } else if (k === 2 * lenSub + 1) {
                return "d";
            } else if (k < 3 * lenSub + 2) {
                return getKthMoveDirect("B", order - 1, k - (2 * lenSub + 2)); // P1(n-1)
            } else if (k === 3 * lenSub + 2) {
                return "r";
            } else {
                return getKthMoveDirect("A", order - 1, k - (3 * lenSub + 3)); // P2(n-1)
            }
        case "C": // B d C l C u D
            if (k < lenSub) {
                return getKthMoveDirect("B", order - 1, k); // P3(n-1)
            } else if (k === lenSub) {
                return "d";
            } else if (k < 2 * lenSub + 1) {
                return getKthMoveDirect("C", order - 1, k - (lenSub + 1)); // P2(n-1)
            } else if (k === 2 * lenSub + 1) {
                return "l";
            } else if (k < 3 * lenSub + 2) {
                return getKthMoveDirect("C", order - 1, k - (2 * lenSub + 2)); // P2(n-1)
            } else if (k === 3 * lenSub + 2) {
                return "u";
            } else {
                return getKthMoveDirect("D", order - 1, k - (3 * lenSub + 3)); // P1(n-1)
            }
        case "D": // A r D u D l C
            if (k < lenSub) {
                return getKthMoveDirect("A", order - 1, k); // P2(n-1)
            } else if (k === lenSub) {
                return "r";
            } else if (k < 2 * lenSub + 1) {
                return getKthMoveDirect("D", order - 1, k - (lenSub + 1)); // P3(n-1)
            } else if (k === 2 * lenSub + 1) {
                return "u";
            } else if (k < 3 * lenSub + 2) {
                return getKthMoveDirect("D", order - 1, k - (2 * lenSub + 2)); // P3(n-1)
            } else if (k === 3 * lenSub + 2) {
                return "l";
            } else {
                return getKthMoveDirect("C", order - 1, k - (3 * lenSub + 3)); // P0(n-1)
            }
        default:
            // This should not happen with valid patternType inputs (0-3).
            throw new Error("Invalid pattern type encountered.");
    }
}

/**
 * A generator function to yield characters of the infinite Hilbert word H one by one.
 * This directly simulates the logic of a Turing Machine generating the word.
 * It uses O(log K) space (on the call stack/work tape) and O(log K) time per yielded character,
 * where K is the index of the character being yielded.
 * @returns {Generator<Move, void, unknown>}
 */
export function* infiniteHilbertWordGenerator() {
    let globalK = 0; // Current index of the character to generate.

    // Loop indefinitely to generate the infinite word.
    while (true) {
        // Determine the minimum order `n` such that H_n contains `globalK`.
        // The length of H_n is 4^n - 1.
        let order = 1;
        // while ((1 << (2 * order)) - 1 <= globalK) { // Check if 4^order - 1 is less than or equal to globalK
        //     order++;
        // }
        while ((1 << (2 * order)) - 1 <= globalK) { // Check if 4^order - 1 is less than or equal to globalK
            // ensure `order` is adjusted to be the smallest odd order `N` such that `(1 << (2 * N)) - 1` covers `globalK`
            order += 2;
        }

        // Use the recursive function to get the character at the current global index.
        const char = getKthMoveDirect("D", order, globalK); // PatternType 0 is the "standard" Hilbert curve.

        yield char; // Yield the generated character.

        globalK++; // Move to the next character.
    }
}

// Example of consuming the infinite generator:
// console.log("\n--- Infinite Hilbert Word Generator ---");
// const hilbertGen = infiniteHilbertWordGenerator();

// let str = "";
// for (let i = 0; i < (4 ** 4) - 1; i++) {
//     str += hilbertGen.next().value;
// }
// console.log(str);

// for (const c of str) {
//     switch (c) {
//         case "u": {
//             break;
//         }
//     }
// }
