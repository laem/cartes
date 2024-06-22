import { decode } from 'Components/valhalla-decode-shape'

export default function (json) {
	const trip = json.trip
	const shapes = trip && trip.legs.map(({ shape }) => shape && decode(shape))
	return buildGeoJSON(shapes)
}

const buildGeoJSON = (shapes) => ({
	type: 'FeatureCollection',
	features: shapes.map((coordinates) => ({
		type: 'Feature',
		properties: {},
		geometry: {
			coordinates,
			type: 'LineString',
		},
	})),
})
