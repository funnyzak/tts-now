import React from 'react';

import './index.scss';

const Index: React.FC = () => {
  const [chromeVersion, nodeVersion, electronVersion] = [
    'chrome',
    'node',
    'electron'
  ].map((v) => process.versions[v]);
  return (
    <div className="hello">
      We are using Node.js
      <span className="version">{nodeVersion}</span>
      , Chromium
      <span className="version">{chromeVersion}</span>
      , and Electron
      <span className="version">{electronVersion}</span>
      .
    </div>
  );
};
export default Index;
