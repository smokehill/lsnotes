const enJson = require('../build/js/i18n/en.json');
const ruJson = require('../build/js/i18n/ru.json');

const mainKeys = ['sidebar', 'list', 'settings', 'modal', 'months'];
const compare = (a, b) => a === b;

test('en.json', () => {
  expect(compare(
    Object.keys(enJson).toString(),
    mainKeys.toString()
  )).toBeTruthy();
});

test('ru.json', () => {
  expect(compare(
    Object.keys(ruJson).toString(),
    mainKeys.toString()
  )).toBeTruthy();
});