/**
 * Get data from LS
 */
export function lsGet(key) {
    var data = JSON.parse(localStorage.getItem(key));
    return (data != null ) ? data : null;
}

/**
 * Set data into LS
 */
export function lsSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}