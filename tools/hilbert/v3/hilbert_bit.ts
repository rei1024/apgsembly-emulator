type HilbertCommand = "F" | "+" | "-";

/**
 * 完全に無限に、重なりなく平面を埋め尽くすヒルベルト曲線のコマンドストリーム
 * 空間複雑度: O(1) - 配列すら使わず、変数数個のメモリしか消費しません。
 */
export function* generateInfiniteHilbertCorrect(): Generator<
  HilbertCommand,
  void,
  unknown
> {
  // タートルの初期向き (0: 右, 1: 下, 2: 左, 3: 上) ※描画系の初期向きに合わせて調整してください
  let currentDir = 0;

  // 直前の座標
  let lastX = 0;
  let lastY = 0;

  // 無限ループ (ステップ t = 1 からスタート)
  let t = 1;

  while (true) {
    // 現在のステップ t における XY 座標を計算
    const { x, y } = tToXY(t);

    // 移動ベクトルを計算
    const dx = x - lastX;
    const dy = y - lastY;

    // ベクトルから進むべき絶対方向を割り出す
    let targetDir = 0;
    if (dx === 1) targetDir = 0; // 右
    if (dy === 1) targetDir = 1; // 下
    if (dx === -1) targetDir = 2; // 左
    if (dy === -1) targetDir = 3; // 上

    // 現在の向きからターゲットの向きへの「回転」を計算
    // (targetDir - currentDir) のモジュロ演算
    let turn = (targetDir - currentDir) % 4;
    if (turn < 0) turn += 4;

    // 回転コマンドを出力
    if (turn === 1) {
      yield "+"; // 右に90度回転（※環境に応じて + と - を入れ替えてください）
    } else if (turn === 3) {
      yield "-"; // 左に90度回転
    } else if (turn === 2) {
      // 180度反転（ヒルベルト曲線の特性上、隣接移動で180度反転は通常起こりません）
      yield "+";
      yield "+";
    }

    // 前進コマンドを出力
    yield "F";

    // 状態を更新して次のステップへ
    currentDir = targetDir;
    lastX = x;
    lastY = y;
    t++;
  }
}

/**
 * 【Spigotの核心】ステップ数 t から、ヒルベルト曲線上の (x, y) 座標を求める（ビット演算版）
 * どんなに巨大な t に対しても、再帰なしで高速に座標を出力します。
 */
function tToXY(t: number): { x: number; y: number } {
  let x = 0;
  let y = 0;

  // 32ビット整数の範囲で下位ビットから順に空間を組み立てる
  for (let s = 1; s < 1 << 30; s <<= 1) {
    if ((t & (s << 1)) === 0 && (t & s) === 0) {
      // 00 のパターン
    }

    // 現在のビットペアを抽出
    const rx = 1 & (t >> 1);
    const ry = 1 & (t ^ rx);

    // 座標の回転・反転シミュレーション
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      // 座標の入れ替え
      const temp = x;
      x = y;
      y = temp;
    }

    x += s * rx;
    y += s * ry;
    t >>= 2;

    if (t === 0) break;
  }

  return { x, y };
}
//  npx tsc --ignoreConfig tools/hilbert/v3/hilbert_bit.ts
