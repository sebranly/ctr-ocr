# FAQ

Also available in: [French](../fr/FAQ.md)

## Where is this website?

Crash Team Results is available at https://www.crashteamresults.com

## Why this name?

Crash Team Results is based on Crash Team Racing: Nitro-Fueled video game. I wanted to have the same words/sounds as much as possible, as Crash Team Ranking website did.

## What is this website?

This website allows you to upload several screenshots from an event of several online races for the video game called Crash Team Racing: Nitro-Fueled. With some configuration done beforehand, the website will then analyze your screenshots and automatically create the Lorenzi markdown for the event.

## Why should I use this website?

Creating the Lorenzi markdown by hand is error-prone. Using this website to generate the Lorenzi markdown is more reliable because the interface will guide you and let you know if there are any warnings/errors that need to be fixed before moving on to the next step. It also saves time.

## Can I use Lorenzi website for recognizing CTR:NF images?

No. To the best of my knowledge, Lorenzi only allows you to do OCR on the video game called Mario Kart 8 Deluxe.

## Should I still use Lorenzi website?

Yes. You should still use Lorenzi website. Crash Team Results website only completes the steps to generate the Lorenzi markdown. Once this is generated, you should move to the Lorenzi website to paste it. In other words, Crash Team Results website is complimentary to Lorenzi website.

## Which technology does this website use?

It's mainly based on OCR which means Optical character recognition. It's based on the JavaScript port of the tesseract OCR engine. The rest of the website is a front-end React/Typescript application.

## Why are there limitations on the number of players?

As the tool is about online races, there has to be at least 2 players competing each other. The video game CTR:NF only supports a maximum of 8 players.

## Are times supported?

No. Currently there is no support for time recognition although it appears in screenshots. It might be supported in a future update of the website.

## What should I do if a user got disconnected in-game?

If a user got disconnected and replaced with a bot during a race that was supposed to be done with no bots, it is possible that the screenshot uses the bot name rather than the human player name. I would advise you to do the following:
- on Crash Team Results website, do not activate bots
- perform the recognition on the screenshot that contains the bot name
- once the recognition is over, a random human player name will be attributed to the bot
- fix it by attributing the correct human player name

## Tell me more about images/screenshots

Please see [Images](./Images.md)

## Tell me more about CPUs

Please see [CPUs](./CPUs.md)

## Tell me more about the changelog for this website

Please see [Changelog](./Changelog.md)