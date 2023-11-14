const createSearchBBox = (latLngClicked) => {
	const diff = 0.0006 / 2
	const { lat, lng } = latLngClicked

	const lat1 = lat + diff,
		lng1 = lng - diff,
		lat2 = +lat1 - diff,
		lng2 = +lng1 + diff

	return { lat1, lng1, lat2, lng2 }
}

export default createSearchBBox
