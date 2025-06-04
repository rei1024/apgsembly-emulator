/**
 * @typedef { "u" | "d" | "l" | "r"} Move
 */

/**
 * https://en.wikipedia.org/wiki/Hilbert_curve#/media/File:Hilbert_curve_production_rules!.svg
 * These base patterns define the 3 moves for order 1 for each of the 4 types (A, B, C, D).
 * @type {Object.<string, Move[]>}
 */
const basePatternMoves = {
    A: ["u", "r", "d"], // H_1 = urd
    B: ["l", "d", "r"], // Rotated/reflected versions
    C: ["d", "l", "u"],
    D: ["r", "u", "l"],
};

/**
 * @typedef {'A' | 'B' | 'C' | 'D'} Pattern
 */

/**
 * Represents a segment in the Hilbert curve expansion.
 * Could be a recursive call to a sub-pattern or a direct move character.
 * @typedef {Object} Segment
 * @property {boolean} isSubSegment - True if this segment is a recursive sub-pattern.
 * @property {Pattern} [nextPatternType] - The pattern type for the sub-segment, if isSubSegment is true.
 * @property {Move} [move] - The move character, if isSubSegment is false.
 */

// Define the transitions for each pattern type based on the L-system rules.
// Each inner array corresponds to a `patternType` (A, B, C, D).
// The sequence of segments for each pattern's expansion is defined here.
/** @type {Object.<Pattern, Segment[]>} */
const transitions = {
    // A: D u A r A d B
    A: [
        { isSubSegment: true, nextPatternType: "D" },
        { isSubSegment: false, move: "u" },
        { isSubSegment: true, nextPatternType: "A" },
        { isSubSegment: false, move: "r" },
        { isSubSegment: true, nextPatternType: "A" },
        { isSubSegment: false, move: "d" },
        { isSubSegment: true, nextPatternType: "B" },
    ],
    // B: C l B d B r A
    B: [
        { isSubSegment: true, nextPatternType: "C" },
        { isSubSegment: false, move: "l" },
        { isSubSegment: true, nextPatternType: "B" },
        { isSubSegment: false, move: "d" },
        { isSubSegment: true, nextPatternType: "B" },
        { isSubSegment: false, move: "r" },
        { isSubSegment: true, nextPatternType: "A" },
    ],
    // C: B d C l C u D
    C: [
        { isSubSegment: true, nextPatternType: "B" },
        { isSubSegment: false, move: "d" },
        { isSubSegment: true, nextPatternType: "C" },
        { isSubSegment: false, move: "l" },
        { isSubSegment: true, nextPatternType: "C" },
        { isSubSegment: false, move: "u" },
        { isSubSegment: true, nextPatternType: "D" },
    ],
    // D: A r D u D l C
    D: [
        { isSubSegment: true, nextPatternType: "A" },
        { isSubSegment: false, move: "r" },
        { isSubSegment: true, nextPatternType: "D" },
        { isSubSegment: false, move: "u" },
        { isSubSegment: true, nextPatternType: "D" },
        { isSubSegment: false, move: "l" },
        { isSubSegment: true, nextPatternType: "C" },
    ],
};

/**
 * Iteratively determines the K-th move for a given pattern type and order,
 * without using recursion or (x, y) coordinates. This is a tail-recursive style
 * iterative function, requiring minimal stack space.
 *
 * @param {Pattern} patternType - The starting pattern type ('A', 'B', 'C', 'D').
 * @param {number} order - The order of the Hilbert curve (e.g., 1, 2, ...).
 * @param {number} k - The 0-based index of the character to retrieve within this pattern's expansion.
 * @returns {Move} The character ('u', 'd', 'l', 'r') at the given index.
 */
function getKthMoveIterative(patternType, order, k) {
    // These variables will be updated in place, effectively mimicking
    // tail recursion optimization where the stack frame is reused.
    let currentPatternType = patternType;
    let currentOrder = order;
    let currentK = k;

    while (true) { // Loop indefinitely until a base case (move) is returned
        // optimization
        if (currentOrder === 1) {
            return basePatternMoves[currentPatternType][currentK];
        }

        // Calculate the length of a sub-curve of order (currentOrder-1).
        const lenSub = (1 << (2 * (currentOrder - 1))) - 1; // 4^(currentOrder-1) - 1 moves

        // Determine which segment (sub-pattern or direct move) the currentK falls into.
        // Update currentPatternType, currentOrder, and currentK for the next iteration.
        // This is where the "tail call optimization" happens: we don't push a new stack frame,
        // we just update the parameters for the next "iteration" of the current frame.
        if (currentK < lenSub) {
            // Falls into the first sub-segment
            currentPatternType =
                transitions[currentPatternType][0].nextPatternType;
            currentOrder = currentOrder - 1;
            // currentK remains the same as it's the index within the first sub-segment.
        } else if (currentK === lenSub) {
            // Falls on the first connecting move
            return transitions[currentPatternType][1].move;
        } else if (currentK < 2 * lenSub + 1) {
            // Falls into the second sub-segment
            currentPatternType =
                transitions[currentPatternType][2].nextPatternType;
            currentOrder = currentOrder - 1;
            currentK = currentK - (lenSub + 1); // Adjust k for the new sub-segment's start
        } else if (currentK === 2 * lenSub + 1) {
            // Falls on the second connecting move
            return transitions[currentPatternType][3].move;
        } else if (currentK < 3 * lenSub + 2) {
            // Falls into the third sub-segment
            currentPatternType =
                transitions[currentPatternType][4].nextPatternType;
            currentOrder = currentOrder - 1;
            currentK = currentK - (2 * lenSub + 2); // Adjust k
        } else if (currentK === 3 * lenSub + 2) {
            // Falls on the third connecting move
            return transitions[currentPatternType][5].move;
        } else {
            // Falls into the fourth sub-segment
            currentPatternType =
                transitions[currentPatternType][6].nextPatternType;
            currentOrder = currentOrder - 1;
            currentK = currentK - (3 * lenSub + 3); // Adjust k
        }
        // Loop continues with the updated `currentPatternType`, `currentOrder`, `currentK`
    }
}

/**
 * A generator function to yield characters of the infinite Hilbert word H one by one.
 * This directly simulates the logic of a Turing Machine generating the word,
 * using an iterative, non-recursive, non-coordinate-based approach.
 *
 * Time complexity per yielded character: O(log K) for the K-th character (due to `getKthMoveIterative`).
 * Space complexity (work tape): O(log K) for storing variables within `getKthMoveIterative` (K is globalK).
 *
 * @returns {Generator<Move, void, unknown>}
 */
export function* infiniteHilbertWordGenerator() {
    let globalK = 0; // Current index of the character to generate.

    let prevOrder = undefined;
    // Loop indefinitely to generate the infinite word.
    while (true) {
        // Determine the minimum order `n` such that H_n contains `globalK`.
        // The length of H_n is 4^n - 1 moves.
        // We need an odd `order` such that `(1 << (2 * order)) - 1` covers `globalK`.
        let order = (globalK + 1).toString(4).length + 1;
        if (order % 2 == 0) {
            order -= 1;
        }

        // if (prevOrder !== order) {
        //     // 0 1
        //     // 3 3
        //     // 63 5
        //     // 1023 7
        //     // 16383 9
        //     console.log(globalK, order);
        //     prevOrder = order;
        // }

        // Use the iterative function to get the character at the current global index.
        // The canonical Hilbert curve usually starts with pattern 'A'.
        const char = getKthMoveIterative("A", order, globalK);

        yield char; // Yield the generated character.

        globalK++; // Move to the next character.
    }
}
