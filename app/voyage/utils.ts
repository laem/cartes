const correspondance = { r: 'relation', w: 'way', n: 'node' }
export const decodePlace = (place) => {
	if (!place) return [null, null]
	const letter = place.slice(0, 1)

	const id = place.slice(1)

	return [correspondance[letter], id]
}

export const encodePlace = (featureType, id) => featureType.slice(0, 1) + id
