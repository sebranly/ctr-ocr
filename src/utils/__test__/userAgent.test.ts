import UAParser from 'ua-parser-js';
import { isMobileUA, isChromeUA, isFirefoxUA } from '../userAgent';

const IPHONE_SAFARI = `Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E8301 Safari/602.1`;
const DESKTOP_CHROME = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36`;
const DESKTOP_FIREFOX = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0`;
const DESKTOP_SAFARI = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4`;

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
