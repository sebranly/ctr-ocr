import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createWorker, createScheduler } from 'tesseract.js';
import { Category } from './types';
import getColors from 'get-image-colors';
import Jimp from 'jimp';

import { CTR_MAX_PLAYERS, MIME_JPEG, PLAYERS } from './constants';
import { applyRatio, cleanString, getCloserString, getParams, numberRange, positionIsValid } from './utils';
import { REGEX_TIME } from './utils/regEx';

const language = 'eng';

const getExtract = (info: any, index = 0, category: Category) => {
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

  if (category === Category.Position) {
    const extract = {
      left: left,
      top: topExt,
      width: applyRatio(ratioEndPosition, widthCrop),
      height: heightExt
    };

    return extract;
  }

  const isTime = category === Category.Time;
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
  const renderTable = () => {
    if (!resultsOcr) return null;

    return (
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        {renderBody()}
      </table>
    );
  };

  const renderBody = () => {
    if (!resultsOcr) return null;

    return (
      <tbody>
        {(resultsOcr as any).map((rawLine: any) => {
          const { position, username, time } = rawLine;
          const key = `${position}-${username}-${time}`;
          const posIsValid = positionIsValid(position, CTR_MAX_PLAYERS);
          const timeIsValid = REGEX_TIME.test(time);
          const emojiPos = posIsValid ? '✅' : '❌';
          const emojiTime = timeIsValid ? '✅' : '❌';

          return (
            <tr key={key}>
              <td>
                {emojiPos} {position}
              </td>
              <td>{username}</td>
              <td>
                {emojiTime} {time}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  const onMount = async () => {
    // TODO: initialize?
    setOnMountOver(true);
    setSelectIsDisabled(false);
  };

  const doOCR = async () => {
    if (!onMountOver) return;
    setSelectIsDisabled(true);
    setResultsOcr(undefined);

    const schedulerTime = createScheduler();
    const schedulerUsername = createScheduler();
    const schedulerPosition = createScheduler();

    const workerTime = createWorker({
      logger: (m: any) => console.log(m)
    });

    const workerUsername = createWorker({
      logger: (m: any) => console.log(m)
    });

    const workerPosition = createWorker({
      logger: (m: any) => console.log(m)
    });

    schedulerTime.addWorker(workerTime);
    schedulerUsername.addWorker(workerUsername);
    schedulerPosition.addWorker(workerPosition);

    const div = document.getElementById('img-show');
    if (div) div.innerHTML = '';

    setOcr('Loading engine for position');
    await workerPosition.load();
    setOcr('Loading engine for username');
    await workerUsername.load();
    setOcr('Loading engine for time');
    await workerTime.load();

    setOcr('Loading language for position');
    await workerPosition.loadLanguage(language);
    setOcr('Loading language for username');
    await workerUsername.loadLanguage(language);
    setOcr('Loading language for time');
    await workerTime.loadLanguage(language);

    setOcr('Initializing engine for position');
    await workerPosition.initialize(language);
    setOcr('Initializing engine for username');
    await workerUsername.initialize(language);
    setOcr('Initializing engine for time');
    await workerTime.initialize(language);

    setOcr('Setting parameter for position');
    const posParams = getParams(Category.Position);
    await workerPosition.setParameters(posParams);

    setOcr('Setting parameter for username');
    const usernameParams = getParams(Category.Username);
    await workerUsername.setParameters(usernameParams);

    setOcr('Setting parameter for time');
    const timeParams = getParams(Category.Time);
    await workerTime.setParameters(timeParams);

    const playerIndexes = numberRange(0, CTR_MAX_PLAYERS - 1);

    const promisesX = async (playerIndex: number, category: Category, info: any, imsTrans: any) => {
      const imgTransCopy = imgTrans.clone();
      let scheduler = null;
      if (category === Category.Time) scheduler = schedulerTime;
      else if (category === Category.Username) scheduler = schedulerUsername;
      else scheduler = schedulerPosition;
      const dimensions = getExtract(info, playerIndex, category);

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

      const promisesPositions = playerIndexes.map((playerIndex) =>
        promisesX(playerIndex, Category.Position, info, imgTrans)
      );
      const promisesNames = playerIndexes.map((playerIndex) =>
        promisesX(playerIndex, Category.Username, info, imgTrans)
      );
      const promisesTimes = playerIndexes.map((playerIndex) => promisesX(playerIndex, Category.Time, info, imgTrans));

      setOcr('Starting text recognition');
      const results = await Promise.all([...promisesPositions, ...promisesNames, ...promisesTimes]);
      const resultsText = results.map((r) => cleanString((r as any).data.text));

      const resultsPositions = resultsText.slice(0, CTR_MAX_PLAYERS);
      console.log('resultsPositions', resultsPositions);
      const resultsNames = resultsText.slice(CTR_MAX_PLAYERS, CTR_MAX_PLAYERS * 2);
      console.log('resultsNames', resultsNames);
      const resultsTimes = resultsText.slice(CTR_MAX_PLAYERS * 2);
      console.log('resultsTimes', resultsTimes);

      const data: any = [];
      playerIndexes.forEach((playerIndex) => {
        const playerGuess = resultsNames[playerIndex];
        const d = {
          username: playerGuess,
          position: resultsPositions[playerIndex],
          playerFix: getCloserString(playerGuess, PLAYERS),
          time: resultsTimes[playerIndex]
        };
        data.push(d as any);
      });

      setResultsOcr(data);

      setOcr('Recognition is done and successful');
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
  const [resultsOcr, setResultsOcr] = React.useState(undefined);

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
  const options = [...numberRange(1, 5), ...numberRange(11, 20)];

  return (
    <HelmetProvider>
      <Helmet>
        <title>CTR OCR</title>
        <link rel="canonical" href="https://sebranly.github.io/ctr-ocr" />
      </Helmet>
      <div className="main">
        <h1 className="white">CTR OCR</h1>
        <div>{ocr}</div>
        <select disabled={selectIsDisabled} onChange={onChange}>
          {options.map((option: number) => {
            const label = `Image ${option}`;
            return (
              <option key={option} label={label} value={option}>
                {label}
              </option>
            );
          })}
        </select>
        <img alt={`Example ${imgIndex}`} src={src} />
        {renderTable()}
        <div id="img-show"></div>
      </div>
    </HelmetProvider>
  );
};

export default App;
