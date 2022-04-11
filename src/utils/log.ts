import { LOG_CONSOLE } from '../constants/general';

const logTime = (label: string, end = false) => {
  if (!LOG_CONSOLE) return;

  if (end) {
    console.timeEnd(label);
  } else {
    console.time(label);
  }
};

const logMsg = (msg: any) => {
  if (!LOG_CONSOLE) return;

  console.log(msg);
};

export { logMsg, logTime };
