import * as React from 'react';
import './App.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const App = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>CTR OCR Test</title>
        <link rel="canonical" href="https://sebranly.github.io/ctr-ocr" />
      </Helmet>
      <div className="main">
        <h1 className="white">CTR OCR</h1>
      </div>
    </HelmetProvider>
  );
};

export default App;
