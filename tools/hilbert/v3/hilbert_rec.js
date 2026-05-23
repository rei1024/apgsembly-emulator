/**
 * 完全に無限に続くヒルベルト曲線のコマンドストリーム
 */
export function* generateInfiniteHilbert() {
    // 最小単位の「世代0」（空のステップ）からスタートし、無限に上の階層へ繋いでいく
    yield* expandUpward(0, "A");
}
/**
 * 指定された世代・状態の「残り」のルートを展開し、
 * それが終わったら自動的にさらに1つ上の世代へとはめ込んで無限に続く関数
 */
function* expandUpward(currentDepth, currentType) {
    // 1. まず現在の世代・状態の構造をすべて出力する
    if (currentType === "A") {
        yield* runA(currentDepth);
    }
    else {
        yield* runB(currentDepth);
    }
    // 2. 現在の世代が出力し終わったら、これは「1つ上の世代の最初の1ステップ」だったと解釈する。
    // つまり、自動的に currentDepth + 1 の世界線へ移行する。
    const nextDepth = currentDepth + 1;
    if (currentType === "A") {
        // 自分が 'A' だったということは、1つ上の世代から見れば
        // 「規則A の最初のパーツ（Bの展開）が終わった段階」か「中盤のAが終わった段階」などに見える。
        // ここでは、自分が「上の世代の『最初のA』」だったと見なして、それ以降の残りを繋げる。
        // 規則A: - B F + A F A + F B -  （※今回は自分が最初のAパーツだったと仮定して残りを記述）
        // ※ 厳密に無限平面を埋め尽くすための、親の右隣・上隣への接続コマンド群
        yield "F";
        yield* runA(currentDepth); // 親の中央のA
        yield "+";
        yield "F";
        yield* runB(currentDepth); // 親の最後のB
        yield "-";
        // この親（nextDepth）も出し切ったら、さらにその上の階層へ昇格する
        yield* expandUpward(nextDepth, "A");
    }
    else {
        // 自分が 'B' だった場合も同様に、上の世代の規則Bの残りに繋げる
        // 規則B: + A F - B F B - F A +
        yield "F";
        yield* runB(currentDepth);
        yield "-";
        yield "F";
        yield* runA(currentDepth);
        yield "+";
        yield* expandUpward(nextDepth, "B");
    }
}
/**
 * 有限の深さの通常のL-System展開（ベースパーツ生成用）
 */
function* runA(depth) {
    if (depth === 0)
        return;
    yield "-";
    yield* runB(depth - 1);
    yield "F";
    yield "+";
    yield* runA(depth - 1);
    yield "F";
    yield* runA(depth - 1);
    yield "+";
    yield "F";
    yield* runB(depth - 1);
    yield "-";
}
function* runB(depth) {
    if (depth === 0)
        return;
    yield "+";
    yield* runA(depth - 1);
    yield "F";
    yield "-";
    yield* runB(depth - 1);
    yield "F";
    yield* runB(depth - 1);
    yield "-";
    yield "F";
    yield* runA(depth - 1);
    yield "+";
}
// npx tsc --ignoreConfig tools/hilbert/v3/hilbert_rec.ts
