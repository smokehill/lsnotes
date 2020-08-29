const months = {
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'Aprile',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August'
};

/**
 * Get data from Local Storage.
 * 
 * @param {string} key
 * @return {string|null}
 */
const lsGet = (key) => {
  const data = JSON.parse(localStorage.getItem(key));
  return (data != null) ? data : null;
};

/**
 * Set data into Local Storage.
 * 
 * @param {string} key
 * @param {string} value
 */
const lsSet = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Internationalization and localization.
 * 
 * @param {string} str
 * @return {string}
 */
const i18n = (str) => {
  const lang = lsGet('language');
  const [key1, key2] =  str.split('.');
  const dict = require(`./i18n/${lang}.json`);

  return dict[key1][key2];
}

/**
 * Date format for a notes listing.
 * 
 * @param {timestamp} time
 * @return {string}
 */
const listingDateFormat = (time) => {
  const currentYear = new Date().getFullYear().toString();
  let date = new Date(time).toISOString().slice(0,10);
  date = date.split('-');

  let [year, month, day] = [date[0], months[date[1]], Number(date[2])];
  month = month.toLowerCase().substr(0,3);

  return (year == currentYear) ? i18n(`months.${month}_s`) + ` ${day}` : i18n(`months.${month}_s`) + ` ${day}, ${year}`;
}

/**
 * Date format for a note modal.
 * 
 * @param {timestamp} time
 * @return {string}
 */
const modalDateFormat = (time) => {
  const currentYear = new Date().getFullYear().toString();
  // current date, incoming date, incoming date string
  let cDate, iDate, iSDate; 
  cDate = new Date();
  iDate = new Date(time);
  iSDate = iDate.toISOString().slice(0,10);
  iSDate = iSDate.split('-');

  let [year, month, day] = [iSDate[0], months[iSDate[1]], Number(iSDate[2])];
  month = month.toLowerCase().substr(0,3);
  month = i18n(`months.${month}_l`);

  if (year == currentYear) {
    // hours, minutes
    let h, i;
    i = Math.abs(Math.round(((cDate.getTime() - iDate.getTime()) / 1000) / 60));
    h = Math.round(i / 60);

    if (i == 0) {
      return i18n('modal.status_changes_saved') ;
    } else if (i < 60) {
      return i18n('modal.status_last_edit') + `: ${i} ` + i18n('modal.status_minutes_ago');
    } else if (h < 12) {
      return i18n('modal.status_last_edit') + `: ${h} ` + i18n('modal.status_hours_ago');
    } else {
      return i18n('modal.status_last_edit') + `: ${month} ${day}`;
    }
  } else {
    return i18n('modal.status_last_edit') + `: ${month} ${day}, ${year}`;
  }
}

export {
  lsGet,
  lsSet,
  i18n,
  listingDateFormat,
  modalDateFormat
};