# CPUs

## Introduction

Races are played with human players and optionally CPUs. CPUs mean that the characters are bots. As their name is known in advance, we can generate the list, contrary to human players who are free to pick their own username.

## Languages

CPUs can have slightly different names based on the language of the game though. For example while Crash Bandicoot has the same name in English, French and Spanish, Lab Assistant has different names in these languages.

Currently, the following languages are supported: English (`en`), French (`fr`), Spanish (`es`).

## Support

If your language is not supported on the website, it can be added with a few easy extra steps.
- if you're not too familiar with GitHub, you can just simply leave me a comment by creating a new [GitHub issue](https://github.com/sebranly/ctr-ocr/issues)
- if you're more familiar with GitHub, you can open a new Pull Request on the [file of the repository](https://github.com/sebranly/sebranly.github.io/blob/master/json/ctr-ocr/players.json) that contains the JSON object representing CPUs
  - please note that the repository for this JSON is different from the repository of the website, in order for me to be able to update the list without having to redeploy the website
  - please use [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code for the language you're adding, by keeping them languages codes alphabetized
  - please add all 56 characters in the same order as they appear on the game UI