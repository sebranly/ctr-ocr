import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createWorker, createScheduler } from 'tesseract.js';
import { Category, Result } from './types';
import getColors from 'get-image-colors';
import Jimp from 'jimp';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { isMobile } from 'react-device-detect';
import { sortBy } from 'lodash';

import {
  CTR_MAX_PLAYERS,
  LOADING_LAST_STATE,
  MIME_JPEG,
  PLACEHOLDER_CPUS,
  PLACEHOLDER_PLAYERS,
  URL_CPUS,
  WEBSITE_DEFAULT_LANGUAGE,
  WEBSITE_TITLE,
  WEBSITE_VERSION
} from './constants';
import {
  cleanString,
  formatCpuPlayers,
  getCloserString,
  getExtract,
  getParams,
  getPlayers,
  getReferencePlayers,
  isHumanPlayer,
  numberRange,
  validateUsernames
} from './utils';

const language = 'eng';

const App = () => {
  const renderDots = () => {
    if (step === 0) return null;

    const classes = step === LOADING_LAST_STATE ? 'dots' : 'dots sticky';

    return <div className={classes}>{numberRange(1, LOADING_LAST_STATE).map(renderDot)}</div>;
  };

  const renderDot = (index: number) => {
    const classColorPrefix = index === LOADING_LAST_STATE ? 'bg-green' : 'bg-red';
    const classColorSuffix = index > step ? '-off' : '';
    const classColor = `${classColorPrefix}${classColorSuffix}`;
    const classes = `dot ${classColor}`;
    return <span key={index} className={classes}></span>;
  };

  const renderTable = (index: number) => {
    return (
      <table className="flex-1">
        <thead>
          <tr>
            <th>Position</th>
            {includeCpuPlayers && <th>Type</th>}
            <th>Name</th>
          </tr>
        </thead>
        {renderBody(index)}
      </table>
    );
  };

  const renderCroppedImage = (index: number) => {
    if (!croppedImages || croppedImages.length <= index) return null;

    const classes = isMobile ? 'img-show max-width-100' : 'img-show max-width-45';

    return <img alt="Cropped Results" className={classes} src={croppedImages[index]} />;
  };

  const renderImages = () => {
    if (isMobile) {
      return imagesURLs.map((imageSrc: string, index: number) => (
        <img alt="tbd" className="img-full max-width-100 block" key={`${imageSrc}-${index}`} src={imageSrc} />
      ));
    }

    return (
      <div className="flex-container center">
        {imagesURLs.map((imageSrc: string, index: number) => (
          <img alt="tbd" className="img-full max-width-45 flex-1" key={`${imageSrc}-${index}`} src={imageSrc} />
        ))}
      </div>
    );
  };

  const renderBody = (index: number) => {
    const renderOption = (option: string) => {
      const label = `${option}`;
      return (
        <option key={option} label={label} value={option}>
          {label}
        </option>
      );
    };

    const renderOptions = () => {
      const optionsResultsPlayerHuman = getPlayers(players).sort();
      if (!includeCpuPlayers) {
        return optionsResultsPlayerHuman.map(renderOption);
      }

      const optionsResultsPlayerCpu = getPlayers(cpuPlayers).sort();

      return (
        <>
          <optgroup label="Human">{optionsResultsPlayerHuman.map(renderOption)}</optgroup>
          <optgroup label="CPUs">{optionsResultsPlayerCpu.map(renderOption)}</optgroup>
        </>
      );
    };

    return (
      <tbody>
        {resultsOcr[index].map((resultOcr: Result, indexPlayer: number) => {
          const { position, username } = resultOcr;
          const key = `${position}-${username}`;

          return (
            <tr key={key}>
              <td>{position}</td>
              {includeCpuPlayers && <td>{isHumanPlayer(username, players) ? '👤' : '🤖'}</td>}
              <td>
                <select onChange={onChangeResultsPlayer(index, indexPlayer)} value={username}>
                  {renderOptions()}
                </select>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  const renderRace = (index: number) => {
    const labelRace = `Race ${index + 1}`;
    const validationUsernames = validateUsernames(resultsOcr[index].map((r: Result) => r.username));

    return (
      <div key={index}>
        <h3>{labelRace}</h3>
        {renderCroppedImage(index)}
        <div className="flex-container results">{renderTable(index)}</div>
        {!validationUsernames.correct && <div className="red">{validationUsernames.errMsg}</div>}
      </div>
    );
  };

  const renderRaces = () => {
    if (!resultsOcr || resultsOcr.length === 0) return null;

    return (
      <>
        <div className="center">
          <h2>Results</h2>
          {resultsOcr.map((_resultOcr: Result[], index: number) => renderRace(index))}
        </div>
      </>
    );
  };

  const renderCpuMainSection = () => {
    return (
      <>
        <h3>CPUs</h3>
        {renderCpuSection()}
      </>
    );
  };

  const renderMainSection = () => {
    if (nbPlayersTyped === 0) return null;

    return (
      <>
        {renderCpuMainSection()}
        <h2>Images</h2>
        <div className="text-center mb">
          <div className="ml block mb">
            Select screenshots in JPEG format, taken right when Returning to Lobby was around 14 seconds
          </div>
          <div className="ml block mb">Screenshots will be ordered alphabetically by name</div>
          <div className="ml block mb">
            An example:{' '}
            <a
              href="https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/input/IMG1.JPG"
              rel="noopener noreferrer"
              title="Example of valid JPEG screenshot"
              target="_blank"
            >
              Example of valid JPEG screenshot
            </a>
          </div>
          <input
            className="inline"
            disabled={selectIsDisabled}
            type="file"
            multiple
            accept={MIME_JPEG}
            onChange={onChangeImage}
          />
          <input
            className="inline-block ml"
            type="button"
            value="Start recognition"
            disabled={selectIsDisabled || !imagesURLs || imagesURLs.length === 0}
            onClick={doOCR}
          />
        </div>
        {renderImages()}
        {renderRaces()}
      </>
    );
  };

  const renderCpuSection = () => {
    if (!cpuData || Object.keys(cpuData).length === 0) return <div className="text-center mb">{PLACEHOLDER_CPUS}</div>;

    const optionsCpuLanguages = Object.keys(cpuData);
    const textCheckbox = shouldIncludeCpuPlayers
      ? `Automatically activated bots because ${nbPlayersTyped} human player(s) was/were filled out of a total of ${nbPlayers} players`
      : 'Check this if there were bots during the race';

    return (
      <>
        <div className="text-center mb">
          <input
            name="includeCpuPlayers"
            type="checkbox"
            checked={includeCpuPlayers}
            onChange={onCpuCheckboxChange}
            disabled={shouldIncludeCpuPlayers}
          />
          <div className="ml inline">{textCheckbox}</div>
        </div>
        {includeCpuPlayers && (
          <>
            <div className="text-center mb">
              Bots are automatically determined based on the language and cannot be edited
            </div>
            <div className="inline mr">Language in images</div>
            <select onChange={onChangeCpuLanguage} value={cpuLanguage}>
              {optionsCpuLanguages.map((option: string) => {
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
              placeholder={PLACEHOLDER_CPUS}
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
    fetch(URL_CPUS)
      .then((response) => response.json())
      .then((data) => {
        setCpuData(data);
        setCpuPlayers(formatCpuPlayers((data as any)[WEBSITE_DEFAULT_LANGUAGE]));
      });
  };

  const doOCR = async () => {
    if (!onMountOver) return;

    setSelectIsDisabled(true);
    setStep(0);
    setResultsOcr([]);
    setCroppedImages([]);

    const schedulerUsername = createScheduler();

    const workerUsername = createWorker({
      // logger: (m: any) => console.log(m)
    });

    schedulerUsername.addWorker(workerUsername);

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

    const promisesX = async (playerIndex: number, category: Category, info: any, imgTransCopy: any) => {
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

      const bufferFin: any = await extractedFin.getBufferAsync(MIME_JPEG);
      return scheduler.addJob('recognize', bufferFin);
    };

    setStep(2);
    setOcr('Reading the images...');

    let resultsOcrTemp: Result[][] = [];
    let croppedImagesTemp: string[] = [];

    for (let i = 0; i < imagesURLs.length; i++) {
      let imgTrans: any;

      try {
        const imgJimp = await Jimp.read(imagesURLs[i]);
        const imageIndicator = `${i + 1}/${imagesURLs.length}`;

        setOcr(`Generating cropped image ${imageIndicator}...`);
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

        // eslint-disable-next-line no-loop-func
        extractedCrop.getBase64(MIME_JPEG, (err: any, src: string) => {
          croppedImagesTemp = [...croppedImagesTemp, src];
        });

        const promisesNames = playerIndexes.map((playerIndex) =>
          promisesX(playerIndex, Category.Username, info, imgTrans.grayscale().clone())
        );

        setOcr(`Starting text recognition ${imageIndicator}...`);
        // TODO: cannot anymore
        // setStep(3);
        const results = await Promise.all(promisesNames);
        const resultsNames = results.map((r) => cleanString((r as any).data.text));

        const dataResults: Result[] = [];
        const referencePlayers = getReferencePlayers(players, cpuPlayers, includeCpuPlayers);
        playerIndexes.forEach((playerIndex) => {
          const playerGuess = resultsNames[playerIndex];
          const result: Result = {
            username: getCloserString(playerGuess, referencePlayers),
            position: playerIndex + 1
          };

          dataResults.push(result);
        });

        resultsOcrTemp = [...resultsOcrTemp, dataResults];
      } catch (err) {
        // TODO: have better error handling
        setOcr(`Unable to open image ${(err as any).toString()}. Please restart.`);
        setSelectIsDisabled(false);
      }
    }

    setResultsOcr(resultsOcrTemp);
    setCroppedImages(croppedImagesTemp);
    setOcr('');
    setStep(LOADING_LAST_STATE);
    setSelectIsDisabled(false);

    await schedulerUsername.terminate();
  };

  const { width, height } = useWindowSize();
  const [step, setStep] = React.useState(0);
  const [ocr, setOcr] = React.useState('');
  const [images, setImages] = React.useState<any[]>([]);
  const [imagesURLs, setImagesURLs] = React.useState<any[]>([]);
  const [croppedImages, setCroppedImages] = React.useState<any[]>([]);
  const [nbPlayers, setNbPlayers] = React.useState(CTR_MAX_PLAYERS);
  const [cpuLanguage, setCpuLanguage] = React.useState(WEBSITE_DEFAULT_LANGUAGE);
  const [selectIsDisabled, setSelectIsDisabled] = React.useState(true);
  const [onMountOver, setOnMountOver] = React.useState(false);
  const [resultsOcr, setResultsOcr] = React.useState<Result[][]>([]);
  const [players, setPlayers] = React.useState<string>('');
  const [cpuPlayers, setCpuPlayers] = React.useState<string>(PLACEHOLDER_CPUS);
  const [cpuData, setCpuData] = React.useState<any>({});
  const [includeCpuPlayers, setIncludeCpuPlayers] = React.useState(false);

  // TODO: do uniq
  const nbPlayersTyped = getPlayers(players).length;
  const shouldIncludeCpuPlayers = nbPlayersTyped < nbPlayers;

  React.useEffect(() => {
    onMount();
  }, []);

  React.useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: any[] = [];
    const sortImages = sortBy(images, (image: any) => image.name);
    sortImages.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImagesURLs(newImageUrls);
  }, [images]);

  React.useEffect(() => {
    if (shouldIncludeCpuPlayers && !includeCpuPlayers) {
      setIncludeCpuPlayers(true);
    }
  }, [shouldIncludeCpuPlayers, includeCpuPlayers]);

  const onPlayersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlayers(e.currentTarget.value);
  };

  const onChangeImage = (e: any) => {
    setImages([...e.target.files]);
  };

  const onChangeNbPlayers = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNbPlayers(Number(e.target.value));
  };

  const onChangeCpuLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCpuLanguage(e.target.value);
    setCpuPlayers(formatCpuPlayers(cpuData[e.target.value]));
  };

  const onChangeResultsPlayer =
    (indexResultOcr: number, indexPlayer: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!resultsOcr || resultsOcr.length < indexResultOcr) return;
      const copy = [...resultsOcr];
      copy[indexResultOcr][indexPlayer].username = e.target.value;
      setResultsOcr(copy);
    };

  const onCpuCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeCpuPlayers(e.target.checked);
  };

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
        {step === LOADING_LAST_STATE && <Confetti width={width} height={height} numberOfPieces={800} recycle={false} />}
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
          <textarea
            className={`textarea-${classPlatform}`}
            disabled={selectIsDisabled}
            placeholder={PLACEHOLDER_PLAYERS}
            rows={nbPlayers}
            value={players}
            onChange={onPlayersChange}
          />
          {renderMainSection()}
        </div>
        <div className="mt2 text-center">{`v${WEBSITE_VERSION}`}</div>
      </div>
    </HelmetProvider>
  );
};

export default App;
