# Images

Also available in: [English](../en/Images.md)

## Introduction

Ce site web est principalement un outil image-vers-texte qui permet de convertir une image de résultats d'une course de Crash Team Racing: Nitro Fueled vers des données textuelles qui représentent ces mêmes résultats. C'est basé sur une technologie appelée OCR qui signifie Reconnaissance Optique de Caractères. Donc **il est important de fournir des images de bonne qualité**, prises directement du système (par exemple système PlayStation, console de jeu Switch, etc.) parce que c'est basé sur une reconnaissance de motifs.

## Informations Générales

### Formats

Le site web gère les formats suivants: `JPG`/`JPEG`/`PNG`.

### Dimensions

Le site web gère n'importe quelles dimensions du moment que le **rapport entre le largeur et la hauteur soit 1.78**. Par exemple les dimensions suivantes sont correctes: 3840x2160 (le maximum autorisé sur PS4 et PS5), 1920x1080 (le minimum autorisé sur PS4), 1280x720 (le maximum autorisé sur Switch), etc.

### Noms

Si vous téléchargez en amont plusieurs images, elles seront triées alphabétiquement par leur nom pour les résultats. Nous vous conseillons de les nommer avec un préfixe commun et un suffixe avec un numéro différent, par exemple comme ceci : `IMG1.JPG`, `IMG2.JPG`, ..., `IMG10.JPG` pour un événement à 10 courses. Veuillez noter que vous pouvez utiliser des formats d'image différents pour un même événement par exemple `IMG1.JPG` vs `IMG2.PNG`.

Un exemple avec 10 courses est disponible dans ce [dossier d'exemple](https://github.com/sebranly/ctr-ocr/tree/main/src/img/examples/full-event).

## Plateformes

### PS5

Sur PS5, les captures d'écran peuvent être prises sous deux formats différents : `JPG`/`PNG`. J'ai remarqué que le format `PNG` est bien plus lourd (>10MB) que le format `JPG`/`JPEG` (<1MB) alors que les dimensions sont les mêmes (3840x2160). Comme ils offrent les mêmes résultats, **je recommande d'utiliser simplement `JPG`/ `JPEG`.**

|JPG|PNG|
|-|-|
|![](https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/examples/IMG1.JPG?raw=true)|![](https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/examples/IMG1.PNG?raw=true)|

Vous pouvez prendre des captures d'écran en appuyant sur la touche Share sur la moitié gauche de la manette DualSense puis en appuyant sur le bouton apparaissant au milieu de l'écran.

En utilisant l'application PS App sur votre téléphone portable, vous pouvez également mettre en place un téléchargement en amont automatique de vos captures d'écran de votre PS5 vers l'application PS App afin de gagner du temps. Veuillez consulter le [guide de Sony](https://www.playstation.com/fr-fr/support/games/ps5-game-captures-ps-app/) pour de plus amples informations. Sinon vous pouvez alternativement partager vos captures d'écran via un Chat ou via les réseaux sociaux.

### PS4

Sur PS4, les captures d'écran peuvent être prises sous deux formats différents: `JPG`/`PNG`. Comme indiqué sur l'interface de la PS4, le format `PNG` est plus lourd et pas supporté partout quand il est partagé. J'ai remarqué ceci en partageant via Party (et en récupérant l'image avec PS App) et sur Twitter : l'image devient `JPG`.

Les dimensions peuvent être soit 3840x2160 soit 1920x1080.

Vous pouvez prendre des captures d'écran en maintenant la touche Share (en mode Standard) sur la moitié gauche de la manette DualShock 4. J'ai remarqué que c'est la meilleure méthode : étant données les différences d'architecture entre la PS4 et la PS5, l'interface de la PS4 est plus lente pour prendre des captures d'écran sinon.

Vous pouvez ensuite partager vos captures d'écran via Party ou sur les réseaux sociaux (par exemple Twitter). Lors de mes tests, peu importe les dimensions et le format de la capture d'écran, l'image était convertie au format `JPG` et aux dimensions 1920x1080.

**Pour ces raisons, je recommande de simplement configurer votre PS4 pour prendre des captures d'écran au format `JPG` et aux dimensions 1920x1080.**

![](https://raw.githubusercontent.com/sebranly/ctr-ocr/main/src/img/examples/ps4/IMG_PS4.JPG?raw=true)

### Xbox

Veuillez suivre ce [guide pour Xbox](https://support.xbox.com/fr-FR/help/friends-social-activity/share-socialize/capture-game-clips-and-screenshots) pour savoir comment prendre des captures d'écran sur Xbox.

Je ne possède pas de console Xbox donc je n'ai pas plus d'informations. Si vous en avez une, n'hésitez pas à ouvrir une [issue sur GitHub](https://github.com/sebranly/ctr-ocr/issues) ou une Pull Request afin de compléter cette section.

### Switch

Sur Switch, les captures d'écran sont prises au format `JPG`. Leurs dimensions sont 1280x720.

Les captures d'écran peuvent être prises en appuyant sur le bouton de capture situé sur le Joy-Con gauche.

Vous pouvez transférer ces captures d'écran vers votre ordinateur ou téléphone portable (Smart Device) en utilisant une de ces méthodes :
- [Guide Nintendo pour transfert par USB](https://www.nintendo.ch/fr/Assistance/Nintendo-Switch/Comment-transferer-des-captures-d-ecran-et-des-videos-vers-un-ordinateur-via-un-cable-USB-1886300.html)
- [Guide Nintendo pour transfert vers smartphone](https://www.nintendo.fr/Assistance/Nintendo-Switch/Comment-transferer-des-captures-d-ecran-et-des-videos-vers-un-smartphone-ou-une-tablette-via-une-connexion-sans-fil-1886298.html)
