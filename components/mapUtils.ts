export const goodIconSize = (zoom, factor) => {
	const size = Math.max(0, (factor || 1) * 3.5 * zoom - 16) // I have a doctorate in zoom to icon size study
	return size
}

export const mapLibreBboxToOverpass = (bbox) => [
	bbox[0][1],
	bbox[0][0],
	bbox[1][1],
	bbox[1][0],
]
