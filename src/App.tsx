import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createWorker, createScheduler, PSM } from 'tesseract.js';

const App = () => {
  const worker = createWorker({
    logger: (m) => console.log(m)
  });

  const doOCR = async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const {
      data: { text }
    } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    setOcr(text);

    // TODO: re-add
    // await worker.terminate();
  };

  const [ocr, setOcr] = React.useState('Loading...');

  React.useEffect(() => {
    doOCR();
  });

  return (
    <HelmetProvider>
      <Helmet>
        {/* <script src="../node_modules/tesseract.js/dist/tesseract.min.js" type="text/javascript" /> */}
        <title>CTR OCR Test</title>
        <link rel="canonical" href="https://sebranly.github.io/ctr-ocr" />
      </Helmet>
      <div className="main">
        <h1 className="white">CTR OCR 2</h1>
        <h2>{ocr}</h2>
        <select>
          <option label="1" value="1" />
          <option label="2" value="2" />
          <option label="3" value="3" />
          <option label="4" value="4" />
          <option label="5" value="5" />
        </select>
      </div>
    </HelmetProvider>
  );
};

export default App;
