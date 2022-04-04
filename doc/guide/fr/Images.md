# Images

Also available in: [English](../en/Images.md)

## Introduction

Ce site web est principalement un outil image-vers-texte qui permet de convertir une image de résultats d'une course de Crash Team Racing: Nitro Fueled vers des données textuelles qui représentent ces mêmes résultats. C'est basé sur une technologie appelée OCR qui signifie Reconnaissance Optique de Caractères. Donc **il est important de fournir des images de bonne qualité**, prises directement du système (par exemple système PlayStation, console de jeu Switch, etc.) parce que c'est basé sur une reconnaissance de motifs.

## Informations Générales

### Formats

Le site web gère les formats suivants: `JPG`/`JPEG`/`PNG`.

### Dimensions

Le site web gère n'importe quelles dimensions du moment que le **rapport entre le largeur et la hauteur soit 1.78**. Par exemple les dimensions suivantes sont correctes: 3840x2160 (le maximum autorisé sur PS5), 1280x720 (le maximum autorisé sur Switch), etc.

### Noms

Si vous téléchargez en amont plusieurs images, elles seront triées alphabétiquement par leur nom pour les résultats. Nous vous conseillons de les nommer avec un préfix commun et un suffixe avec un numéro spécifique, par exemple comme ceci : `IMG1.JPG`, `IMG2.JPG`, ..., `IMG10.JPG` pour un événement à 10 courses.

Un exemple avec 10 courses est disponible dans ce [dossier d'exemple](https://github.com/sebranly/ctr-ocr/tree/main/src/img/examples/full-event).

## Platformes

### PS5

Sur PS5, les captures d'écran peuvent être prises sous deux formats différents : `JPG`/`PNG`. J'ai remarqué que le format `PNG` est bien plus lourd (>10MB) que le format `JPG`/`JPEG` (<1MB) alors que les dimensions sont les mêmes (3840x2160). Comme ils offrent les mêmes résultats, je recommande d'utiliser simplement `JPG`/ `JPEG`.

|JPG|PNG|
|-|-|
|![](https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/examples/IMG1.JPG?raw=true)|![](https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/examples/IMG1.PNG?raw=true)|

Vous pouvez prendre des captures d'écran en appuyant sur la touche Share sur la moitié gauche de la manette DualSense puis en appuyant sur le bouton apparaissant au milieu de l'écran.

En utilisant l'application PS App sur votre téléphone portable, vous pouvez également mettre en place un téléchargement en amont automatique de vos captures d'écran de votre PS5 vers l'application PS App afin de gagner du temps. Veuillez consulter le [guide de Sony](https://www.playstation.com/fr-fr/support/games/ps5-game-captures-ps-app/) pour de plus amples informations. Sinon vous pouvez alternativement partager vos captures d'écran via un Chat ou via les réseaux sociaux.

### Xbox

Veuillez suivre ce [guide pour Xbox](https://support.xbox.com/fr-FR/help/friends-social-activity/share-socialize/capture-game-clips-and-screenshots) pour savoir comment prendre des captures d'écran sur Xbox.

Je ne possède pas de console Xbox donc je n'ai pas plus d'informations. Si vous en avez une, n'hésitez pas à ouvrir une [issue sur GitHub](https://github.com/sebranly/ctr-ocr/issues) ou une Pull Request afin de compléter cette section.

### Switch

Sur Switch, les captures d'écran sont prises au format `JPG`. Leurs dimensions sont 1280x720.

Les captures d'écran peuvent être prises en appuyant sur le bouton de capture situé sur le Joy-Con gauche.

Vous pouvez transférer ces captures d'écran vers votre ordinateur ou téléphone portable (Smart Device) en utilisant une de ces méthodes :
- [Guide Nintendo pour transfert par USB](https://www.nintendo.ch/fr/Assistance/Nintendo-Switch/Comment-transferer-des-captures-d-ecran-et-des-videos-vers-un-ordinateur-via-un-cable-USB-1886300.html)
- [Guide Nintendo pour Smart Device](https://www.nintendo.fr/Assistance/Nintendo-Switch/Comment-transferer-des-captures-d-ecran-et-des-videos-vers-un-smartphone-ou-une-tablette-via-une-connexion-sans-fil-1886298.html)
