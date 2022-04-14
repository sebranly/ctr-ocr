# Changelog

Also available in: [English](../en/Changelog.md)

## v1

### v1.0.16

**Corrections de bugs :**
- la reconnaissance de pseudos a été améliorée grâce à deux changements :
  - la liste des symboles autorisés a été mise à jour pour n'inclure que les caractères alphanumériques contenus dans la liste des joueurs humains/CPUs
  - l'algorithme de distance d'édition a été mis à jour. C'était une simple distance de Levenshtein. C'est maintenant plus poussé car les caractères alphanumériques proches (par exemple `B` et `8`) ont désormais un score de substitution strictement inférieur à 1

### v1.0.15

**Documentation :**
- le changelog est disponible sur le site web
- la FAQ est disponible sur le site web

**Fonctionnalités :**
- il est possible de sélectionner `0` points pour les joueurs pour chaque course, peu importe la configuration globale des points

**Corrections de bugs :**
- l'utilisation de valeurs négatives pour les points est plus facile, en particulier sur les téléphones

**Code source :**
- réduction de la dette technique

### v1.0.14

Lancement public du site web qui gère les points suivants :
- **courses en ligne pour le jeu CTR:NF seulement**
- un nombre de joueurs entre 2 et 8
- présence de CPUs (langues supportées : anglais, français, espagnol)
- équipes seulement si les CPUs sont désactivés. Le nombre d'équipes est un nombre entre 2 et le nombre de joueurs (ce qui signifie Chacun pour soi). Si les CPUs sont activés, Chacun pour soi est imposé.
- téléchargement en amont de plusieurs images au format `JPEG`/`JPG`/`PNG` et aux dimensions quelconques
- ajustement des résultats de l'analyse (pseudonymes et points) pour chaque course
- Génération des données textuelles au format Lorenzi, en prenant en considération les configurations d'équipes