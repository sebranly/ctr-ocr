# ctr-ocr
Optical character recognition performed on the video game Crash Team Racing Nitro-Fueled for game results

Live on [Crash Team Results](https://www.crashteamresults.com)

## Roadmap

Current tasks are available on this [GitHub list of projects](https://github.com/sebranly/ctr-ocr/projects)

## Development

### Setup

- Clone the repository with `git clone git@github.com:sebranly/ctr-ocr.git`
- Go into the repository (e.g. with `cd`)
- Make sure you use node 16 (`node -v`) and npm 8 (`npm -v`)
- Run `npm ci` to install the dependencies

### Start

- To run it locally, run `npm run start`, it has hot reloading
- To run the test suite (no need to run command above), run `npm run test`

### Deploy

- Commit and push your changes to `main` branch
- Make sure to have followed the following. If not, create a new PR.
  - increase the `WEBSITE_VERSION` from `src/constants/general.ts` file, by following semver
    - MAJOR version when you make incompatible API changes,
    - MINOR version when you add functionality in a backwards compatible manner, and
    - PATCH version when you make backwards compatible bug fixes.
  - make sure `DEBUG_MODE` from `src/constants/general.ts` file is `false`
  - make sure that `doc/guide/en/FAQ.md` and `doc/guide/fr/FAQ.md` are updated with a section describing the new version
- Then run `npm run deploy`
