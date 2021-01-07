import { i18n, listingDateFormat, modalDateFormat } from 'helpers.js';

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

test('i18n', () => {
  expect(i18n('sidebar.compose_btn')).toBe('Compose');
  expect(i18n('sidebar.menu_notes')).toBe('Notes');
  expect(i18n('sidebar.menu_trash')).toBe('Trash');
  expect(i18n('sidebar.menu_settings')).toBe('Settings');
});

test('listingDateFormat', () => {
  const dayAgo = new Date(new Date - 60 * 60 * 30 * 1000);
  const dayAgoUnit = dayAgo.toString().split(' ');
  const yearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const yearAgoUnit = yearAgo.toString().split(' ');

  expect(listingDateFormat(dayAgo.getTime())).toBe(`${dayAgoUnit[1]} ${Number(dayAgoUnit[2])}`);
  expect(listingDateFormat(yearAgo.getTime())).toBe(`${yearAgoUnit[1]} ${Number(yearAgoUnit[2])}, ${yearAgoUnit[3]}`);
});

test('modalDateFormat', () => {
  const now = new Date();
  const minAgo = new Date(new Date - 1 * 60 * 1000);
  const hourAgo = new Date(new Date - 60 * 60 * 1000);
  const dayAgo = new Date(new Date - 60 * 60 * 30 * 1000);
  const [dayAgoM, dayAgoD] = dayAgo.toISOString().slice(5,10).split('-');
  const yearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const [yearAgoY, yearAgoM, yearAgoD] = yearAgo.toISOString().slice(0,10).split('-');

  expect(modalDateFormat(now.getTime())).toBe('All changes saved');
  expect(modalDateFormat(minAgo.getTime())).toBe('Last edit: 1 min. ago');
  expect(modalDateFormat(hourAgo.getTime())).toBe('Last edit: 1 h. ago');
  expect(modalDateFormat(dayAgo.getTime())).toBe(`Last edit: ${months[dayAgoM]} ${Number(dayAgoD)}`);
  expect(modalDateFormat(yearAgo.getTime())).toBe(`Last edit: ${months[yearAgoM]} ${Number(yearAgoD)}, ${yearAgoY}`);
});