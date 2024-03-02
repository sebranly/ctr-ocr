# FAQ

Also available in: [English](../en/FAQ.md)

## Où est ce site web ?

Crash Team Results est disponible à l'adresse https://sebranly.github.io/ctr-ocr/

## Pourquoi est-ce que je n'arrive plus à accéder au site web ?

SVP vérifiez que vous essayez d'y accéder via https://sebranly.github.io/ctr-ocr/, car l'ancien nom de domaine crashteamresults.com n'héberge plus ce site du tout.

## Pourquoi ce nom ?

Crash Team Results est basé sur le jeu vidéo Crash Team Racing: Nitro-Fueled. Je voulais garder les mêmes mots/sons autant que possible, comme l'a fait le site web Crash Team Ranking.

## Quel est ce site web ?

Ce site web vous permet de télécharger en amont plusieurs captures d'écran d'un événement de plusieurs courses en ligne pour le jeu vidéo Crash Team Racing: Nitro-Fueled. Avec quelques configurations faites en amont, le site web peut ensuite analyser les captures d'écran et automatiquement créer les données textuelles de Lorenzi pour l'événement.

## Pourquoi devrais-je utiliser ce site web ?

La création des données textuelles de Lorenzi à la main est source d'erreur. L'utilisation de ce site web (Crash Team Results) pour générer le Lorenzi est plus fiable parce que l'interface vous guide et vous informe lorsqu'il y a des modifications à apporter en cas d'erreur, avant de passer à l'étape suivante. Aussi, vous y gagnerez du temps.

## Puis-je utiliser le site web Lorenzi pour la reconnaissance d'images de CTR:NF ?

Non. Sauf erreur de ma part, le site web Lorenzi ne vous permet de faire de la reconnaissance d'image que pour le jeu vidéo Mario Kart 8 Deluxe.

## Devrais-je continuer d'utiliser le site web Lorenzi ?

Oui. Vous devriez continuer d'utiliser le site web Lorenzi. Le site web Crash Team Results n'est utile que pour les étapes allant jusqu'à la génération des données textuelles de Lorenzi. Une fois ces données acquises, vous devez vous rendre sur le site web de Lorenzi afin de copier/coller ces données. Autrement dit, Crash Team Results est complémentaire au site web Lorenzi.

## Quelle technologie est utilisée ?

C'est principalement basé sur l'OCR qui signifie Reconnaissance Optique de Caractères. C'est basé sur un port JavaScript de `tesseract` qui est un moteur OCR. Le reste du site web est une application front-end faite de React/TypeScript.

## Pourquoi y-a-t'il des limitations sur le nombre de joueurs ?

Comme l'outil est lié aux courses en ligne, il faut qu'au moins deux joueurs s'affrontent. Le jeu vidéo CTR:NF ne permet qu'un maximum de 8 joueurs.

## Est-ce que les temps sont pris en compte ?

Non. Pour le moment, les temps ne sont pas pris en compte lors de la reconnaissance d'images, bien qu'ils apparaissent sur les captures d'écran. Le site web supportera peut-être cette fonctionnalité dans une future mise à jour.

## Que dois-je faire si un joueur a été déconnecté en plein jeu ?

Si un joueur est déconnecté en plein jeu et remplacé par un CPU pendant une course qui était supposée se dérouler entre joueurs humains seulement, il est possible que la capture d'écran utilise le nom du CPU plutôt que le nom du joueur humain. Je vous recommande de faire les choses suivantes :
- sur le site web Crash Team Results, n'activez pas les CPUs
- effectuer la reconnaissance sur la capture d'écran qui contient le nom du CPU
- une fois la reconnaissance finie, le nom d'un joueur humain quelconque sera donné à la place du CPU
- corrigez cette partie en y attribuant le nom du joueur humain attendu 

## Dites-moi en plus à propos des images/captures d'écran

Veuillez consulter [Images](./Images.md)

## Dites-moi en plus à propos des joueurs humains

Veuillez consulter [Users](./Users.md)

## Dites-moi en plus à propos des CPUs

Veuillez consulter [CPUs](./CPUs.md)

## Dites-moi en plus à propos du changelog de ce site web

Veuillez consulter [Changelog](https://github.com/sebranly/ctr-ocr/releases)