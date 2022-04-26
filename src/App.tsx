import * as React from 'react';
import './App.css';
import { createWorker, createScheduler } from 'tesseract.js';
import { Category, LorenziTeam, Progress, Result, Sign } from './types';
import getColors from 'get-image-colors';
import Jimp from 'jimp';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { isMobile } from 'react-device-detect';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NumericStepper } from '@anatoliygatt/numeric-stepper';

import {
  EXAMPLE_IMAGES_FOLDER,
  EXAMPLE_IMAGES_FOLDER_FULL_EVENT,
  GUIDE_FOLDER,
  URL_CPUS,
  VIDEO_TUTORIAL,
  WEBSITE_DEFAULT_LANGUAGE,
  WEBSITE_TITLE
} from './constants/general';
import {
  CTR_MAX_PLAYERS,
  FFA_POINTS_SCHEME,
  INITIAL_TEAMS_NB,
  LORENZI_TABLE_URL,
  MAX_HEIGHT_IMG,
  MIME_JPEG,
  MIME_PNG,
  OCR_LANGUAGE,
  PLACEHOLDER_CPUS,
  WAR_POINTS_SCHEME
} from './constants';
import { cleanString, getClosestString, getEditDistance, sortCaseInsensitive } from './utils/string';
import {
  formatCpuPlayers,
  getColorPlayer,
  getOptionsTeams,
  getParams,
  getPlayers,
  getPlayersPlaceholder,
  getPositionString,
  getReferencePlayers,
  getTeamNames,
  isHumanPlayer
} from './utils';
import { numberRange } from './utils/number';
import { getExtract, getMimeType, sortImagesByFilename } from './utils/image';
import { logMsg, logTable, logTime } from './utils/log';
import { getIncorrectRaces, validatePoints, validateTeams, validateUsernames } from './utils/validation';
import { uniq } from 'lodash';
import UAParser from 'ua-parser-js';
import { createArraySameValue, isEqual } from './utils/array';
import { createLorenzi, getInitialLorenziTeams } from './utils/lorenzi';
import { Footer } from './components/Footer';
import { BasicMsg } from './components/BasicMsg';
import { LorenziVisual } from './components/LorenziVisual';

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

  const renderTablePointsScheme = () => {
    const classes = isMobile ? 'flex-1' : 'flex-1 max-width-50 center';
    return (
      <table className={classes}>
        <thead>
          <tr>
            <th className="text-center">Position</th>
            <th className="text-center">Points</th>
          </tr>
        </thead>
        {renderBodyPointsScheme()}
      </table>
    );
  };

  const renderTable = (index: number) => {
    const classes = isMobile ? 'flex-1 limited-table' : 'flex-1';

    return (
      <table className={classes}>
        <thead>
          <tr>
            <th>Position</th>
            {includeCpuPlayers && <th>Type</th>}
            <th>Name</th>
            <th>Points</th>
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
    if (issueOnPointsScheme || issueOnTeams) return null;

    if (isMobile) {
      return imagesURLs.map((imageSrc: string, index: number) => (
        <img alt="TODO:" className="img-full max-width-100 block" key={`${imageSrc}-${index}`} src={imageSrc} />
      ));
    }

    return (
      <div className="flex-container center">
        {imagesURLs.map((imageSrc: string, index: number) => (
          <img alt="TODO:" className="img-full max-width-45 flex-1" key={`${imageSrc}-${index}`} src={imageSrc} />
        ))}
      </div>
    );
  };

  const renderBodyPointsScheme = () => {
    const slicedPointsScheme = absolutePointsScheme.slice(0, nbPlayers);

    return (
      <tbody>
        {slicedPointsScheme.map((_points: number, indexPoints: number) => {
          const key = indexPoints;
          const selectedSign = signPointsScheme[indexPoints];
          const classesSelect = selectedSign === Sign.Positive ? 'green' : 'red';

          return (
            <tr key={key}>
              <td className="text-center">{getPositionString(indexPoints + 1)}</td>
              <td className="text-center">
                <select
                  disabled={disabledUI}
                  onChange={onChangeSignPointsScheme(indexPoints)}
                  className={classesSelect}
                  value={selectedSign}
                >
                  {renderOptionsSign()}
                </select>
                <input
                  className="ml text-center"
                  type="number"
                  min={0}
                  value={absolutePointsScheme[indexPoints]}
                  disabled={disabledUI}
                  onChange={onChangeAbsolutePointsScheme(indexPoints)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  const renderOptionsSign = () => {
    const signs = [Sign.Positive, Sign.Negative];

    return signs.map((sign: string) => {
      return (
        <option key={sign} label={sign} value={sign}>
          {sign}
        </option>
      );
    });
  };

  const renderBody = (index: number) => {
    const renderOption = (option: string | number, indexOption: number) => {
      const key = `${option}-${indexOption}`;
      const label = `${option}`;
      return (
        <option key={key} label={label} value={option}>
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

    const renderOptionsPoints = () => {
      const optionsResultsPoints = uniq([...pointsScheme.slice(0, nbPlayers), 0]).sort((a, b) => b - a);

      return optionsResultsPoints.map(renderOption);
    };

    const classesSelectPlayer = isMobile ? 'max-width-100' : '';

    return (
      <tbody>
        {resultsOcr[index].map((resultOcr: Result, indexPlayer: number) => {
          const { position, username, points } = resultOcr;
          const key = `${position}-${username}`;

          return (
            <tr key={key}>
              <td>{getPositionString(position)}</td>
              {includeCpuPlayers && <td>{isHumanPlayer(username, players) ? '👤' : '🤖'}</td>}
              <td>
                <select
                  className={classesSelectPlayer}
                  onChange={onChangeResultsPlayer(index, indexPlayer)}
                  value={username}
                >
                  {renderOptions()}
                </select>
              </td>
              <td>
                <select onChange={onChangeResultsPoints(index, indexPlayer)} value={points}>
                  {renderOptionsPoints()}
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
    const validationPoints = validatePoints(resultsOcr[index].map((r: Result) => r.points));

    return (
      <div key={index}>
        <h3>{labelRace}</h3>
        {renderCroppedImage(index)}
        <div className="flex-container mt">{renderTable(index)}</div>
        {!validationUsernames.correct && <div className="red">{validationUsernames.errMsg}</div>}
        {!validationPoints.correct && <div className="red">{validationPoints.errMsg}</div>}
      </div>
    );
  };

  const renderRaces = () => {
    if (!resultsOcr || resultsOcr.length <= indexRace) return null;

    return (
      <>
        <hr />
        <div className="center">
          <button disabled={startOverConfirm} onClick={onClickStartOver}>
            Start Over
          </button>
          {startOverConfirm && (
            <button className="block confirm-start-over" onClick={onClickStartOverConfirm}>
              Confirm and start from scratch
            </button>
          )}
          <h2>Results</h2>
          {renderRace(indexRace)}
          {resultsOcr.length !== 1 && (
            <div className="pagination-races mt2">
              <button
                className="pagination-previous-race mr"
                disabled={indexRace === 0}
                onClick={onChangeIndexRace(-1)}
              >
                Previous Race
              </button>
              <div className="inline ml mr">{`Race ${indexRace + 1}/${resultsOcr.length}`}</div>
              <button
                className="pagination-next-race ml"
                disabled={indexRace === resultsOcr.length - 1}
                onClick={onChangeIndexRace(1)}
              >
                Next Race
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  const renderLorenzi = () => {
    if (!resultsOcr || resultsOcr.length <= indexRace) return null;

    const incorrectRaces = getIncorrectRaces(resultsOcr);

    const labelError = `In order to access Lorenzi markdown please fix the errors present in the following race(s): ${incorrectRaces.join(
      ', '
    )}`;

    const rowsLorenzi = (lorenzi.match(/\n/g) || []).length + 1;

    return (
      <div className="center">
        <h2>Lorenzi</h2>
        {incorrectRaces.length > 0 && <div className="red">{labelError}</div>}
        {incorrectRaces.length === 0 && (
          <>
            <CopyToClipboard options={{ message: '' }} text={lorenzi} onCopy={() => setCopiedLorenzi(true)}>
              <button disabled={lorenzi === '' || copiedLorenzi} className="mt">
                {copiedLorenzi ? 'Copied' : 'Copy Lorenzi to clipboard'}
              </button>
            </CopyToClipboard>
            <a
              className="block mt mb"
              href={LORENZI_TABLE_URL}
              rel="noopener noreferrer"
              title="Lorenzi Table website"
              target="_blank"
            >
              Go to Lorenzi Table
            </a>
            <LorenziVisual lorenziTeams={lorenziTeams} />
            <textarea className={`textarea-${classPlatform}`} disabled={true} rows={rowsLorenzi} value={lorenzi} />
          </>
        )}
      </div>
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

  const renderPointsSchemeMainSection = () => {
    if (issueOnTeams) return null;

    const isFFASetup = isEqual(pointsScheme.slice(0, nbPlayers), FFA_POINTS_SCHEME.slice(0, nbPlayers));
    const isWarSetup = isEqual(pointsScheme.slice(0, nbPlayers), WAR_POINTS_SCHEME.slice(0, nbPlayers));

    return (
      <>
        <h3>Points</h3>
        <BasicMsg msg="Choose a preset or edit each value individually for something more custom" />
        <div className="mb">
          <button
            onClick={() => {
              setSignPointsScheme(createArraySameValue(CTR_MAX_PLAYERS, Sign.Positive));
              setAbsolutePointsScheme(FFA_POINTS_SCHEME);
            }}
            disabled={disabledUI || isFFASetup}
          >
            FFA preset
          </button>

          <button
            className="ml"
            onClick={() => {
              setSignPointsScheme(createArraySameValue(CTR_MAX_PLAYERS, Sign.Positive));
              setAbsolutePointsScheme(WAR_POINTS_SCHEME);
            }}
            disabled={disabledUI || isWarSetup}
          >
            WAR preset
          </button>
        </div>
        {renderPointsSchemeSection()}
        {!validationPointsScheme.correct && <div className="red">{validationPointsScheme.errMsg}</div>}
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

  const renderStart = () => {
    if (issueOnPointsScheme || issueOnTeams) return null;

    const colorText = ocrProgress === Progress.Done ? 'orange' : 'red';
    const classesText = `ml block mb bold ${colorText}`;
    const text =
      ocrProgress === Progress.Done
        ? 'Images were analyzed successfully. Please check the results below are correct. Feel free to tweak any mistake below.'
        : 'Please ensure all the information entered above is correct, as none of it can be edited afterwards.';

    return (
      <div className="text-center mb">
        <div className={classesText}>{text}</div>
        <input
          className="inline-block ml"
          type="button"
          value="Get results"
          disabled={disabledUI || !imagesURLs || imagesURLs.length === 0}
          onClick={doOCR}
        />
      </div>
    );
  };

  const renderNumericStepperPlayers = () => {
    const minimumValue = disabledUI ? nbPlayers : 2;
    const maximumValue = disabledUI ? nbPlayers : CTR_MAX_PLAYERS;
    const initialValue = disabledUI ? nbPlayers : CTR_MAX_PLAYERS;
    const onChangeNumericStepper = disabledUI ? () => {} : onChangeNbPlayers;
    const thumbColor = disabledUI ? '#999999' : '#3385FF';

    return (
      <div className="numeric-stepper-wrapper">
        <NumericStepper
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          stepValue={1}
          initialValue={initialValue}
          size="sm"
          inactiveTrackColor="#dddddd"
          activeTrackColor="#ffffff"
          activeButtonColor="#ffffff"
          inactiveIconColor="#3385FF"
          hoverIconColor="#000080"
          activeIconColor="#000080"
          disabledIconColor="#dddddd"
          thumbColor={thumbColor}
          thumbShadowAnimationOnTrackHoverEnabled={false}
          focusRingColor="#fff7ed"
          onChange={onChangeNumericStepper}
        />
      </div>
    );
  };

  const renderImagesUpload = () => {
    const jpgImage = `${EXAMPLE_IMAGES_FOLDER}IMG1.JPG`;
    const pngImage = `${EXAMPLE_IMAGES_FOLDER}IMG1.PNG`;
    const guideImage = `${GUIDE_FOLDER}Images.md`;

    if (issueOnPointsScheme || issueOnTeams) return null;

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
            disabled={disabledUI}
            type="file"
            multiple
            accept={[MIME_JPEG, MIME_PNG].join(', ')}
            onChange={onChangeImage}
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
        {renderPointsSchemeMainSection()}
        {renderImagesUpload()}
        {renderImages()}
        {renderStart()}
        {renderRaces()}
        {renderLorenzi()}
      </>
    );
  };

  const renderPointsSchemeSection = () => {
    return renderTablePointsScheme();
  };

  const renderTeamSection = () => {
    if (includeCpuPlayers) return <BasicMsg msg="Teams are not available when CPUs are activated" />;

    return (
      <>
        <select disabled={disabledUI} onChange={onChangeNbTeams} value={nbTeams}>
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
            disabled={disabledUI}
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
    const playerClassnames = `inline ${colorPlayer}`;

    return (
      <li className="block" key={player}>
        <div className={playerClassnames}>{player}</div>
        <div className="ml mb block text-center">{renderPlayerTeams(player)}</div>
      </li>
    );
  };

  const renderTeamRepartition = () => {
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
    if (!cpuData || Object.keys(cpuData).length === 0) return <BasicMsg msg={PLACEHOLDER_CPUS} />;

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
            disabled={shouldIncludeCpuPlayers || disabledUI}
          />
          <div className="ml inline">{textCheckbox}</div>
        </div>
        {includeCpuPlayers && (
          <>
            <BasicMsg msg="Bots are automatically determined based on the language and cannot be edited" />
            <div className="ml block mb">
              For more information, please refer to the{' '}
              <a href={guideCpu} rel="noopener noreferrer" title="Guide about CPUs" target="_blank">
                CPUs guide
              </a>
            </div>
            <div className="inline mr">Language in images</div>
            <select disabled={disabledUI} onChange={onChangeCpuLanguage} value={cpuLanguage}>
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
    setDisabledUI(false);
    fetch(URL_CPUS)
      .then((response) => response.json())
      .then((data) => {
        setCpuData(data);
        setCpuPlayers(formatCpuPlayers((data as any)[WEBSITE_DEFAULT_LANGUAGE]));
      });
  };

  const doOCR = async () => {
    if (!onMountOver) return;

    setDisabledUI(true);
    setOcrProgress(Progress.Started);
    setOcrProgressText('Initialization...');
    setResultsOcr([]);
    setIndexRace(0);
    setCroppedImages([]);
    setLorenzi('');
    setStartOverConfirm(false);

    const schedulerUsername = createScheduler();

    const workerUsername = createWorker({
      // logger: (m: any) => console.log(m)
    });

    schedulerUsername.addWorker(workerUsername);

    await workerUsername.load();
    await workerUsername.loadLanguage(OCR_LANGUAGE);
    await workerUsername.initialize(OCR_LANGUAGE);
    const usernameParams = getParams(Category.Username, getPlayers(players), getPlayers(cpuPlayers), includeCpuPlayers);

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

        logMsg('resultsNames');
        logMsg(resultsNames);

        const dataResults: Result[] = [];
        const referencePlayers = getReferencePlayers(players, cpuPlayers, includeCpuPlayers);
        const csv: (string | number)[][] = [];
        playerIndexes.forEach((playerIndex) => {
          const playerGuess = resultsNames[playerIndex];
          const playerMatch = getClosestString(playerGuess, referencePlayers);
          const result: Result = {
            username: playerMatch,
            rawUsername: playerGuess,
            distanceUsername: getEditDistance(playerMatch, playerGuess),
            position: playerIndex + 1,
            points: pointsScheme[playerIndex]
          };

          csv.push([result.username, result.rawUsername ?? '', result.distanceUsername ?? result.username.length]);

          dataResults.push(result);
        });

        logTable(csv);

        resultsOcrTemp.push(dataResults);
      } catch (err) {
        // TODO: have better error handling
        logMsg(err);
        // setDisabledUI(false);
      }
    }

    setResultsOcr(resultsOcrTemp);
    setCroppedImages(croppedImagesTemp);
    setOcrProgress(Progress.Done);
    setOcrProgressText('');
    // setDisabledUI(false);

    await schedulerUsername.terminate();
  };

  const { width } = useWindowSize();
  const [ocrProgress, setOcrProgress] = React.useState(Progress.NotStarted);
  const [ocrProgressText, setOcrProgressText] = React.useState('');
  const [images, setImages] = React.useState<any[]>([]);
  const [imagesURLs, setImagesURLs] = React.useState<any[]>([]);
  const [croppedImages, setCroppedImages] = React.useState<any[]>([]);
  const [nbPlayers, setNbPlayers] = React.useState(CTR_MAX_PLAYERS);
  const [cpuLanguage, setCpuLanguage] = React.useState(WEBSITE_DEFAULT_LANGUAGE);
  const [disabledUI, setDisabledUI] = React.useState(true);
  const [onMountOver, setOnMountOver] = React.useState(false);
  const [resultsOcr, setResultsOcr] = React.useState<Result[][]>([]);
  const [players, setPlayers] = React.useState('');
  const [pointsScheme, setPointsScheme] = React.useState<number[]>(FFA_POINTS_SCHEME);
  const [absolutePointsScheme, setAbsolutePointsScheme] = React.useState<number[]>(FFA_POINTS_SCHEME);
  const [signPointsScheme, setSignPointsScheme] = React.useState<Sign[]>(
    createArraySameValue(CTR_MAX_PLAYERS, Sign.Positive)
  );

  const [copiedPlayers, setCopiedPlayers] = React.useState(false);
  const [copiedLorenzi, setCopiedLorenzi] = React.useState(false);
  const [cpuPlayers, setCpuPlayers] = React.useState(PLACEHOLDER_CPUS);
  const [cpuData, setCpuData] = React.useState<any>({});
  const [includeCpuPlayers, setIncludeCpuPlayers] = React.useState(false);
  const [teams, setTeams] = React.useState<string[]>(getTeamNames(INITIAL_TEAMS_NB));
  const [lorenziTeams, setLorenziTeams] = React.useState<LorenziTeam[]>(getInitialLorenziTeams(INITIAL_TEAMS_NB));
  const [nbTeams, setNbTeams] = React.useState(INITIAL_TEAMS_NB);
  const [playerTeams, setPlayerTeams] = React.useState<Record<string, string>>({});
  const [indexRace, setIndexRace] = React.useState(0);
  const [lorenzi, setLorenzi] = React.useState('');
  const [startOverConfirm, setStartOverConfirm] = React.useState(false);

  const nbPlayersTyped = uniq(getPlayers(players)).length;
  const shouldIncludeCpuPlayers = nbPlayersTyped < nbPlayers;

  React.useEffect(() => {
    onMount();
  }, []);

  React.useEffect(() => {
    const copy = [...absolutePointsScheme];
    const newPointsScheme = copy.map((absolutePoints: number, index: number) => {
      const multiplier = signPointsScheme[index] === Sign.Negative ? -1 : 1;
      return multiplier * absolutePoints;
    });

    setPointsScheme(newPointsScheme);
    logMsg('newPointsScheme');
    logMsg(newPointsScheme);
  }, [absolutePointsScheme, signPointsScheme]);

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
    if (resultsOcr && resultsOcr.length > 0) {
      const newLorenzi = createLorenzi(resultsOcr, playerTeams, nbTeams, nbPlayers, teams, includeCpuPlayers);

      setLorenzi(newLorenzi.join('\n'));
      setCopiedLorenzi(false);
    }
  }, [resultsOcr]);

  React.useEffect(() => {
    if (shouldIncludeCpuPlayers && !includeCpuPlayers) {
      setIncludeCpuPlayers(true);
    }
  }, [shouldIncludeCpuPlayers, includeCpuPlayers]);

  const onPlayersChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlayers(e.currentTarget.value);
    setCopiedPlayers(false);

    setNbTeams(INITIAL_TEAMS_NB);
    setTeams(getTeamNames(INITIAL_TEAMS_NB));
    setLorenziTeams(getInitialLorenziTeams(INITIAL_TEAMS_NB));
    setPlayerTeams({});
  };

  const onClickStartOver = (_e: any) => {
    setStartOverConfirm(true);
  };

  const onClickStartOverConfirm = (_e: any) => {
    window.location.reload();
  };

  const onChangeIndexRace = (delta: number) => (_e: any) => {
    const newIndex = indexRace + delta;

    if (newIndex < 0 || newIndex >= resultsOcr.length) return;

    setIndexRace(newIndex);
  };

  const onChangeImage = (e: any) => {
    setImages([...e.target.files]);
    setResultsOcr([]);
  };

  const onChangeNbPlayers = (value: number) => {
    if (value === nbPlayers) return;

    /*
      Due to Numeric Stepper not using value prop
      we should only call this from Numeric Stepper
    */
    setNbPlayers(value);

    setPlayers('');

    setNbTeams(INITIAL_TEAMS_NB);
    setTeams(getTeamNames(INITIAL_TEAMS_NB));
    setLorenziTeams(getInitialLorenziTeams(INITIAL_TEAMS_NB));
    setPlayerTeams({});
  };

  const onChangeNbTeams = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNbTeams = Number(e.target.value);
    const teamNames = getTeamNames(newNbTeams);
    const isFFA = newNbTeams === nbPlayers;

    setNbTeams(newNbTeams);
    setTeams(teamNames);
    setLorenziTeams(getInitialLorenziTeams(newNbTeams));
    setPlayerTeams({});

    setSignPointsScheme(createArraySameValue(CTR_MAX_PLAYERS, Sign.Positive));
    if (isFFA) setAbsolutePointsScheme(FFA_POINTS_SCHEME);
    else setAbsolutePointsScheme(WAR_POINTS_SCHEME);
  };

  const onChangeCpuLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCpuLanguage(e.target.value);
    setCpuPlayers(formatCpuPlayers(cpuData[e.target.value]));
  };

  const onChangeSignPointsScheme = (indexPointsScheme: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!signPointsScheme || signPointsScheme.length < indexPointsScheme) return;
    const { value } = e.target;
    const newValue = value === Sign.Positive ? Sign.Positive : Sign.Negative;
    const copy = [...signPointsScheme];
    copy[indexPointsScheme] = newValue;
    setSignPointsScheme(copy);
    logMsg('new signPointsScheme');
    logMsg(copy);
  };

  const onChangeAbsolutePointsScheme =
    (indexAbsolutePointsScheme: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!absolutePointsScheme || absolutePointsScheme.length < indexAbsolutePointsScheme) return;
      const { value } = e.currentTarget;
      const copy = [...absolutePointsScheme];
      const valueNumber = Number(value);
      const valueSafe = isNaN(valueNumber) ? 0 : valueNumber;
      copy[indexAbsolutePointsScheme] = Math.abs(valueSafe);
      setAbsolutePointsScheme(copy);
    };

  const onChangeResultsPoints =
    (indexResultOcr: number, indexPlayer: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!resultsOcr || resultsOcr.length < indexResultOcr) return;
      const copy = [...resultsOcr];
      copy[indexResultOcr][indexPlayer].points = Number(e.target.value);
      setResultsOcr(copy);
    };

  const onChangeResultsPlayer =
    (indexResultOcr: number, indexPlayer: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!resultsOcr || resultsOcr.length < indexResultOcr) return;
      const copy = [...resultsOcr];
      copy[indexResultOcr][indexPlayer].username = e.target.value;
      setResultsOcr(copy);
    };

  const onCpuCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.checked;
    setIncludeCpuPlayers(newVal);
    setSignPointsScheme(createArraySameValue(CTR_MAX_PLAYERS, Sign.Positive));
    if (newVal === true) setAbsolutePointsScheme(FFA_POINTS_SCHEME);
    else setAbsolutePointsScheme(WAR_POINTS_SCHEME);
  };

  const optionsNbTeams = getOptionsTeams(nbPlayers);
  const classPlatform = isMobile ? 'mobile' : 'desktop';
  const classBgDisabled = disabledUI && (!resultsOcr || resultsOcr.length === 0) ? 'bg-grey' : 'bg-white';
  const playersNames = uniq(getPlayers(players)).sort(sortCaseInsensitive);
  const validationTeams = validateTeams(playersNames, teams, playerTeams);
  const validationPointsScheme = validatePoints(pointsScheme.slice(0, nbPlayers));
  const userAgent = navigator?.userAgent ?? '';
  const userAgentResult = new UAParser(userAgent).getResult();
  const placeholderPlayers = getPlayersPlaceholder(nbPlayers, userAgentResult);
  const isFFA = nbTeams === nbPlayers;
  const issueOnTeams = !includeCpuPlayers && !isFFA && !validationTeams.correct;
  const issueOnPointsScheme = !validationPointsScheme.correct;
  const guideFAQ = `${GUIDE_FOLDER}FAQ.md`;

  return (
    <div className="main">
      <h1>{WEBSITE_TITLE}</h1>
      <div className="w3-light-grey"></div>
      {ocrProgress === Progress.Done && (
        <Confetti
          width={width}
          height={document.body.scrollHeight > window.innerHeight ? document.body.scrollHeight : window.innerHeight}
          numberOfPieces={isMobile ? 800 : 1600}
          recycle={false}
        />
      )}
      <div className={`center main-content-${classPlatform} ${classBgDisabled}`}>
        {renderProgressBar()}
        <h2>Introduction</h2>
        <BasicMsg msg="Please enter information from top to bottom for a smooth experience" />
        <BasicMsg msg="At the end, we'll produce the Lorenzi markdown for you" />
        <a
          href={VIDEO_TUTORIAL}
          rel="noopener noreferrer"
          title="Video Tutorial about how to use Crash Team Results website"
          target="_blank"
        >
          Video Tutorial
        </a>
        {' - '}
        <a href={guideFAQ} rel="noopener noreferrer" title="Frequently Asked Questions" target="_blank">
          FAQ
        </a>
        <h2>Players</h2>
        <h3>Number of players</h3>
        <BasicMsg msg="This includes CPUs if any" />
        {renderNumericStepperPlayers()}
        <h3>Human Players</h3>
        <BasicMsg msg="Type all human players present in the races. Type one username per line." />
        <textarea
          className={`textarea-${classPlatform}`}
          disabled={disabledUI}
          placeholder={placeholderPlayers}
          rows={nbPlayers}
          value={players}
          onChange={onPlayersChange}
        />
        <CopyToClipboard options={{ message: '' }} text={players} onCopy={() => setCopiedPlayers(true)}>
          <button disabled={nbPlayersTyped === 0 || copiedPlayers} className="mt">
            {copiedPlayers ? 'Copied' : 'Copy to clipboard'}
          </button>
        </CopyToClipboard>
        {renderMainSection()}
      </div>
      <Footer />
    </div>
  );
};

export default App;
