const maptilerUrl = (styleId) =>
	`https://api.maptiler.com/maps/${styleId}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER}`
export const styles = {
	base: {
		url: maptilerUrl('2f80a9c4-e0dd-437d-ae35-2b6c212f830b'),
		name: 'Base',
		emoji: '🗺️',
	},
	satellite: { url: maptilerUrl('satellite'), name: 'Satellite', emoji: '🛰️' },
	winter: { url: maptilerUrl('winter-v2'), name: 'Hiver', emoji: '⛄️' },
	outdoor: { url: maptilerUrl('outdoor-v2'), name: 'Extérieur', emoji: '🏕️' },
	ign: {
		url: 'https://wxs.ign.fr/static/vectorTiles/styles/PLAN.IGN/essentiels/standard.json',
		name: 'Plan IGN',
		image: 'IGN.svg',
		imageAlt: "Logo de l'IGN",
	},
}
