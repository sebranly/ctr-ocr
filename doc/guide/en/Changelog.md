# Changelog

Also available in: [French](../fr/Changelog.md)

## v1

### v1.0.16

**Bug fixes:**
- the username recognition is more reliable thanks to two fixes:
  - the list of allowed symbols has been updated from all alphanumeric characters to those included in the known list of human players/CPUs
  - the edit distance algorithm has been updated from a basic Levenshtein distance to a custom one in which close alphanumeric characters (e.g. `B` and `8`) have a score strictly lower than 1 for substitution

### v1.0.15

**Documentation:**
- Changelog is now available on the website
- FAQ is now available on the website

**Features:**
- `0` points can now be selected on a per-race basis, no matter the global points preset

**Bug fixes:**
- the use of negative values for points on mobile devices is made easier

**Codebase:**
- technical debt is reduced

### v1.0.14

Public launch and reveal of the website which supports the following:
- **online races for CTR:NF video game only**
- a number of players between 2 and 8
- presence of bots (supported languages: English, French, Spanish)
- teams only if bots are not activated. Number of teams is between 2 and number of players (which means FFA). If there are bots, FFA is enforced.
- multiple `JPEG`/`JPG`/`PNG` images upload with any dimensions
- tweaking the analyzed results (usernames and points) on a per-race basis
- Lorenzi markdown generation taking into account team configuration