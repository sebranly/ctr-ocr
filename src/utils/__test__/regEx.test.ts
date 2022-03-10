import { REGEX_TIME } from '../regEx';

describe('Regular Expressions utils', () => {
  let regex: () => RegExp;
  let result: boolean;
  let testFalse: string[];
  let testTrue: string[];

  const runTrueAndFalseTests = () => {
    it('returns true', () => {
      testTrue.forEach((str) => {
        result = regex().test(str);
        expect(result).toBe(true);
      });
    });

    it('returns false', () => {
      testFalse.forEach((str) => {
        result = regex().test(str);
        expect(result).toBe(false);
      });
    });
  };

  describe('REGEX_TIME', () => {
    beforeAll(() => {
      testTrue = ['1:00:00', '1:11:11', '11:11:11', '1:34:23', '999:59:99', '1:10:69', '102:11:97', '100:12:99'];
      testFalse = ['bonjour', '1:00', '00:00', '1:00:00b', '1;00;00', '1:60:00', '1:69:00', '01:00:00', '.-.1-111'];
      regex = () => REGEX_TIME;
    });

    runTrueAndFalseTests();
  });
});
