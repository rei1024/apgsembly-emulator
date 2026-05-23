/**
 * 厳密にスタックを維持し続ける、無限ヒルベルト生成（完全ループ版）
 */
export function* generateInfiniteHilbertPureLoop() {
    const stack = [];
    let currentDepth = 1;
    let currentType = "A";
    // 最初のパーツ
    stack.push({ type: "expand", rule: currentType, depth: currentDepth });
    while (true) {
        // スタックが空になった＝現在の世代（currentDepth）をすべて出力し終えた
        if (stack.length === 0) {
            // 1つ上の世代へ移行
            const nextDepth = currentDepth + 1;
            if (currentType === "A") {
                // 自分が最初の 'A' だったとして、規則A の「残りの部分」をスタックに積む
                // 規則A: - B F + A F A + F B -
                // 逆順でプッシュ:
                stack.push({ type: "command", value: "-" });
                stack.push({ type: "expand", rule: "B", depth: currentDepth });
                stack.push({ type: "command", value: "F" });
                stack.push({ type: "expand", rule: "A", depth: currentDepth });
                stack.push({ type: "expand", rule: "A", depth: currentDepth });
                stack.push({ type: "command", value: "+" });
                stack.push({ type: "command", value: "F" });
            } else {
                // 規則B: + A F - B F B - F A +
                // 逆順でプッシュ:
                stack.push({ type: "command", value: "+" });
                stack.push({ type: "expand", rule: "A", depth: currentDepth });
                stack.push({ type: "command", value: "F" });
                stack.push({ type: "expand", rule: "B", depth: currentDepth });
                stack.push({ type: "expand", rule: "B", depth: currentDepth });
                stack.push({ type: "command", value: "-" });
                stack.push({ type: "command", value: "F" });
            }
            currentDepth = nextDepth;
            // このまま次のループに進み、今積んだ親の残りのタスクを消化し始める
            continue;
        }
        const task = stack.pop();
        if (task.type === "command") {
            yield task.value;
        } else {
            const { rule, depth } = task;
            if (depth === 0) {
                continue;
            }
            if (rule === "A") {
                stack.push({ type: "command", value: "-" });
                stack.push({ type: "expand", rule: "B", depth: depth - 1 });
                stack.push({ type: "command", value: "F" });
                stack.push({ type: "expand", rule: "A", depth: depth - 1 });
                stack.push({ type: "expand", rule: "A", depth: depth - 1 });
                stack.push({ type: "command", value: "+" });
                stack.push({ type: "command", value: "F" });
                stack.push({ type: "expand", rule: "B", depth: depth - 1 });
                stack.push({ type: "command", value: "-" });
            } else {
                stack.push({ type: "command", value: "+" });
                stack.push({ type: "expand", rule: "A", depth: depth - 1 });
                stack.push({ type: "command", value: "F" });
                stack.push({ type: "expand", rule: "B", depth: depth - 1 });
                stack.push({ type: "expand", rule: "B", depth: depth - 1 });
                stack.push({ type: "command", value: "-" });
                stack.push({ type: "command", value: "F" });
                stack.push({ type: "expand", rule: "A", depth: depth - 1 });
                stack.push({ type: "command", value: "+" });
            }
        }
    }
}
