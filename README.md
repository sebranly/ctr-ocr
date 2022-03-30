# ctr-ocr
Optical character recognition performed on the video game Crash Team Racing Nitro-Fueled for game results

Deployed on [GitHub pages](https://sebranly.github.io/ctr-ocr), support for desktop only at the moment.

## Development

### Setup

- Clone the repository with `git clone git@github.com:sebranly/ctr-ocr.git`
- Go into the repository (e.g. with `cd`)
- Run `npm i` to install the dependencies

### Start

- To run it locally, run `npm start`, it has hot reloading
- To run the test suite (no need to run command above), run `npm test`

### Deploy

- Commit and push your changes to `main` branch
- Make sure to increase the `WEBSITE_VERSION` from `constants.ts` file
- Then run `npm run deploy`
