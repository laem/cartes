import railStyle from './railStyle'
import voyageStyle from './voyage'

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
	winter: {
		url: maptilerUrl('winter-v2'),
		name: 'Hiver',
		emoji: '⛄️',
		hasTerrain: true,
	},
	outdoor: {
		url: maptilerUrl('outdoor-v2'),
		name: 'Extérieur',
		emoji: '🏕️',
		hasTerrain: true,
	},
	ign: {
		url: 'https://wxs.ign.fr/static/vectorTiles/styles/PLAN.IGN/essentiels/standard.json',
		name: 'Plan IGN',
		image: 'IGN.svg',
		imageAlt: "Logo de l'IGN",
	},
	train: {
		url: railStyle(key),
		name: 'Carte des rails',
		emoji: '🛤️',
	},
	dataviz: {
		url: maptilerUrl('dataviz'),
		name: 'Fond léger',
		emoji: '⬜️',
	},
}
