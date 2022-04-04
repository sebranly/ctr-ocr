import UAParser from 'ua-parser-js';

const isMobileUA = (userAgent: UAParser.IResult) => {
  const type = userAgent.device?.type ?? '';

  return ['mobile', 'tablet'].includes(type);
};

const isKeywordUA = (userAgent: UAParser.IResult, keyword: string) => {
  const name = userAgent.browser?.name ?? '';

  return name.includes(keyword);
};

const isChromeUA = (userAgent: UAParser.IResult) => isKeywordUA(userAgent, 'Chrome');
const isFirefoxUA = (userAgent: UAParser.IResult) => isKeywordUA(userAgent, 'Firefox');

export { isMobileUA, isChromeUA, isFirefoxUA };
