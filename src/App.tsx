import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createWorker, createScheduler, PSM } from 'tesseract.js';
import getColors from 'get-image-colors';
import Jimp from 'jimp';

import {
  CHARLIST_POSITION,
  CHARLIST_TIME,
  CHARLIST_USERNAME,
  CTR_MAX_PLAYERS,
  MIME_JPEG,
  PLAYERS,
  PSM_SINGLE_CHAR,
  PSM_SINGLE_LINE
} from './constants';
import { applyRatio, cleanString, getCloserString, numberRange } from './utils';

const language = 'eng';

const getExtract = (info: any, index = 0, type: 'time' | 'pseudo' | 'position') => {
  const { width, height } = info;
  const left = applyRatio(0.64, width);
  const top = applyRatio(0.265, height);
  const widthCrop = applyRatio(0.27, width);
  const heightCrop = applyRatio(0.425, height);

  const ratioTime = 0.73;
  const ratioEnd = 0.03;
  const ratioLeftOffsetName = 0.27;
  const ratioEndPosition = 0.1;
  const antiRatioTime = 1 - ratioTime - ratioEnd;

  const rectangle = {
    top: applyRatio(index / 8, heightCrop),
    height: applyRatio(1 / 8, heightCrop)
  };

  const topExt = top + rectangle.top;
  const heightExt = rectangle.height;

  const leftExtTime = left + applyRatio(ratioTime, widthCrop);
  const widthExtTime = applyRatio(antiRatioTime, widthCrop);

  const leftExtName = left + applyRatio(ratioLeftOffsetName, widthCrop);
  const widthExtName = applyRatio(1 - antiRatioTime - ratioLeftOffsetName - ratioEnd, widthCrop);

  if (type === 'position') {
    const extract = {
      left: left,
      top: topExt,
      width: applyRatio(ratioEndPosition, widthCrop),
      height: heightExt
    };

    return extract;
  }

  const isTime = type === 'time';
  const leftExt = isTime ? leftExtTime : leftExtName;
  const widthExt = isTime ? widthExtTime : widthExtName;

  const extract = {
    left: leftExt,
    top: topExt,
    width: widthExt,
    height: heightExt
  };

  return extract;
};

const App = () => {
  const onMount = async () => {
    // TODO: initialize?
    setOnMountOver(true);
    setSelectIsDisabled(false);
  };

  const doOCR = async () => {
    if (!onMountOver) return;
    setSelectIsDisabled(true);

    const schedulerTime = createScheduler();
    const schedulerUsername = createScheduler();
    const schedulerPosition = createScheduler();

    const workerTime1 = createWorker({
      logger: (m: any) => console.log(m)
    });

    const workerUsername1 = createWorker({
      logger: (m: any) => console.log(m)
    });

    const workerPosition1 = createWorker({
      logger: (m: any) => console.log(m)
    });

    schedulerTime.addWorker(workerTime1);
    schedulerUsername.addWorker(workerUsername1);
    schedulerPosition.addWorker(workerPosition1);

    const div = document.getElementById('img-show');
    if (div) div.innerHTML = '';

    setOcr('Loading engine for position');
    await workerPosition1.load();
    setOcr('Loading engine for username');
    await workerUsername1.load();
    setOcr('Loading engine for time');
    await workerTime1.load();

    setOcr('Loading language for position');
    await workerPosition1.loadLanguage(language);
    setOcr('Loading language for username');
    await workerUsername1.loadLanguage(language);
    setOcr('Loading language for time');
    await workerTime1.loadLanguage(language);

    setOcr('Initializing engine for position');
    await workerPosition1.initialize(language);
    setOcr('Initializing engine for username');
    await workerUsername1.initialize(language);
    setOcr('Initializing engine for time');
    await workerTime1.initialize(language);

    setOcr('Setting parameter for position');
    await workerPosition1.setParameters({
      tessedit_char_whitelist: CHARLIST_POSITION,
      tessedit_pageseg_mode: PSM_SINGLE_CHAR as any
    });

    setOcr('Setting parameter for username');
    await workerUsername1.setParameters({
      tessedit_char_whitelist: CHARLIST_USERNAME,
      tessedit_pageseg_mode: PSM_SINGLE_LINE as any
    });

    setOcr('Setting parameter for time');
    await workerTime1.setParameters({
      tessedit_char_whitelist: CHARLIST_TIME,
      tessedit_pageseg_mode: PSM_SINGLE_LINE as any
    });

    const playerIndexes = numberRange(0, CTR_MAX_PLAYERS - 1);

    const promisesX = async (playerIndex: number, type: 'time' | 'pseudo' | 'position', info: any, imsTrans: any) => {
      const imgTransCopy = imgTrans.clone();
      let scheduler = null;
      if (type === 'time') scheduler = schedulerTime;
      else if (type === 'pseudo') scheduler = schedulerUsername;
      else scheduler = schedulerPosition;
      const dimensions = getExtract(info, playerIndex, type);

      const extracted = imgTransCopy.crop(dimensions.left, dimensions.top, dimensions.width, dimensions.height);
      const options = {
        count: 2,
        type: MIME_JPEG
      };

      const buffer: any = await extracted.getBufferAsync(MIME_JPEG);
      const rgb = await getColors(buffer, options).then((colors: any) => {
        console.log('🚀 ~ rgb ~ colors', playerIndex, colors);
        return [colors[0].rgb(), colors[1].rgb()];
      });

      const shouldInvert = rgb[0][0] < rgb[1][0] && rgb[0][1] < rgb[1][1] && rgb[0][2] < rgb[1][2];
      const extractedFin = shouldInvert ? extracted.invert() : extracted;
      extractedFin.getBase64(MIME_JPEG, (err: any, src: string) => {
        var img = document.createElement('img');
        img.setAttribute('src', src);
        const div = document.getElementById('img-show');
        if (div) div.appendChild(img);
      });

      const bufferFin: any = await extractedFin.getBufferAsync(MIME_JPEG);
      return scheduler.addJob('recognize', bufferFin);
    };

    const pathInput = `https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/input/IMG${imgIndex}.JPG`;
    setOcr('Reading the image');
    let imgTrans: any;
    try {
      const imgJimp = await Jimp.read(pathInput);

      setOcr('Rotating the image');
      imgTrans = imgJimp.rotate(-6.2).grayscale();

      imgTrans.getBase64(MIME_JPEG, (err: any, src: string) => {
        var img = document.createElement('img');
        img.setAttribute('src', src);
        const div = document.getElementById('img-show');
        if (div) div.appendChild(img);
      });

      const w = imgTrans.bitmap.width;
      const h = imgTrans.bitmap.height;
      const info = { width: w, height: h };
      console.log('info.width', info.width, 'info.height', info.height);

      const promisesPositions = playerIndexes.map((playerIndex) => promisesX(playerIndex, 'position', info, imgTrans));
      const promisesNames = playerIndexes.map((playerIndex) => promisesX(playerIndex, 'pseudo', info, imgTrans));
      const promisesTimes = playerIndexes.map((playerIndex) => promisesX(playerIndex, 'time', info, imgTrans));

      setOcr('Starting text recognition');
      const results = await Promise.all([...promisesPositions, ...promisesNames, ...promisesTimes]);
      const resultsText = results.map((r) => cleanString((r as any).data.text));

      const resultsPositions = resultsText.slice(0, 8);
      console.log('🚀 ~ file: App.tsx ~ line 269 ~ doOCR ~ resultsPositions', resultsPositions);
      const resultsNames = resultsText.slice(8, 16);
      const resultsTimes = resultsText.slice(16);

      const data: string[] = [];
      playerIndexes.forEach((playerIndex) => {
        const playerGuess = resultsNames[playerIndex];
        const d = {
          g: playerGuess,
          position: resultsPositions[playerIndex],
          player: getCloserString(playerGuess, PLAYERS),
          time: resultsTimes[playerIndex]
        };
        data.push(d as any);
      });

      setOcr(JSON.stringify(data));
      setSelectIsDisabled(false);

      await schedulerTime.terminate();
      await schedulerUsername.terminate();
      await schedulerPosition.terminate();
    } catch (err) {
      setOcr(`Unable to open image ${(err as any).toString()}. Please restart.`);
      setSelectIsDisabled(false);
    }
  };

  const [ocr, setOcr] = React.useState('Pick an image');
  const [selectIsDisabled, setSelectIsDisabled] = React.useState(true);
  const [onMountOver, setOnMountOver] = React.useState(false);
  const [imgIndex, setImgIndex] = React.useState(1);

  React.useEffect(() => {
    doOCR();
  }, [imgIndex]);

  React.useEffect(() => {
    onMount();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImgIndex(Number(e.target.value));
  };

  const src = `https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/input/IMG${imgIndex}.JPG`;
  const options = numberRange(1, 5);

  return (
    <HelmetProvider>
      <Helmet>
        <title>CTR OCR</title>
        <link rel="canonical" href="https://sebranly.github.io/ctr-ocr" />
      </Helmet>
      <div className="main">
        <h1 className="white">CTR OCR</h1>
        <select disabled={selectIsDisabled} onChange={onChange}>
          {options.map((option: number) => (
            <option key={option} label={option.toString()} value={option}>
              Image {option}
            </option>
          ))}
        </select>
        <img alt={`Example ${imgIndex}`} src={src} />
        <div>{ocr}</div>
        <div id="img-show"></div>
      </div>
    </HelmetProvider>
  );
};

export default App;
