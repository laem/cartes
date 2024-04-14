import useDrawBookmarks from './effects/useDrawBookmarks'
import useDrawOsmFeaturePolygon from './effects/useDrawOsmFeaturePolygon'

// These hooks won't need to handle an undefined "map" object
export default function MapComponents({ map, vers }) {
	useDrawBookmarks(map)
	useDrawOsmFeaturePolygon(map, vers?.osmFeature)
	return null
}
