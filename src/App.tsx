import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createWorker, createScheduler } from 'tesseract.js';
import { Category } from './types';
import getColors from 'get-image-colors';
import Jimp from 'jimp';

import { CTR_MAX_PLAYERS, MIME_JPEG, SEPARATOR_PLAYERS } from './constants';
import { applyRatio, cleanString, getCloserString, getParams, numberRange } from './utils';
import { REGEX_TIME } from './utils/regEx';

const language = 'eng';

const getExtract = (info: any, index = 0, category: Category) => {
  const { width, height } = info;
  const left = applyRatio(0.64, width);
  const top = applyRatio(0.265, height);
  const widthCrop = applyRatio(0.27, width);
  const heightCrop = applyRatio(0.425, height);

  if (category === Category.All) {
    const extract = {
      left,
      top,
      width: widthCrop,
      height: heightCrop
    };

    return extract;
  }

  const ratioTime = 0.73;
  const ratioEnd = 0.03;
  const ratioLeftOffsetName = 0.27;
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
      <table className="flex-1">
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
          const timeIsValid = REGEX_TIME.test(time);
          const emojiTime = timeIsValid ? '✅' : '❌';

          return (
            <tr key={key}>
              <td>{position}</td>
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

    const workerTime = createWorker({
      logger: (m: any) => console.log(m)
    });

    const workerUsername = createWorker({
      logger: (m: any) => console.log(m)
    });

    schedulerTime.addWorker(workerTime);
    schedulerUsername.addWorker(workerUsername);

    const div = document.getElementsByClassName('img-show')[0];
    if (div) div.innerHTML = '';

    setOcr('Loading engine for username');
    await workerUsername.load();
    setOcr('Loading engine for time');
    await workerTime.load();

    setOcr('Loading language for username');
    await workerUsername.loadLanguage(language);
    setOcr('Loading language for time');
    await workerTime.loadLanguage(language);

    setOcr('Initializing engine for username');
    await workerUsername.initialize(language);
    setOcr('Initializing engine for time');
    await workerTime.initialize(language);

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
      else scheduler = schedulerUsername;
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

      // TODO: activate for debugging only
      // extractedFin.getBase64(MIME_JPEG, (err: any, src: string) => {
      //   var img = document.createElement('img');
      //   img.setAttribute('src', src);
      //   const div = document.getElementsByClassName('img-show')[0];
      //   if (div) div.appendChild(img);
      // });

      const bufferFin: any = await extractedFin.getBufferAsync(MIME_JPEG);
      return scheduler.addJob('recognize', bufferFin);
    };

    const pathInput = `https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/input/IMG${imgIndex}.JPG`;
    setOcr('Reading the image');
    let imgTrans: any;
    try {
      const imgJimp = await Jimp.read(pathInput);

      setOcr('Generating cropped image');
      imgTrans = imgJimp.rotate(-6.2).grayscale();

      const w = imgTrans.bitmap.width;
      const h = imgTrans.bitmap.height;
      const info = { width: w, height: h };
      const dimensionsCrop = getExtract(info, 0, Category.All);

      const imgTransCopy = imgTrans.clone();
      const extractedCrop = imgTransCopy.crop(
        dimensionsCrop.left,
        dimensionsCrop.top,
        dimensionsCrop.width,
        dimensionsCrop.height
      );

      extractedCrop.getBase64(MIME_JPEG, (err: any, src: string) => {
        var img = document.createElement('img');
        img.setAttribute('src', src);
        const div = document.getElementsByClassName('img-show')[0];
        if (div) div.appendChild(img);
      });

      console.log('info.width', info.width, 'info.height', info.height);

      const promisesNames = playerIndexes.map((playerIndex) =>
        promisesX(playerIndex, Category.Username, info, imgTrans)
      );
      const promisesTimes = playerIndexes.map((playerIndex) => promisesX(playerIndex, Category.Time, info, imgTrans));

      setOcr('Starting text recognition');
      const results = await Promise.all([...promisesNames, ...promisesTimes]);
      const resultsText = results.map((r) => cleanString((r as any).data.text));

      const resultsNames = resultsText.slice(0, CTR_MAX_PLAYERS);
      console.log('resultsNames', resultsNames);
      const resultsTimes = resultsText.slice(CTR_MAX_PLAYERS);
      console.log('resultsTimes', resultsTimes);

      const data: any = [];
      const referencePlayers = players.split(SEPARATOR_PLAYERS);
      console.log('🚀 ~ file: App.tsx ~ line 258 ~ doOCR ~ referencePlayers', referencePlayers);
      playerIndexes.forEach((playerIndex) => {
        const playerGuess = resultsNames[playerIndex];
        const d = {
          username: getCloserString(playerGuess, referencePlayers),
          position: playerIndex + 1,
          time: resultsTimes[playerIndex]
        };
        data.push(d as any);
      });

      setResultsOcr(data);

      setOcr('Recognition is done and successful');
      setSelectIsDisabled(false);

      await schedulerTime.terminate();
      await schedulerUsername.terminate();
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
  const [players, setPlayers] = React.useState<string>('');

  React.useEffect(() => {
    doOCR();
  }, [imgIndex]);

  React.useEffect(() => {
    onMount();
  }, []);

  const onPlayersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlayers(e.currentTarget.value);
  };

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
        <textarea rows={CTR_MAX_PLAYERS} value={players} onChange={onPlayersChange} />
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
        <img id="img-full" alt={`Example ${imgIndex}`} src={src} />
        <div className="flex-container results">
          {renderTable()}
          <div className="img-show flex-1"></div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default App;
