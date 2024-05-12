import DrawTransportMaps from '@/components/voyage/map/DrawTransportMaps'
import useDrawBookmarks from './effects/useDrawBookmarks'
import useDrawOsmFeaturePolygon from './effects/useDrawOsmFeaturePolygon'
import { memo } from 'react'

// These hooks won't need to handle an undefined "map" object
function MapComponents({
	map,
	vers,
	transportsData,
	isTransportsMode,
	setTempStyle,
	styleKey,
	searchParams,
}) {
	useDrawBookmarks(map)
	useDrawOsmFeaturePolygon(map, vers?.osmFeature)
	return (
		<>
			{isTransportsMode && (
				<DrawTransportMaps
					{...{ map, transportsData, setTempStyle, styleKey, searchParams }}
				/>
			)}
		</>
	)
}

export default MapComponents
