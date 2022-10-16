// @ts-check

/**
 * Cookieを許可しない場合例外が発生する
 * @param {string} key
 * @param {string} value
 */
export function localStorageSetItem(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (_) {
        // do nothing
    }
}
