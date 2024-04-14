import useDrawBookmarks from './effects/useDrawBookmarks'
import useDrawOsmFeaturePolygon from './effects/useDrawOsmFeaturePolygon'
import { memo } from 'react'

// These hooks won't need to handle an undefined "map" object
function MapComponents({ map, vers }) {
	useDrawBookmarks(map)
	useDrawOsmFeaturePolygon(map, vers?.osmFeature)
	return null
}

export default MapComponents
