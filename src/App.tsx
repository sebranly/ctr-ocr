import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createWorker, createScheduler, PSM } from 'tesseract.js';

const App = () => {
  const worker = createWorker({
    logger: (m: any) => console.log(m)
  });

  const doOCR = async () => {
    setOcr(`Loading for ${imgIndex}...`);

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const {
      data: { text }
    } = await worker.recognize('https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/input/IMG1.JPG');
    setOcr(text);

    // TODO: re-add
    // await worker.terminate();
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
        {/* <script src="../node_modules/tesseract.js/dist/tesseract.min.js" type="text/javascript" /> */}
        <title>CTR OCR</title>
        <link rel="canonical" href="https://sebranly.github.io/ctr-ocr" />
      </Helmet>
      <div className="main">
        <h1 className="white">CTR OCR</h1>
        <select onChange={onChange}>
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
