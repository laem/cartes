import cyclOsm from './cyclOsmStyle'
import elections from './elections'
import natureStyle from './nature'
import protomaps from './protomaps'
import railStyle from './railStyle'
import testStreetComplete from './test-street-complete'
import transit from './transit'
import voyageStyle from './voyage'
import franceStyle from './france'

const key = process.env.NEXT_PUBLIC_MAPTILER

const maptilerUrl = (styleId) =>
	`https://api.maptiler.com/maps/${styleId}/style.json?key=${key}`
export const styles = {
	base: {
		url: voyageStyle(key),
		name: 'Base',
		emoji: '🗺️',
	},
	france: { url: franceStyle(key), name: 'France' },
	elections: {
		url: elections(key),
		name: 'Élections',
		emoji: '🗳️',
	},
	satellite: {
		url: maptilerUrl('satellite'),
		name: 'Satellite',
		emoji: '🛰️',
	},
	satelliteHybrid: {
		url: maptilerUrl('hybrid'),
		title: 'satellite avec superposition des noms de lieux et rues',
		name: 'Hybride',
		emoji: '🛰️',
	},
	rando: {
		url: maptilerUrl('outdoor-v2'),
		name: 'Randonnée',
		subtitle: '(marche & vélo)',
		emoji: '🚶',
		hasTerrain: true,
	},
	ign: {
		url: 'https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json',
		name: 'IGN',
		imageAlt: "Logo de l'IGN",
		attribution: '© IGN',
	},
	osm: {
		url: maptilerUrl('openstreetmap'),
		name: 'OpenStreetMap',
		experimental: true,
	},
	nature: {
		url: natureStyle(key),
		name: 'Nature',
		emoji: '🏕️',
		hasTerrain: false,
	},
	cycling: { url: cyclOsm(key), name: 'Cyclable', emoji: '🚲️' },
	rail: {
		url: railStyle(key),
		name: 'Rails',
		emoji: '🛤️',
	},
	light: {
		// Taken from MapTiler's dataviz style
		url: transit(key),
		name: 'Fond léger',
		emoji: '⬜️',
	},
	winter: {
		url: maptilerUrl('winter-v2'),
		name: 'Hiver',
		emoji: '⛄️',
		hasTerrain: true,
	},
	'street-complete': {
		// Taken from MapTiler's dataviz style
		url: testStreetComplete,
		name: 'StreetComplete',
		emoji: '🧪',
		experimental: true,
	},
	/* This style will replace the base MapTiler style, for cost reduction
	 * purposes (50 to 100 €/month in june !)
	 * TODO See https://forum.geocommuns.fr/t/regles-dutilisation-du-pmtiles-panoramax-osm-fr/1624
	 * Meanwhile, we use protomaps in the election style
	 */
	protomaps: {
		//url: `https://api.protomaps.com/styles/v2/light.json?key=8df307109ae3eabc`,
		url: protomaps(key),
		name: 'Protomaps',
		emoji: '⚡️',
		image: 'base',
		experimental: true,
	},
}

export const getStyle = (styleKey) => ({ ...styles[styleKey], key: styleKey })
