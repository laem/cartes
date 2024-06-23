# Comment contribuer ?

Merci de prendre le temps de contribuer ! 🎉

Pour contribuer au code du site, RDV dans la section _issues_ pour voir les discussions et avancement actuels.

Ci-dessous des informations plus générales sur la contribution.

### Technologies

Nous utilisons :

-   [publicodes](https://publi.codes) pour notre modèle de calcul nouvelle génération
-   [TypeScript](https://www.typescriptlang.org) pour ajouter un système de typage à notre code JavaScript. Le typage n'est pas utilisé partout et il n'est pas obligatoire de le prendre en compte pour contribuer.
-   [NPM](https://npmjs.com) pour la gestion des dépendances
-   [React](https://reactjs.org) pour la gestion de l'interface utilisateur
-   [NPM](https://nextjs.org) pour la gestion des dépendances
-   [Prettier](https://prettier.io/) pour formater le code source, l'idéal est de configurer votre éditeur de texte pour que les fichiers soit formatés automatiquement quand vous sauvegardez un fichier. Si vous utilisez [VS Code](https://code.visualstudio.com/) cette configuration est automatique.
-   [Eslint](http://eslint.org) qui permet par exemple d'éviter de garder des variables inutilisées

### Démarrage

`` 
# Cette option est nécessaire pour gérer Next 15 rc / React 19
npm run dev --legacy-peer-deps

``
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
