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
  CANONICAL_URL,
  CTR_MAX_PLAYERS,
  EXAMPLE_IMAGES_FOLDER,
  FINAL_PROGRESS,
  INITIAL_PROGRESS,
  MAX_HEIGHT_IMG,
  MIME_JPEG,
  MIME_PNG,
  PLACEHOLDER_CPUS,
  PLACEHOLDER_PLAYERS,
  SUPPORTED_PLATFORMS,
  URL_CPUS,
  WEBSITE_DEFAULT_LANGUAGE,
  WEBSITE_TITLE,
  WEBSITE_VERSION
} from './constants';
import {
  calculateProgress,
  cleanString,
  formatCpuPlayers,
  getCloserString,
  getExtract,
  getMimeType,
  getParams,
  getPlayers,
  getReferencePlayers,
  isHumanPlayer,
  logError,
  logTime,
  numberRange,
  validateUsernames
} from './utils';

const language = 'eng';

const App = () => {
  const renderProgressBar = () => {
    if ([0, FINAL_PROGRESS].includes(progress)) return null;
    const percent = Math.floor(progress * 100);
    const percentString = `${percent}%`;
    return (
      <div className="progress-bar sticky">
        <div className="pl progress" style={{ maxWidth: percentString }}>
          {percentString}
        </div>
      </div>
    );
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
          <optgroup key="human" label="Human">
            {optionsResultsPlayerHuman.map(renderOption)}
          </optgroup>
          <optgroup key="cpus" label="CPUs">
            {optionsResultsPlayerCpu.map(renderOption)}
          </optgroup>
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
                <select
                  disabled={selectIsDisabled}
                  onChange={onChangeResultsPlayer(index, indexPlayer)}
                  value={username}
                >
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

    const jpgImage = `${EXAMPLE_IMAGES_FOLDER}IMG1.JPG`;
    const pngImage = `${EXAMPLE_IMAGES_FOLDER}IMG1.PNG`;

    return (
      <>
        {renderCpuMainSection()}
        <h2>Images</h2>
        <div className="text-center mb">
          <div className="ml block mb bold">Screenshots will be ordered alphabetically by name</div>
          <div className="ml block mb italic">
            {`Only screenshots from the following platforms have been tested so far: ${SUPPORTED_PLATFORMS}`}
          </div>
          <div className="ml block mb">
            Select screenshots in JPG/JPEG (recommended) or PNG format, taken right when Returning to Lobby was around
            14 seconds
          </div>
          <div className="ml block mb">
            JPG/JPEG is recommended because it provides the same quality of results and is lighter than PNG
          </div>
          <div className="ml block mb">
            <a href={jpgImage} rel="noopener noreferrer" title="Example of valid JPEG screenshot" target="_blank">
              Example of a valid JPG/JPEG screenshot
            </a>
          </div>
          <div className="ml block mb">
            <a href={pngImage} rel="noopener noreferrer" title="Example of valid PNG screenshot" target="_blank">
              Example of a valid PNG screenshot
            </a>
          </div>
          <input
            className="inline mt"
            disabled={selectIsDisabled}
            type="file"
            multiple
            accept={[MIME_JPEG, MIME_PNG].join(', ')}
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
            <select disabled={selectIsDisabled} onChange={onChangeCpuLanguage} value={cpuLanguage}>
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
    setProgress(INITIAL_PROGRESS);
    setResultsOcr([]);
    setCroppedImages([]);

    const schedulerUsername = createScheduler();

    const workerUsername = createWorker({
      // logger: (m: any) => console.log(m)
    });

    schedulerUsername.addWorker(workerUsername);

    await workerUsername.load();
    setProgress(calculateProgress(1 / 4));

    await workerUsername.loadLanguage(language);
    setProgress(calculateProgress(2 / 4));

    await workerUsername.initialize(language);
    setProgress(calculateProgress(3 / 4));

    const usernameParams = getParams(Category.Username);
    await workerUsername.setParameters(usernameParams);
    setProgress(calculateProgress(4 / 4));

    const playerIndexes = numberRange(0, nbPlayers - 1);

    const promisesX = async (playerIndex: number, category: Category, info: any, imgTransCopy: any) => {
      const scheduler = schedulerUsername;
      const dimensions = getExtract(info, playerIndex, category);
      const { extension } = info;
      const mimeType = getMimeType(extension);

      const extracted = imgTransCopy.crop(dimensions.left, dimensions.top, dimensions.width, dimensions.height);
      const options = {
        count: 2,
        type: mimeType
      };

      const buffer: any = await extracted.getBufferAsync(mimeType);
      const rgb = await getColors(buffer, options).then((colors: any) => {
        return [colors[0].rgb(), colors[1].rgb()];
      });

      const shouldInvert = rgb[0][0] < rgb[1][0] && rgb[0][1] < rgb[1][1] && rgb[0][2] < rgb[1][2];
      const extractedFin = shouldInvert ? extracted.invert() : extracted;

      const bufferFin: any = await extractedFin.getBufferAsync(mimeType);
      return scheduler.addJob('recognize', bufferFin);
    };

    let resultsOcrTemp: Result[][] = [];
    let croppedImagesTemp: string[] = [];

    for (let i = 0; i < imagesURLs.length; i++) {
      // TODO: type it as well as info
      let imgTrans: any;

      try {
        logTime('imgRead');

        const imgJimpTemp = await Jimp.read(imagesURLs[i]);

        logTime('imgRead', true);

        const initialHeight = imgJimpTemp.bitmap.height;
        const shouldResize = initialHeight > MAX_HEIGHT_IMG;

        if (shouldResize) logTime('imgResize');

        const imgJimp = shouldResize ? imgJimpTemp.resize(Jimp.AUTO, MAX_HEIGHT_IMG) : imgJimpTemp;

        if (shouldResize) logTime('imgResize', true);

        logTime('imgRotate');

        imgTrans = imgJimp.rotate(-6.2);

        logTime('imgRotate', true);

        logTime('imgRest');

        const h = imgTrans.bitmap.height;
        const w = imgTrans.bitmap.width;
        const extension = imgTrans.getExtension();
        const info = { height: h, extension, width: w };
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

        logTime('imgRest', true);

        logTime('promisesCreation');

        const promisesNames = playerIndexes.map((playerIndex) =>
          promisesX(playerIndex, Category.Username, info, imgTrans.grayscale().clone())
        );

        logTime('promisesCreation', true);

        setProgress(calculateProgress(1, i, imagesURLs.length));
        logTime('promisesResolve');

        const results = await Promise.all(promisesNames);

        logTime('promisesResolve', true);

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
        logError(err);
        setSelectIsDisabled(false);
      }
    }

    setResultsOcr(resultsOcrTemp);
    setCroppedImages(croppedImagesTemp);
    setProgress(1);
    setSelectIsDisabled(false);

    await schedulerUsername.terminate();
  };

  const { width, height } = useWindowSize();
  const [progress, setProgress] = React.useState(0);
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
    setResultsOcr([]);
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
  const classBgDisabled = selectIsDisabled ? 'bg-grey' : 'bg-white';

  return (
    <HelmetProvider>
      <Helmet>
        <title>{WEBSITE_TITLE}</title>
        <link rel="canonical" href={CANONICAL_URL} />
      </Helmet>
      <div className="main">
        <h1>{WEBSITE_TITLE}</h1>
        <div className="w3-light-grey"></div>
        {progress === FINAL_PROGRESS && <Confetti width={width} height={height} numberOfPieces={800} recycle={false} />}
        <div className={`center main-content-${classPlatform} ${classBgDisabled}`}>
          {renderProgressBar()}
          <h2>Players</h2>
          <h3>Number of players</h3>
          <div className="text-center mb">This includes CPUs if any</div>
          <select disabled={selectIsDisabled} onChange={onChangeNbPlayers} value={nbPlayers}>
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
