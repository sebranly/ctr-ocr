import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createWorker, createScheduler, PSM } from 'tesseract.js';
import levenshtein from 'fast-levenshtein';
import path from 'path';
import getColors from 'get-image-colors';
import Jimp from 'jimp';

const language = 'eng';

const PLAYERS = [
  'caso-pyro01',
  'stin_wz',
  'ZouGui28',
  'francois24540',
  'DGregson97',
  'nessanumen',
  'AlexKenshin_33',
  'CrazyLittleJazzy',
  'mmartin_m',
  'Dr N. Tropy',
  'Kity_Panda',
  'Jakubeq1_',
  'Assistant de laboratoire',
  'Bébé N. Tropy',
  'Faux Crash',
  'giomastik',
  'MarioAlfie123',
  'kimmyy043',
  'Mav15151515',
  'Axe34070',
  'Stew'
];

const getName = (guess: string) => {
  let min = Infinity;
  let name = guess;

  PLAYERS.forEach((player) => {
    const lev = levenshtein.get(guess, player);

    if (lev < min) {
      min = lev;
      name = player;
    }
  });

  return name;
};

const getExtract = (info: any, index = 0, isTime: boolean) => {
  const { width, height } = info;
  const left = parseInt((0.64 * width).toString(), 10);
  const top = parseInt((0.265 * height).toString(), 10);
  const widthCrop = parseInt((0.27 * width).toString(), 10);
  const heightCrop = parseInt((0.425 * height).toString(), 10);

  const ratioTime = 0.73;
  const ratioEnd = 0.03;
  const ratioLeftOffsetName = 0.27;
  const antiRatioTime = 1 - ratioTime - ratioEnd;

  const rectangle = {
    top: parseInt(((index / 8) * heightCrop).toString(), 10),
    height: parseInt(((1 / 8) * heightCrop).toString(), 10)
  };

  const topExt = top + rectangle.top;
  const heightExt = rectangle.height;

  const leftExtTime = left + parseInt((ratioTime * widthCrop).toString(), 10);
  const widthExtTime = parseInt((antiRatioTime * widthCrop).toString(), 10);

  const leftExtName = left + parseInt((ratioLeftOffsetName * widthCrop).toString(), 10);
  const widthExtName = parseInt(((1 - antiRatioTime - ratioLeftOffsetName - ratioEnd) * widthCrop).toString(), 10);

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

const removeBack = (str: string) => str.replace(/\n/g, '').replace(/ /g, '');
const pseudoWhitelist = '_-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.';
const timeWhitelist = '0123456789:-';

const App = () => {
  const scheduler1 = createScheduler();
  const scheduler2 = createScheduler();

  // const pathLangData = path.join(__dirname, '..', 'lang-data');
  const worker1 = createWorker({
    // langPath: pathLangData
    logger: (m: any) => console.log(m)
  });
  const worker2 = createWorker({
    // langPath: pathLangData
    logger: (m: any) => console.log(m)
  });
  const worker3 = createWorker({
    // langPath: pathLangData
    logger: (m: any) => console.log(m)
  });
  const worker4 = createWorker({
    // langPath: pathLangData
    logger: (m: any) => console.log(m)
  });

  const doOCR = async () => {
    setOcr(`Loading for ${imgIndex}...`);

    await worker1.load();
    await worker2.load();
    await worker1.loadLanguage(language);
    await worker2.loadLanguage(language);
    await worker1.initialize(language);
    await worker2.initialize(language);

    await worker3.load();
    await worker4.load();
    await worker3.loadLanguage(language);
    await worker4.loadLanguage(language);
    await worker3.initialize(language);
    await worker4.initialize(language);

    await worker1.setParameters({
      tessedit_char_whitelist: timeWhitelist
      // TODO: re-activate
      // tessedit_pageseg_mode: PSM.PSM_SINGLE_LINE
    });

    await worker2.setParameters({
      tessedit_char_whitelist: timeWhitelist
      // tessedit_pageseg_mode: PSM.PSM_SINGLE_LINE
    });

    await worker3.setParameters({
      tessedit_char_whitelist: pseudoWhitelist
      // tessedit_pageseg_mode: PSM.PSM_SINGLE_LINE
    });

    await worker4.setParameters({
      tessedit_char_whitelist: pseudoWhitelist
      // tessedit_pageseg_mode: PSM.PSM_SINGLE_LINE
    });

    scheduler1.addWorker(worker1);
    scheduler1.addWorker(worker2);

    scheduler2.addWorker(worker3);
    scheduler2.addWorker(worker4);

    const playerIndexes = [0, 1, 2, 3, 4, 5, 6, 7];

    const promisesX = async (playerIndex: number, isTime: boolean, info: any, rotated: any) => {
      const scheduler = isTime ? scheduler1 : scheduler2;
      const label = isTime ? 'time' : 'name';
      const dimensions = getExtract(info, playerIndex, isTime);

      // TODO: LOG
      // const pathName = path.join(__dirname, '..', 'images', 'output', `${label}${playerIndex}.JPG`);
      const extracted = await rotated.extract(dimensions);

      const options = {
        count: 2,
        type: 'image/jpeg'
      };

      const rgb = await getColors(await extracted.toBuffer(), options).then((colors: any) => {
        // console.log("🚀 ~ rgb ~ colors", playerIndex, colors)
        return [colors[0].rgb(), colors[1].rgb()];
      });

      const shouldInvert = rgb[0][0] < rgb[1][0] && rgb[0][1] < rgb[1][1] && rgb[0][2] < rgb[1][2];
      const extractedFin = shouldInvert ? extracted.negate({ alpha: false }) : extracted;

      // TODO:
      // await extractedFin.toFile(pathName);
      return scheduler.addJob('recognize', await extractedFin.toBuffer());
    };

    // TODO:
    // const pathInput = path.join(__dirname, '..', 'images', 'input', `IMG${imgIndex}.JPG`);
    const pathInput = `https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/input/IMG${imgIndex}.JPG`;
    // const modified = await sharp(pathInput).rotate(6.2).grayscale();
    const imgJimp = await Jimp.read(pathInput);
    const imgTrans = imgJimp.rotate(-6.2).grayscale();

    imgTrans.getBase64(Jimp.MIME_JPEG, (err: any, src: string) => {
      var img = document.createElement('img');
      img.setAttribute('src', src);
      document.body.appendChild(img);
    });

    // TODO:
    // const pathRotated = path.join(__dirname, '..', 'images', 'output', 'rotated.JPG');
    // await modified.toFile(pathRotated, async (err: any, info: any) => {

    // TODO: reactivate

    imgTrans.getBuffer(Jimp.MIME_JPEG, async (err: any, info: any) => {
      console.log('err', err, 'info.width', info.width, 'info.height', info.height);

      const promisesTimes = playerIndexes.map((playerIndex) => promisesX(playerIndex, true, info, imgTrans));
      const promisesNames = playerIndexes.map((playerIndex) => promisesX(playerIndex, false, info, imgTrans));

      const results = await Promise.all([...promisesNames, ...promisesTimes]);
      const resultsText = results.map((r) => removeBack(r.data.text));

      const resultsNames = resultsText.slice(0, 8);
      const resultsTimes = resultsText.slice(8);

      const data: string[] = [];
      playerIndexes.forEach((playerIndex) => {
        const playerGuess = resultsNames[playerIndex];
        const d = { g: playerGuess, player: getName(playerGuess), time: resultsTimes[playerIndex] };
        data.push(d as any);
      });

      setOcr(data.toString());

      // TODO: later
      // await scheduler1.terminate();
      // await scheduler2.terminate();
    });
  };

  const [ocr, setOcr] = React.useState('Loading...');
  const [imgIndex, setImgIndex] = React.useState(1);

  React.useEffect(() => {
    doOCR();
  }, [imgIndex]);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImgIndex(Number(e.target.value));
  };

  const src = `https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/input/IMG${imgIndex}.JPG`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>CTR OCR</title>
        <link rel="canonical" href="https://sebranly.github.io/ctr-ocr" />
      </Helmet>
      <div className="main">
        <h1 className="white">CTR OCR</h1>
        <select disabled={true} onChange={onChange}>
          <option label="1" value="1" />
          <option label="2" value="2" />
          <option label="3" value="3" />
          <option label="4" value="4" />
          <option label="5" value="5" />
        </select>
        <img alt={`Example ${imgIndex}`} src={src} />
        <h2>{ocr}</h2>
      </div>
    </HelmetProvider>
  );
};

export default App;
