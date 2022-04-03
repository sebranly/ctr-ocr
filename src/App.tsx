import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createWorker, createScheduler } from 'tesseract.js';
import { Category, Progress, Result } from './types';
import getColors from 'get-image-colors';
import Jimp from 'jimp';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { isMobile } from 'react-device-detect';

import {
  CANONICAL_URL,
  CRASH_TEAM_RANKING_AUTHOR_URL,
  CTR_MAX_PLAYERS,
  EXAMPLE_IMAGES_FOLDER,
  EXAMPLE_IMAGES_FOLDER_FULL_EVENT,
  GUIDE_FOLDER,
  INITIAL_TEAM_NB,
  MAX_HEIGHT_IMG,
  MIME_JPEG,
  MIME_PNG,
  PLACEHOLDER_CPUS,
  PLACEHOLDER_PLAYERS,
  PROJECT_URL,
  URL_CPUS,
  WEBSITE_DEFAULT_LANGUAGE,
  WEBSITE_TITLE,
  WEBSITE_VERSION
} from './constants';
import {
  cleanString,
  formatCpuPlayers,
  getCloserString,
  getColorPlayer,
  getExtract,
  getMimeType,
  getOptionsTeams,
  getParams,
  getPlayers,
  getReferencePlayers,
  getTeamNames,
  isHumanPlayer,
  logError,
  logTime,
  numberRange,
  sortCaseInsensitive,
  sortImagesByFilename,
  validateTeams,
  validateUsernames
} from './utils';
import { uniq } from 'lodash';

const language = 'eng';

const App = () => {
  const renderProgressBar = () => {
    if (ocrProgress !== Progress.Started) return null;

    return (
      <div className="progress-bar">
        <div className="progress-bar-value"></div>
        <div className="progress-bar-text">{ocrProgressText}</div>
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
      const optionsResultsPlayerHuman = getPlayers(players).sort(sortCaseInsensitive);
      if (!includeCpuPlayers) {
        return optionsResultsPlayerHuman.map(renderOption);
      }

      const optionsResultsPlayerCpu = getPlayers(cpuPlayers).sort(sortCaseInsensitive);

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

  const renderFooter = () => {
    return (
      <>
        <div className="mt2 text-center">
          Developed by{' '}
          <a href={PROJECT_URL} rel="noopener noreferrer" title="GitHub page for repository" target="_blank">
            sebranly
          </a>{' '}
          (PSN:{' '}
          <a
            href={CRASH_TEAM_RANKING_AUTHOR_URL}
            rel="noopener noreferrer"
            title="Crash Team Ranking for ZouGui28"
            target="_blank"
          >
            ZouGui28
          </a>
          ) with ❤️
        </div>
        <div className="mt2 text-center">{`Website version ${WEBSITE_VERSION}`}</div>
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

  const renderTeamMainSection = () => {
    return (
      <>
        <h3>Teams</h3>
        {renderTeamSection()}
      </>
    );
  };

  const renderImagesUpload = () => {
    const jpgImage = `${EXAMPLE_IMAGES_FOLDER}IMG1.JPG`;
    const pngImage = `${EXAMPLE_IMAGES_FOLDER}IMG1.PNG`;
    const guideImage = `${GUIDE_FOLDER}Images.md`;

    const isFFA = nbTeams === nbPlayers;

    if (!includeCpuPlayers && !isFFA && !validationTeams.correct) return null;

    return (
      <>
        <h2>Images</h2>
        <div className="text-center mb">
          <div className="ml block mb bold">Screenshots will be ordered alphabetically by name</div>
          <div className="ml block mb">
            Select screenshots in JPG/JPEG or PNG format, taken right when Returning to Lobby was around 14 seconds
          </div>
          <div className="ml block mb">
            Examples of valid screenshots:{' '}
            <a href={jpgImage} rel="noopener noreferrer" title="Example of valid JPEG screenshot" target="_blank">
              JPG/JPEG
            </a>{' '}
            and{' '}
            <a href={pngImage} rel="noopener noreferrer" title="Example of valid PNG screenshot" target="_blank">
              PNG
            </a>
          </div>
          <div className="ml block mb">
            You can upload multiple images at once, as in this{' '}
            <a
              href={EXAMPLE_IMAGES_FOLDER_FULL_EVENT}
              rel="noopener noreferrer"
              title="Example of a valid 10-race event"
              target="_blank"
            >
              10-race example
            </a>
          </div>
          <div className="ml block mb">
            For more information, please refer to the{' '}
            <a href={guideImage} rel="noopener noreferrer" title="Guide about Images" target="_blank">
              images guide
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
      </>
    );
  };

  const renderMainSection = () => {
    if (nbPlayersTyped === 0) return null;

    return (
      <>
        {renderCpuMainSection()}
        {renderTeamMainSection()}
        {renderImagesUpload()}
        {renderImages()}
        {renderRaces()}
      </>
    );
  };

  const renderTeamSection = () => {
    if (includeCpuPlayers) return <div className="text-center mb">Teams are not available when CPUs are activated</div>;

    return (
      <>
        <select disabled={selectIsDisabled} onChange={onChangeNbTeams} value={nbTeams}>
          {optionsNbTeams.map((option: number) => {
            const label = option === nbPlayers ? 'FFA' : `${option} teams`;
            return (
              <option key={option} label={label} value={option}>
                {label}
              </option>
            );
          })}
        </select>
        {renderTeamRepartition()}
      </>
    );
  };

  const onChangeTeam = (player: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const newPlayerTeams = { ...playerTeams, [player]: value };
    setPlayerTeams(newPlayerTeams);
  };

  const renderPlayerTeams = (player: string) => {
    return teams.map((team: string) => {
      const key = `${player}-${team}`;
      const isChecked = playerTeams[player] === team;

      return (
        <div className="ml inline" key={key}>
          <input
            type="radio"
            disabled={selectIsDisabled}
            id={key}
            name={player}
            value={team}
            checked={isChecked}
            onChange={onChangeTeam(player)}
          />
          <label htmlFor={key}>{team}</label>
        </div>
      );
    });
  };

  const renderPlayerTeamRepartition = (player: string) => {
    const colorPlayer = getColorPlayer(player, teams, playerTeams);
    const playerClassnames = `inline float-left ${colorPlayer}`;

    return (
      <li className="block" key={player}>
        <div className={playerClassnames}>{player}</div>
        <div className="ml inline float-right">{renderPlayerTeams(player)}</div>
      </li>
    );
  };

  const renderTeamRepartition = () => {
    const isFFA = nbTeams === nbPlayers;
    if (includeCpuPlayers) return null;
    if (isFFA) return <div className="ml block mb">Free For All means there is no need to set up teams!</div>;

    const classesValidation = validationTeams.isWarning ? 'orange' : 'red';

    return (
      <>
        <ul className="text-center no-padding mt2">
          <div className="inline-block">{playersNames.map(renderPlayerTeamRepartition)}</div>
          {!validationTeams.correct && <div className={classesValidation}>{validationTeams.errMsg}</div>}
        </ul>
      </>
    );
  };

  const renderCpuSection = () => {
    if (!cpuData || Object.keys(cpuData).length === 0) return <div className="text-center mb">{PLACEHOLDER_CPUS}</div>;

    const guideCpu = `${GUIDE_FOLDER}CPUs.md`;

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
            disabled={shouldIncludeCpuPlayers || selectIsDisabled}
          />
          <div className="ml inline">{textCheckbox}</div>
        </div>
        {includeCpuPlayers && (
          <>
            <div className="text-center mb">
              Bots are automatically determined based on the language and cannot be edited
            </div>
            <div className="ml block mb">
              For more information, please refer to the{' '}
              <a href={guideCpu} rel="noopener noreferrer" title="Guide about CPUs" target="_blank">
                CPUs guide
              </a>
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
    setOcrProgress(Progress.Started);
    setOcrProgressText('Initialization...');
    setResultsOcr([]);
    setCroppedImages([]);

    const schedulerUsername = createScheduler();

    const workerUsername = createWorker({
      // logger: (m: any) => console.log(m)
    });

    schedulerUsername.addWorker(workerUsername);

    await workerUsername.load();
    await workerUsername.loadLanguage(language);
    await workerUsername.initialize(language);
    const usernameParams = getParams(Category.Username);
    await workerUsername.setParameters(usernameParams);

    const playerIndexes = numberRange(0, nbPlayers - 1);

    const promisesX = async (
      playerIndex: number,
      category: Category,
      info: any, // TODO: type it better
      imgTransCopy: any
    ) => {
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

    // TODO: have better error handling
    for (let i = 0; i < imagesURLs.length; i++) {
      try {
        const progressText = `Image ${i + 1} out of ${imagesURLs.length}...`;
        setOcrProgressText(progressText);

        logTime('imgRead');
        const imgJimpTemp = await Jimp.read(imagesURLs[i]);
        logTime('imgRead', true);

        const initialHeight = imgJimpTemp.bitmap.height;
        const shouldResize = initialHeight > MAX_HEIGHT_IMG;

        if (shouldResize) logTime('imgResize');

        const imgJimp = shouldResize ? imgJimpTemp.resize(Jimp.AUTO, MAX_HEIGHT_IMG) : imgJimpTemp;

        if (shouldResize) logTime('imgResize', true);

        logTime('imgRotate');

        const imgTrans = imgJimp.rotate(-6.2);

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
          croppedImagesTemp.push(src);
        });

        const imgTransGray = imgTrans.grayscale();

        logTime('imgRest', true);

        logTime('promisesCreation');

        const promisesNames = playerIndexes.map((playerIndex) =>
          promisesX(playerIndex, Category.Username, info, imgTransGray.clone())
        );

        logTime('promisesCreation', true);

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

        resultsOcrTemp.push(dataResults);
      } catch (err) {
        // TODO: have better error handling
        logError(err);
        // setSelectIsDisabled(false);
      }
    }

    setResultsOcr(resultsOcrTemp);
    setCroppedImages(croppedImagesTemp);
    setOcrProgress(Progress.Done);
    setOcrProgressText('');
    // setSelectIsDisabled(false);

    await schedulerUsername.terminate();
  };

  const { width, height } = useWindowSize();
  const [ocrProgress, setOcrProgress] = React.useState(Progress.NotStarted);
  const [ocrProgressText, setOcrProgressText] = React.useState('');
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
  const [teams, setTeams] = React.useState<string[]>(getTeamNames(INITIAL_TEAM_NB));
  const [nbTeams, setNbTeams] = React.useState(INITIAL_TEAM_NB);
  const [playerTeams, setPlayerTeams] = React.useState<Record<string, string>>({});

  const nbPlayersTyped = uniq(getPlayers(players)).length;
  const shouldIncludeCpuPlayers = nbPlayersTyped < nbPlayers;

  React.useEffect(() => {
    onMount();
  }, []);

  React.useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: any[] = [];
    const sortImages = sortImagesByFilename(images);
    sortImages.forEach((image) => {
      newImageUrls.push(URL.createObjectURL(image));
    });
    setImagesURLs(newImageUrls);
  }, [images]);

  React.useEffect(() => {
    if (shouldIncludeCpuPlayers && !includeCpuPlayers) {
      setIncludeCpuPlayers(true);
    }
  }, [shouldIncludeCpuPlayers, includeCpuPlayers]);

  const onPlayersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlayers(e.currentTarget.value);

    setNbTeams(INITIAL_TEAM_NB);
    setTeams(getTeamNames(INITIAL_TEAM_NB));
    setPlayerTeams({});
  };

  const onChangeImage = (e: any) => {
    setImages([...e.target.files]);
    setResultsOcr([]);
  };

  const onChangeNbPlayers = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNbPlayers(Number(e.target.value));

    setPlayers('');

    setNbTeams(INITIAL_TEAM_NB);
    setTeams(getTeamNames(INITIAL_TEAM_NB));
    setPlayerTeams({});
  };

  const onChangeNbTeams = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNbTeams = Number(e.target.value);
    const teamNames = getTeamNames(newNbTeams);

    setNbTeams(newNbTeams);
    setTeams(teamNames);
    setPlayerTeams({});
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
  const optionsNbTeams = getOptionsTeams(nbPlayers);
  const classPlatform = isMobile ? 'mobile' : 'desktop';
  const classBgDisabled = selectIsDisabled && (!resultsOcr || resultsOcr.length === 0) ? 'bg-grey' : 'bg-white';
  const playersNames = uniq(getPlayers(players)).sort(sortCaseInsensitive);
  const validationTeams = validateTeams(playersNames, teams, playerTeams);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{WEBSITE_TITLE}</title>
        <link rel="canonical" href={CANONICAL_URL} />
      </Helmet>
      <div className="main">
        <h1>{WEBSITE_TITLE}</h1>
        <div className="w3-light-grey"></div>
        {ocrProgress === Progress.Done && (
          <Confetti width={width} height={height} numberOfPieces={800} recycle={false} />
        )}
        <div className={`center main-content-${classPlatform} ${classBgDisabled}`}>
          {renderProgressBar()}
          <h2>Introduction</h2>
          <div className="text-center mb">Please enter information from top to bottom for a smooth experience</div>
          <div className="text-center mb">At the end, we'll produce the Lorenzi markdown for you</div>
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
        {renderFooter()}
      </div>
    </HelmetProvider>
  );
};

export default App;
