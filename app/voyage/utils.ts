const correspondance = { r: 'relation', w: 'way', n: 'node' }

export const decodePlace = (place) => {
	if (!place) return [null, null]
	const letter = place.slice(0, 1)

	const id = place.slice(1)

	return [correspondance[letter], id]
}

export const encodePlace = (featureType, id) =>
	featureType.slice(0, 1).toLowerCase() + id

export const fitBoundsConsideringModal = (isMobile, bbox, map) =>
	map.fitBounds(bbox, {
		//TODO make it right with mobile snap, this is very basic
		padding: isMobile
			? { top: 50, bottom: 400, left: 50, right: 50 }
			: { top: 100, bottom: 100, left: 600, right: 100 },
	})
