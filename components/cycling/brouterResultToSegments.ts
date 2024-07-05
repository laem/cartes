import isSafeCyclingSegment from './isSafeCyclingSegment'

export const getMessages = (geojson) => {
	const [_, ...table] = geojson.features[0].properties.messages

	return table
}

export default function (brouterGeojson) {
	const geojson = brouterGeojson
	if (geojson.features.length > 1) throw Error('Oulala pas prévu ça')
	const table = getMessages(geojson)
	const coordinateStringToNumber = (string) => +string / 10e5
	const getLineCoordinates = (line) =>
			line && [line[0], line[1]].map(coordinateStringToNumber),
		getLineDistance = (line) => line[3],
		getLineTags = (line) => line[9]

	const { toPoint, fromPoint, backboneRide } = geojson
	let mutableLineStringCoordinates = geojson.features[0].geometry.coordinates
	// As I understand this, the "messages" table contains brouter's real measurement of distance
	// in segments that are grouped, maybe according to tags ?
	// The LineString ('geometry') contains the real detailed shape
	// Important info for score calculation is contained in the table,
	// whereas important info for map display is contained in the LineString
	// from the first lineString coords to the first message coords (that correspond to another linestring coord), apply the properties of the message
	// ...
	// until the last lineString coord, apply the properties of the message, that goes way further in termes of coords but whose distance is right

	const featureCollection = {
		type: 'FeatureCollection',
		features: table
			.map((line, i) => {
				const [lon, lat] = getLineCoordinates(line)
				return {
					type: 'Feature',
					properties: {
						tags: getLineTags(line),
						distance: line[3],
						elevation: line[2],
						backboneRide,
						isSafePath: isSafeCyclingSegment(getLineTags(line)) ? 'oui' : 'non',
						toPoint,
						fromPoint,
					},
					geometry: {
						type: 'LineString',
						coordinates: computeFeatureCoordinates(
							mutableLineStringCoordinates,
							lon,
							lat
						),
					},
				}
			})
			.filter(Boolean),
	}
	return featureCollection
}

const computeFeatureCoordinates = (mutableLineStringCoordinates, lon, lat) => {
	const selected = mutableLineStringCoordinates.slice(0).reduce(
		([selected, shouldContinue, rest], next, i, array) => {
			const [lon2, lat2] = next
			const foundBoundary = lon2 == lon && lat2 == lat
			if (!foundBoundary) return [[...selected, next], true, rest]
			if (foundBoundary) {
				array.splice(1) // break the reduce loop
				return [
					[...selected, next],
					false,
					mutableLineStringCoordinates.slice(i),
				]
			}
		},
		[[], true, []]
	)
	mutableLineStringCoordinates = selected[2]

	return selected[0]
}
