/**
 * Get data from Local Storage
 */
export function lsGet(key) {
  var data = JSON.parse(localStorage.getItem(key));
  return (data != null ) ? data : null;
}

/**
 * Set data into Local Storage
 */
export function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Date format for a notes listing
 */
export function listingDateFormat(time) {
  let date = new Date(time).toDateString();
  date = date.split(' ');
  const currentYear = new Date().getFullYear().toString();
  let [month, day, year] = [date[1], Number(date[2]), date[3]];
  return (year == currentYear) ? `${month} ${day}` : `${month} ${day}, ${year}`;
}

/**
 * Date format for a note form
 */
export function formDateFormat(time) {
  const mNames = {
    'Sep': 'September',
    'Oct': 'October',
    'Nov': 'November',
    'Dec': 'December',
    'Jan': 'January',
    'Feb': 'February',
    'Mar': 'March',
    'Apr': 'Aprile',
    'May': 'May',
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'August'
  };
  let cDate, iDate, iSDate; // current date, incoming date, incoming date string
  cDate = new Date(); 
  iDate = new Date(time);
  iSDate = iDate.toDateString();
  iSDate = iSDate.split(' ');
  const currentYear = new Date().getFullYear().toString();
  let [month, day, year] = [iSDate[1], Number(iSDate[2]), iSDate[3]];
  month = mNames[month];
  if (year == currentYear) {
    let h, i; // hours, minutes
    i = Math.abs(Math.round(((cDate.getTime() - iDate.getTime()) / 1000) / 60));
    h = Math.round(i / 60);
    if (i == 0) {
      return 'All changes saved';
    } else if (i < 60) {
      return (i % 10 == 1) ? `Last edit: ${i} minute ago` : `Last edit: ${i} minutes ago`;
    } else if (h < 12) {
      return (h % 10 == 1) ? `Last edit: ${h} hour ago` : `Last edit: ${h} hours ago`;
    } else {
      return `Last edit: ${month} ${day}`;
    }
  } else {
    return `Last edit: ${month} ${day}, ${year}`;
  }
}