// @ts-check

import { setupFrequencyInput } from "./components/frequency_input.js";
import { removeCustomError, setCustomError } from "./util/validation_ui.js";
import { setupOnInputFileText } from "./util/input-file.js";
import { idle } from "./util/idle.js";
import {
    localStorageGetItem,
    localStorageMigrate,
    localStorageRemoveItem,
    localStorageSetItem,
} from "./util/local-storage.js";
import { hasFocus } from "./util/has-focus.js";

import {
    $b2dDetail,
    $b2dFlipUpsideDown,
    $b2dHidePointer,
    $binaryRegisterDetail,
    $breakpointConfig,
    $breakpointInputSelect,
    $breakpointSelect,
    $clearBreakpointButton,
    $configButton,
    // Modal
    $configModalContent,
    $darkMode,
    $darkModeLabel,
    $examples,
    $fileImport,
    $frequencyInput,
    $input,
    $printerDetail,
    $reset,
    $showBreakpointConfig,
    // Stats
    $statsModal,
    $step,
    $stepInput,
    $toggle,
    $unaryRegisterDetail,
    $viewStateDiagramButton,
    binaryConfig,
} from "./bind.js";

import { App } from "./app.js";
import { scrollToTop } from "./util/scroll-to-top.js";
import { setupExamples } from "./components/examples.js";

/** instance */
const app = new App();

// Reset button
$reset.addEventListener("click", () => {
    app.reset();
});

// Toggle button
$toggle.addEventListener("click", () => {
    app.toggle();
});

// Step button
$step.addEventListener("click", () => {
    app.doStep();
});

// サンプル
setupExamples(app);

// 周波数の設定
setupFrequencyInput($frequencyInput, app);

// 開閉で描画
$b2dDetail.addEventListener("toggle", () => {
    app.renderB2D();
});

$printerDetail.addEventListener("toggle", () => {
    app.renderPrinter();
});

$binaryRegisterDetail.addEventListener("toggle", () => {
    app.renderBinary();
});

$unaryRegisterDetail.addEventListener("toggle", () => {
    app.renderUnary();
});

// ファイルインポート
setupOnInputFileText($fileImport, (result) => {
    app.setInputAndReset(result);
    // スクロール
    scrollToTop();
});

// ** Modal ** //

$stepInput.addEventListener("input", () => {
    const n = Number($stepInput.value);
    if (isNaN(n) || n <= 0 || !Number.isInteger(n)) {
        setCustomError($stepInput, "Enter a positive integer");
        app.stepConfig = 1;
    } else {
        removeCustomError($stepInput);
        app.stepConfig = n;
    }
    app.render();
});

/**
 * @param {HTMLInputElement} $checkbox
 * @param {string} key
 */
const setupCheckbox = ($checkbox, key) => {
    $checkbox.addEventListener("change", () => {
        app.render();
        localStorageSetItem(key, $checkbox.checked.toString());
    });
};

// バイナリを非表示にする
const HIDE_BITS_KEY = "apge_hide_binary";
setupCheckbox(binaryConfig.$hideBits, HIDE_BITS_KEY);

const REVERSE_BITS_KEY = "apge_reverse_binary";
setupCheckbox(binaryConfig.$reverseBits, REVERSE_BITS_KEY);

const SHOW_BINARY_IN_DECIMAL_KEY = "apge_show_binary_in_decimal";
setupCheckbox(
    binaryConfig.$showBinaryValueInDecimal,
    SHOW_BINARY_IN_DECIMAL_KEY,
);

const SHOW_BINARY_IN_HEX_KEY = "apge_show_binary_in_hex";
setupCheckbox(binaryConfig.$showBinaryValueInHex, SHOW_BINARY_IN_HEX_KEY);

// B2D
$b2dHidePointer.addEventListener("change", () => {
    app.renderB2D();
    app.renderPrinter();
});

const B2D_FLIP_UPSIDE_DOWN_KEY = "apge_b2d_flip_upside_down";
setupCheckbox($b2dFlipUpsideDown, B2D_FLIP_UPSIDE_DOWN_KEY);

// showの場合クラスが追加されない
$statsModal.addEventListener("shown.bs.modal", () => {
    app.renderStats();
});

$clearBreakpointButton.addEventListener("click", () => {
    $breakpointSelect.value = "";
    $breakpointInputSelect.value = "*";
});

$showBreakpointConfig.addEventListener("change", () => {
    if ($showBreakpointConfig.checked) {
        $breakpointConfig.classList.remove("d-none");
        $breakpointConfig.classList.add("d-flex");
    } else {
        $breakpointConfig.classList.remove("d-flex");
        $breakpointConfig.classList.add("d-none");
        $breakpointSelect.value = "";
        $breakpointInputSelect.value = "*";
    }
});

$viewStateDiagramButton.addEventListener("click", () => {
    // 1MB以上は無し
    if ($input.value.length >= 10 ** 6) {
        return;
    }
    localStorageSetItem("state-diagram-input", $input.value);
    window.open(
        "./tools/diagram/index.html",
        undefined,
        "noreferrer=yes,noopener=yes",
    );
});

const DARK_ATTR_KEY = "apge_dark";
const ON = "on";

// ダークモード
// bodyタグ直下で設定してDark mode flashingを防ぐ
const DARK_MODE_KEY = "dark_mode";
$darkMode.addEventListener("change", () => {
    if ($darkMode.checked) {
        localStorageSetItem(DARK_MODE_KEY, ON);
        document.body.setAttribute(DARK_ATTR_KEY, ON);
    } else {
        localStorageRemoveItem(DARK_MODE_KEY);
        document.body.removeAttribute(DARK_ATTR_KEY);
    }

    $darkModeLabel.textContent = $darkMode.checked ? "On" : "Off";

    // アニメーションを付与
    const ANIMATE = "dark-mode-anim";
    document.body.classList.add(ANIMATE);
    $configModalContent.classList.add(ANIMATE);
    setTimeout(() => {
        document.body.classList.remove(ANIMATE);
        $configModalContent.classList.remove(ANIMATE);
    }, 500);
});

// キーボード入力
// keyboard input
// Enter: toggle Start and Stop
// Space: Step
document.addEventListener("keydown", (e) => {
    // 入力中は無し
    if (hasFocus() || e.isComposing || e.metaKey || e.shiftKey || e.ctrlKey) {
        return;
    }

    switch (e.code) {
        case "Enter": {
            app.toggle();
            break;
        }
        case "Space": {
            // ステップが無効化されていないときだけ
            if (!$step.disabled) {
                // スペースで下に移動することを防ぐ
                e.preventDefault();
                app.doStep();
            }
            break;
        }
    }
});

// ファイルドロップ
$input.addEventListener("drop", async (event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files.item(0);
    if (file != undefined) {
        app.setInputAndReset(await file.text());
        // スクロール
        scrollToTop();
    }
});

// ボタンの有効化
$examples.disabled = false;
$configButton.disabled = false;

// 初回描画
// first render
app.render();

// APGMからの初期コード
idle(() => {
    const INIT_CODE = "initial_code";
    const initCode = localStorageGetItem(INIT_CODE);
    if (initCode !== null) {
        localStorageRemoveItem(INIT_CODE);
        app.setInputAndReset(initCode);
    }
});

// 実行時間が掛かる処理をまとめる
idle(() => {
    // 2025-01-18
    localStorageMigrate("hide_binary", HIDE_BITS_KEY);
    localStorageMigrate("show_binary_in_decimal", SHOW_BINARY_IN_DECIMAL_KEY);
    localStorageMigrate("reverse_binary", REVERSE_BITS_KEY);
    localStorageMigrate("b2d_flip_upside_down", B2D_FLIP_UPSIDE_DOWN_KEY);
    localStorageMigrate("show_binary_in_hex", SHOW_BINARY_IN_HEX_KEY);

    // デフォルトはtrue
    if (localStorageGetItem(SHOW_BINARY_IN_DECIMAL_KEY) === null) {
        localStorageSetItem(SHOW_BINARY_IN_DECIMAL_KEY, "true");
    }

    /**
     * @type {{ key: string; checkbox: HTMLInputElement}[]}
     */
    const items = [
        { key: B2D_FLIP_UPSIDE_DOWN_KEY, checkbox: $b2dFlipUpsideDown },
        { key: REVERSE_BITS_KEY, checkbox: binaryConfig.$reverseBits },
        { key: HIDE_BITS_KEY, checkbox: binaryConfig.$hideBits },
        {
            key: SHOW_BINARY_IN_DECIMAL_KEY,
            checkbox: binaryConfig.$showBinaryValueInDecimal,
        },
        {
            key: SHOW_BINARY_IN_HEX_KEY,
            checkbox: binaryConfig.$showBinaryValueInHex,
        },
    ];

    for (const { key, checkbox } of items) {
        if (localStorageGetItem(key) === "true") {
            checkbox.checked = true;
        }
    }

    // ダークモードについてはbodyタグ直下でも設定する
    // チェックボタンはここで処理する
    if (localStorageGetItem(DARK_MODE_KEY) === ON) {
        document.body.setAttribute(DARK_ATTR_KEY, ON);
        $darkMode.checked = true;
        $darkModeLabel.textContent = "On";
    }
    app.render();
});

// PWA
if ("serviceWorker" in navigator) {
    idle(async () => {
        // await navigator.serviceWorker.register("./service-worker.js?2022-09-14");

        // // check for update
        // if (navigator.onLine) {
        //     navigator.serviceWorker
        //     .getRegistrations()
        //     .then((registrations) => registrations.forEach((reg) => reg.update()));
        // }

        // unregister all
        const registrations = await navigator.serviceWorker.getRegistrations();
        registrations.map((registration) => registration.unregister());
    });
}
