import railStyle from './railStyle'
import cyclOsm from './cyclOsmStyle'
import voyageStyle from './voyage'
import transit from './transit'
import testStreetComplete from './test-street-complete'

const key = process.env.NEXT_PUBLIC_MAPTILER

const maptilerUrl = (styleId) =>
	`https://api.maptiler.com/maps/${styleId}/style.json?key=${key}`
export const styles = {
	base: {
		url: voyageStyle(key),
		name: 'Base',
		emoji: '🗺️',
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
		image: 'rando.png',
		emoji: '🚶',
		hasTerrain: true,
	},
	ign: {
		url: 'https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json',
		name: 'IGN',
		image: 'IGN.svg',
		imageAlt: "Logo de l'IGN",
		attribution: '© IGN',
	},
	nature: {
		url: maptilerUrl('topo-v2'),
		name: 'Nature',
		image: 'nature.png',
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
}

export const getStyle = (styleKey) => ({ ...styles[styleKey], key: styleKey })
