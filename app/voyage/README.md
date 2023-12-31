# Voyage

## Kesako ? 

C'est **une application Web de cartographie généraliste**, basée sur les données d'OpenStreetMap et d'autres projets de communs comme Wikimedia Commons (pour les images) ou Wikipedia. 

Deux objectifs : 
- pouvoir explorer la France, ses lieux d'intérêt (commerces, attractions touristiques, etc) sans dépendre de Google, Apple et autre GAFAM
- proposer des calculateurs d'itinéraires écologiques

Découvrez [nos motivations](https://futur.eco/blog/un-beau-voyage) et les dernières nouveautés dans [le blog](https://futur.eco/blog).

## Et techniquement

I started implementing this map in november 2023 as a kind of personal useful advent of code. I quickly figured out the open source tech and data in 2023 to make modern map interface have become incredibly mature, compared to 10 years ago. You get 3D buildings, vector tiles in 1 h of dev. 

The app is based on : 
- data : OSM (of course), Wikimedia commons (for the images), Wikidata, Wikipedia
- code : nextjs, maplibre, styled-components
- hosting : maptiler for the vector map tiles, vercel for JS deployment, Photon API by Komoot.

To set it up on your local computer, just run :

```
yarn && yarn dev
```

You'll have to create your free MapTiler key and put it in a `env.local` file : 

```
NEXT_PUBLIC_MAPTILER=YOUR_KEY
```
