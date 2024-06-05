import { decode } from '@/components/valhalla-decode-shape'

export default function (json) {
	const trip = json.trip
	const shape = trip && trip.legs[0].shape
	const decoded = shape && decode(shape)
	return buildGeoJSON(decoded)
}

const buildGeoJSON = (coordinates) => ({
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			properties: {},
			geometry: {
				coordinates,
				type: 'LineString',
			},
		},
	],
})
