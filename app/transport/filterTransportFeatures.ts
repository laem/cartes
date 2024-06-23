import { trainTypeSncfMapping } from './SncfSelect'
import { transitFilters } from './TransitFilter'

export const filterTransportFeatures = (
	features,
	{ routesParam, stop, trainType, transitFilter }
) => {
	if (routesParam || stop || trainType || transitFilter) {
		const filteredFeatures = features.filter(
			(feature) =>
				(!routesParam ||
					routesParam.split('|').includes(feature.properties.route_id)) &&
				(!stop || feature.properties.stopList?.includes(stop)) &&
				(!trainType ||
					trainType === 'tout' ||
					trainTypeSncfMapping[trainType].includes(
						feature.properties.sncfTrainType
					)) &&
				(!transitFilter ||
					transitFilters
						.find(([key]) => key === transitFilter)[1]
						.filter(feature))
		)

		if (stop)
			return [
				...filteredFeatures,
				features.find(
					({ geometry: { type }, properties: { name } }) =>
						type === 'Point' && name === stop
				),
			]

		const relevantStops = new Set(
			filteredFeatures.map((route) => route.properties.stopList).flat()
		)
		return [
			...filteredFeatures,
			...features.filter(
				(feature) =>
					feature.geometry.type === 'Point' &&
					relevantStops.has(feature.properties.name)
			),
		]
	}
	return features
}
