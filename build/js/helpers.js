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


/**
 * Set data into LS
 */
export function dateToHuman(time) {
  let date = new Date(time).toDateString();
  date = date.split(' ');
  const currentYear = new Date().getFullYear().toString();
  const [month, day, year] = [date[1], Number(date[2]), date[3]];
  return (year == currentYear) ? `${month} ${day}` :  `${month} ${day}, ${year}`;
}