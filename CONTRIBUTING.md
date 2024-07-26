# Comment contribuer ?

Merci de prendre le temps de contribuer ! 🎉

Tout d'abord, la section _[issues](https://github.com/laem/cartes/issues)_ contient déjà des tas de problèmes à résoudre et d'informations utiles qui pourraient vous aider à contribuer : utilisez son moteur de recherche.

## Comment ajouter une catégorie de recherche de lieux ?

Copiez-collez l'un des blocs dans [categories.yaml](https://github.com/laem/cartes/blob/master/app/categories.yaml) ou [moreCategories.yaml](https://github.com/laem/cartes/blob/master/app/moreCategories.yaml) (les "more" apparaissent seulement au clic sur le gros bouton plus) et changez les attributs.
La partie la plus difficile, c'est l'icône : Maplibre n'accepte pas les icônes SVG, donc nous créons des PNG à la volée et ça implique quelques contraintes. Si vous galérez ou n'êtes pas dev, n'hésitez pas à proposer vos modifications même sans icônes, quelqu'un s'en chargera.

-   le format SVG Inkscape ne marchera pas, il est trop bardé d'attributs inutiles
-   le format Inkscape SVG _simple_ a plus de chances de marcher surtout en ayant converti les objets en chemins
-   encore plus de chances que ça marche en ayant converti les objets et les contours en chemins, et en ayant fusionné toutes les composantes connexes via l'outil de construction de forme booléen d'Inkscape

## Comment ajouter un réseau de transport en commun ?

Direction l'[autre dépot](https://github.com/laem/gtfs), côté serveur.

---

Ci-dessous des informations plus générales sur la contribution.

### Technologies

Nous utilisons :

-   [TypeScript](https://www.typescriptlang.org) pour ajouter un système de typage à notre code JavaScript. Le typage n'est pas utilisé partout et il n'est pas obligatoire de le prendre en compte pour contribuer.
-   [NPM](https://npmjs.com) pour la gestion des dépendances
-   [React](https://reactjs.org) pour la gestion de l'interface utilisateur
-   [Next](https://nextjs.org) comme framework Web
-   [Prettier](https://prettier.io/) pour formater le code source, il faudra que vous configuriez votre éditeur de texte pour que les fichiers soit formatés automatiquement quand vous sauvegardez un fichier. Si vous utilisez [VS Code](https://code.visualstudio.com/) cette configuration est automatique.
-   [Eslint](https://eslint.org) qui permet par exemple d'éviter de garder des variables inutilisées

### Démarrage

```
Cette option est nécessaire pour gérer Next 15 rc / React 19
npm run dev --legacy-peer-deps
```

L'application est alors dispo sur https://localhost:8080.

### Messages de commit

A mettre sans retenue dans les messages de commit :

https://github.com/atom/atom/blob/master/CONTRIBUTING.md#git-commit-messages

-   🎨 `:art:` when working on the app's visual style
-   🐎 `:racehorse:` when improving performance
-   📝 `:memo:` when writing docs
-   🐛 `:bug:` when fixing a bug
-   🔥 `:fire:` when removing code or files
-   💚 `:green_heart:` when fixing the CI build
-   ✅ `:white_check_mark:` when adding tests
-   ⬆️ `:arrow_up:` when upgrading dependencies
-   :sparkles: `:sparkles:` when formatting, renaming, reorganizing files

### Publicodes

Un tutoriel sur publicode est disponible sur https://publi.codes.
