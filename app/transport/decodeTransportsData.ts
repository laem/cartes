import { omit } from '@/components/utils/utils'
import mapboxPolyline from '@mapbox/polyline'
import { addDefaultColor } from './enrichTransportsData'

export const decodeTransportsData = ([agencyId, agencyData]) => {
	const { polylines, points, features: featuresRaw } = agencyData
	const lineStrings =
		polylines &&
		polylines.map((polylineObject) => ({
			type: 'Feature',
			geometry: mapboxPolyline.toGeoJSON(polylineObject.polyline),
			properties: omit(['polyline'], polylineObject),
		}))

	const features = (featuresRaw || [...lineStrings, ...points]).map(
		(feature) => ({
			...feature,
			properties: { ...feature.properties, agencyId },
		})
	)
	/* Splines don't work : seeminlgy straight equal LineString diverge
					 * because of splines
					const features = straightFeatures.map((feature) =>
						feature.geometry.type === 'LineString'
							? bezierSpline(feature)
							: feature
					)
					*/

	const result = addDefaultColor(features, agencyId)
	return [agencyId, { ...agencyData, features: result }]
}
