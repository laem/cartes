export default function handleCirconscriptionsLegislativesClick(rawFeatures) {
	const circo = rawFeatures.find(
		(feature) => (feature.sourceLayer = 'circolegislativesumap')
	)
	if (!circo) return
	return circo.properties
}
