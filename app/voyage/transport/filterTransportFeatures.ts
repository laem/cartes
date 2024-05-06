import { trainTypeSncfMapping } from './SncfSelect'
import { transitFilters } from './TransitFilter'

export const filterTransportFeatures = (
	features,
	{ routesParam, stop, trainType, transitFilter }
) => {
	if (routesParam || stop || trainType || transitFilter) {
		const routes = features.filter(
			(route) =>
				(!routesParam ||
					routesParam.split('|').includes(route.properties.route_id)) &&
				(!stop || route.properties.stopList?.includes(stop)) &&
				(!trainType ||
					trainType === 'tout' ||
					trainTypeSncfMapping[trainType].includes(
						route.properties.sncfTrainType
					)) &&
				(!transitFilter ||
					transitFilters
						.find(([key]) => key === transitFilter)[1]
						.filter(route))
		)
		if (stop) return routes
		const relevantStops = new Set(
			routes.map((route) => route.properties.stopList).flat()
		)
		return [
			...routes,
			...features.filter(
				(feature) =>
					feature.geometry.type === 'Point' &&
					relevantStops.has(feature.properties.name)
			),
		]
	}
	return features
}
