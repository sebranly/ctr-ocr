import * as React from 'react';
import { CRASH_TEAM_RANKING_AUTHOR_URL, GUIDE_FOLDER, PROJECT_URL, WEBSITE_VERSION } from '../constants/general';

const Footer = () => {
  const guideChangelog = `${GUIDE_FOLDER}Changelog.md`;

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
      <div className="mt2 text-center">
        Website version{' '}
        <a href={guideChangelog} rel="noopener noreferrer" title="Website changelog" target="_blank">
          {WEBSITE_VERSION}
        </a>
      </div>
    </>
  );
};

export { Footer };
