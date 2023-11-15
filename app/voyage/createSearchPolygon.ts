const createSearchBBox = (latLngClicked) => {
	const diffLng = 0.0003,
		diffLat = 0.0002
	const { lat, lng } = latLngClicked

	const lat1 = lat - diffLat,
		lng1 = lng + diffLng,
		lat2 = lat + diffLat,
		lng2 = lng - diffLng

	const result = { lat1, lng1, lat2, lng2 }
	return result
}

export default createSearchBBox
