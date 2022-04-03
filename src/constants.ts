import { charRange, numberRange } from './utils';

// In the game CTR:NF, once player 1 finishes, online players have 30 seconds to complete the race
// TODO: verify behavior in offline races
export const CTR_MAX_TIME_DIFF_SEC = 30;
export const CTR_MAX_PLAYERS = 8;

export const AUTHOR_NAME = 'sebranly';
export const AUTHOR_GITHUB = `https://${AUTHOR_NAME}.github.io`;
export const PROJECT_NAME = 'ctr-ocr';
export const JSON_FOLDER = 'ctr-ocr';
export const PROJECT_URL = `https://github.com/${AUTHOR_NAME}/${PROJECT_NAME}`;
export const CRASH_TEAM_RANKING_AUTHOR_URL = 'https://crashteamranking.com/members/siblingbling/tt/';
export const GUIDE_FOLDER = `${PROJECT_URL}/blob/main/doc/guide/`;
export const LOG_CONSOLE = false;
export const MAX_HEIGHT_IMG = 1_000;
export const CANONICAL_URL = `${AUTHOR_GITHUB}/${PROJECT_NAME}`;
export const CHARLIST_UPPERCASE_LETTERS = charRange('A', 'Z').join('');
export const CHARLIST_LOWERCASE_LETTERS = charRange('a', 'z').join('');
export const CHARLIST_LETTERS = `${CHARLIST_LOWERCASE_LETTERS}${CHARLIST_UPPERCASE_LETTERS}`;
export const CHARLIST_DIGITS = numberRange(0, 9).join('');
export const CHARLIST_POSITION = numberRange(1, CTR_MAX_PLAYERS).join('');
export const CHARLIST_TIME = `${CHARLIST_DIGITS}:-`;
export const CHARLIST_USERNAME = `${CHARLIST_LETTERS}${CHARLIST_DIGITS}:-_. `;
export const MIME_JPEG = 'image/jpeg';
export const MIME_PNG = 'image/png';
export const PSM_SINGLE_CHAR = '10';
export const PSM_SINGLE_LINE = '7';
export const SEPARATOR_PLAYERS = '\n';
export const TIME_DNF = '--:--:--';
export const WEBSITE_TITLE = 'Crash Team Results';
export const WEBSITE_VERSION = '1.0.3';
export const WEBSITE_DEFAULT_LANGUAGE = 'en';
export const PLACEHOLDER_CPUS = 'Loading CPUs...';
export const URL_CPUS = `${AUTHOR_GITHUB}/json/${JSON_FOLDER}/players.json`;
export const EXAMPLE_IMAGES_FOLDER = `https://raw.githubusercontent.com/${AUTHOR_NAME}/${PROJECT_NAME}/main/src/img/examples/`;
export const EXAMPLE_IMAGES_FOLDER_FULL_EVENT = `${PROJECT_URL}/tree/main/src/img/examples/full-event/`;
// There will always be a possibility for 2 teams
export const INITIAL_TEAM_NB = 2;
export const PLACEHOLDER_PLAYERS = `Hyène_JurassX
Alexiz
Colonel_Hay
TATANE`;
