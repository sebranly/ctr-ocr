import UAParser from 'ua-parser-js';
import { isMobileUA, isChromeUA, isFirefoxUA } from '../userAgent';
import { DESKTOP_CHROME, DESKTOP_FIREFOX, DESKTOP_SAFARI, IPHONE_SAFARI } from '../__mocks__/userAgent';

test('isMobileUA', () => {
  expect(isMobileUA(new UAParser(IPHONE_SAFARI).getResult())).toBe(true);
  expect(isMobileUA(new UAParser(DESKTOP_CHROME).getResult())).toBe(false);
  expect(isMobileUA(new UAParser(DESKTOP_FIREFOX).getResult())).toBe(false);
  expect(isMobileUA(new UAParser(DESKTOP_SAFARI).getResult())).toBe(false);
});

test('isFirefoxUA', () => {
  expect(isFirefoxUA(new UAParser(IPHONE_SAFARI).getResult())).toBe(false);
  expect(isFirefoxUA(new UAParser(DESKTOP_CHROME).getResult())).toBe(false);
  expect(isFirefoxUA(new UAParser(DESKTOP_FIREFOX).getResult())).toBe(true);
  expect(isFirefoxUA(new UAParser(DESKTOP_SAFARI).getResult())).toBe(false);
});

test('isChromeUA', () => {
  expect(isChromeUA(new UAParser(IPHONE_SAFARI).getResult())).toBe(false);
  expect(isChromeUA(new UAParser(DESKTOP_CHROME).getResult())).toBe(true);
  expect(isChromeUA(new UAParser(DESKTOP_FIREFOX).getResult())).toBe(false);
  expect(isChromeUA(new UAParser(DESKTOP_SAFARI).getResult())).toBe(false);
});
