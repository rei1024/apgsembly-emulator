// @ts-check

/**
 * 例外を握りつぶす
 *
 * Cookieを許可しない場合例外が発生する
 * @param {string} key
 * @param {string} value
 */
export const localStorageSetItem = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (_) {
        // do nothing
    }
};

/**
 * 例外を握りつぶす
 *
 * Cookieを許可しない場合例外が発生する
 * @param {string} key
 */
export const localStorageRemoveItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (_) {
        // do nothing
    }
};

/**
 * 例外を握りつぶす
 *
 * Cookieを許可しない場合例外が発生する
 * @param {string} key
 * @returns {string | null}
 */
export const localStorageGetItem = (key) => {
    try {
        return localStorage.getItem(key);
    } catch (_) {
        return null;
    }
};

/**
 * @param {string} old
 * @param {string} new_
 */
export function localStorageMigrate(old, new_) {
    try {
        const current = localStorageGetItem(old);
        if (current != null) {
            localStorageRemoveItem(old);
            localStorageSetItem(new_, current);
        }
    } catch (_) {
        // nop
    }
}
