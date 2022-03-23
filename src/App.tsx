import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createWorker, createScheduler } from 'tesseract.js';
import { Category } from './types';
import getColors from 'get-image-colors';
import Jimp from 'jimp';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { isMobile } from 'react-device-detect';

import {
  CTR_MAX_PLAYERS,
  MIME_JPEG,
  PLACEHOLDER_PLAYERS,
  SEPARATOR_PLAYERS,
  WEBSITE_DEFAULT_LANGUAGE,
  WEBSITE_TITLE,
  WEBSITE_VERSION
} from './constants';
import { cleanString, getCloserString, getExtract, getParams, getReferencePlayers, numberRange } from './utils';

const language = 'eng';

const App = () => {
  const renderDots = () => {
    return <div className="dots">{numberRange(1, 4).map(renderDot)}</div>;
  };

  const renderDot = (index: number) => {
    const classColorPrefix = index === 4 ? 'green' : 'red';
    const classColorSuffix = index > step ? '-off' : '';
    const classColor = `${classColorPrefix}${classColorSuffix}`;
    const classes = `dot ${classColor}`;
    return <span key={index} className={classes}></span>;
  };

  const renderTable = () => {
    return (
      <table className="flex-1">
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
          </tr>
        </thead>
        {renderBody()}
      </table>
    );
  };

  const renderImages = () => {
    if (isMobile)
      return (
        <>
          <div className="img-show"></div>
          <img id="img-full" alt={`Example ${imgIndex}`} src={src} />
        </>
      );

    return (
      <div className="flex-container center">
        <div className="flex-1">
          <img id="img-full" alt={`Example ${imgIndex}`} src={src} />
        </div>
        <div className="img-show flex-1"></div>
      </div>
    );
  };

  const renderBody = () => {
    return (
      <tbody>
        {(resultsOcr as any).map((rawLine: any) => {
          const { position, username, time } = rawLine;
          const key = `${position}-${username}-${time}`;

          return (
            <tr key={key}>
              <td>{position}</td>
              <td>{username}</td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  const renderCPUMainSection = () => {
    if (!players) return null;

    return (
      <>
        <h3>CPUs</h3>
        {renderCPUSection()}
      </>
    );
  };

  const renderCPUSection = () => {
    if (!cpuData || Object.keys(cpuData).length === 0) return <div className="text-center mb">Loading CPUs...</div>;

    const optionsCPULanguages = Object.keys(cpuData);

    return (
      <>
        <div className="text-center mb">
          <input name="includeCpuPlayers" type="checkbox" checked={includeCpuPlayers} onChange={onCpuCheckboxChange} />
          <div className="ml inline">Check this if there were bots during the race</div>
        </div>
        {includeCpuPlayers && (
          <>
            <div className="text-center mb">
              Those are automatically determined based on the language and cannot be edited
            </div>
            <div className="inline mr">Language in images</div>
            <select onChange={onChangeCPULanguage} value={cpuLanguage}>
              {optionsCPULanguages.map((option: string) => {
                const label = `${option}`;
                return (
                  <option key={option} label={label} value={option}>
                    {label}
                  </option>
                );
              })}
            </select>
            <textarea
              className={`textarea-${classPlatform}`}
              disabled={true}
              placeholder={'Loading CPUs...'}
              rows={CTR_MAX_PLAYERS}
              value={cpuPlayers}
            />
          </>
        )}
      </>
    );
  };

  const onMount = async () => {
    // TODO: initialize?
    setOnMountOver(true);
    setSelectIsDisabled(false);
    fetch('https://sebranly.github.io/json/ctrocr/players.json')
      .then((response) => response.json())
      .then((data) => {
        setCpuData(data);
        setCpuPlayers((data as any)[WEBSITE_DEFAULT_LANGUAGE].sort().join(SEPARATOR_PLAYERS));
      });
  };

  const doOCR = async () => {
    if (!onMountOver) return;

    setSelectIsDisabled(true);
    setStep(0);
    setResultsOcr(undefined);

    const schedulerUsername = createScheduler();

    const workerUsername = createWorker({
      // logger: (m: any) => console.log(m)
    });

    schedulerUsername.addWorker(workerUsername);

    const div = document.getElementsByClassName('img-show')[0];
    if (div) div.innerHTML = '';

    setStep(1);

    setOcr('Loading engine... (1/4)');
    await workerUsername.load();

    setOcr('Loading language... (2/4)');
    await workerUsername.loadLanguage(language);

    setOcr('Initializing engine... (3/4)');
    await workerUsername.initialize(language);

    setOcr('Setting parameter... (4/4)');
    const usernameParams = getParams(Category.Username);
    await workerUsername.setParameters(usernameParams);

    const playerIndexes = numberRange(0, nbPlayers - 1);

    const promisesX = async (playerIndex: number, category: Category, info: any, imgTrans: any) => {
      const imgTransCopy = imgTrans.clone();
      const scheduler = schedulerUsername;
      const dimensions = getExtract(info, playerIndex, category);

      const extracted = imgTransCopy.crop(dimensions.left, dimensions.top, dimensions.width, dimensions.height);
      const options = {
        count: 2,
        type: MIME_JPEG
      };

      const buffer: any = await extracted.getBufferAsync(MIME_JPEG);
      const rgb = await getColors(buffer, options).then((colors: any) => {
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
    setStep(2);
    setOcr('Reading the image...');
    let imgTrans: any;
    try {
      const imgJimp = await Jimp.read(pathInput);

      setOcr('Generating cropped image...');
      imgTrans = imgJimp.rotate(-6.2);

      const w = imgTrans.bitmap.width;
      const h = imgTrans.bitmap.height;
      const info = { width: w, height: h };
      const dimensionsCrop = getExtract(info, nbPlayers, Category.All);

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

      const promisesNames = playerIndexes.map((playerIndex) =>
        promisesX(playerIndex, Category.Username, info, imgTrans.grayscale())
      );

      setOcr('Starting text recognition...');
      setStep(3);
      const results = await Promise.all(promisesNames);
      const resultsNames = results.map((r) => cleanString((r as any).data.text));

      const data: any = [];
      const referencePlayers = getReferencePlayers(players, cpuPlayers, includeCpuPlayers);
      playerIndexes.forEach((playerIndex) => {
        const playerGuess = resultsNames[playerIndex];
        const d = {
          username: getCloserString(playerGuess, referencePlayers),
          position: playerIndex + 1
        };

        data.push(d as any);
      });

      setResultsOcr(data);

      setOcr('');
      setStep(4);
      setSelectIsDisabled(false);

      await schedulerUsername.terminate();
    } catch (err) {
      setOcr(`Unable to open image ${(err as any).toString()}. Please restart.`);
      setSelectIsDisabled(false);
    }
  };

  const { width, height } = useWindowSize();
  const [step, setStep] = React.useState(0);
  const [ocr, setOcr] = React.useState('');
  const [nbPlayers, setNbPlayers] = React.useState(CTR_MAX_PLAYERS);
  const [cpuLanguage, setCpuLanguage] = React.useState(WEBSITE_DEFAULT_LANGUAGE);
  const [selectIsDisabled, setSelectIsDisabled] = React.useState(true);
  const [onMountOver, setOnMountOver] = React.useState(false);
  const [imgIndex, setImgIndex] = React.useState(1);
  const [resultsOcr, setResultsOcr] = React.useState(undefined);
  const [players, setPlayers] = React.useState<string>('');
  const [cpuPlayers, setCpuPlayers] = React.useState<string>('Loading CPUs...');
  const [cpuData, setCpuData] = React.useState<any>({});
  const [includeCpuPlayers, setIncludeCpuPlayers] = React.useState<boolean>(false);

  React.useEffect(() => {
    onMount();
  }, []);

  const onPlayersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlayers(e.currentTarget.value);
  };

  const onChangeNbPlayers = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNbPlayers(Number(e.target.value));
  };

  const onChangeCPULanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCpuLanguage(e.target.value);
    setCpuPlayers(cpuData[e.target.value].sort().join(SEPARATOR_PLAYERS));
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImgIndex(Number(e.target.value));
  };

  const onCpuCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeCpuPlayers(e.target.checked);
  };

  const src = `https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/input/IMG${imgIndex}.JPG`;
  const options = [...numberRange(1, 5), ...numberRange(11, 20)];
  const optionsNbPlayers = numberRange(2, CTR_MAX_PLAYERS);
  const classPlatform = isMobile ? 'mobile' : 'desktop';

  return (
    <HelmetProvider>
      <Helmet>
        <title>{WEBSITE_TITLE}</title>
        <link rel="canonical" href="https://sebranly.github.io/ctr-ocr" />
      </Helmet>
      <div className="main">
        <h1>{WEBSITE_TITLE}</h1>
        {step === 4 && <Confetti width={width} height={height} numberOfPieces={400} recycle={false} />}
        <div className={`center main-content-${classPlatform}`}>
          {renderDots()}
          <div className="ocr">{ocr}</div>
          <h2>Players</h2>
          <h3>Number of players</h3>
          <div className="text-center mb">This includes CPUs if any</div>
          <select onChange={onChangeNbPlayers} value={nbPlayers}>
            {optionsNbPlayers.map((option: number) => {
              const label = `${option} players`;
              return (
                <option key={option} label={label} value={option}>
                  {label}
                </option>
              );
            })}
          </select>
          <h3>Human Players</h3>
          <div className="text-center mb">Type all human players present in the races. Type one username per line.</div>
          <div className="text-center mb">
            Please note that providing no players will drastically reduce the quality of the recognition
          </div>
          <textarea
            className={`textarea-${classPlatform}`}
            placeholder={PLACEHOLDER_PLAYERS}
            rows={nbPlayers}
            value={players}
            onChange={onPlayersChange}
          />
          {renderCPUMainSection()}
          {!!resultsOcr && (
            <div className="center">
              <h2>Results</h2>
              <div className="flex-container results">{renderTable()}</div>
            </div>
          )}
          <h2>Image</h2>
          <div className="center">
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
            <input
              className="inline ml"
              type="button"
              value="Start recognition"
              disabled={selectIsDisabled}
              onClick={doOCR}
            />
          </div>
          {renderImages()}
        </div>
        <div className="mt2 text-center">{`v${WEBSITE_VERSION}`}</div>
      </div>
    </HelmetProvider>
  );
};

export default App;
