import { DEBUG_MODE } from '../constants/general';

const logTime = (label: string, end = false) => {
  if (!DEBUG_MODE) return;

  if (end) {
    console.timeEnd(label);
  } else {
    console.time(label);
  }
};

const logMsg = (msg: any) => {
  if (!DEBUG_MODE) return;

  console.log(msg);
};

export { logMsg, logTime };
