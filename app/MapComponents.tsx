import DrawTransportMaps from '@/components/map/DrawTransportMaps'
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
	safeStyleKey,
	searchParams,
	hasItinerary,
}) {
	useDrawBookmarks(map)
	useDrawOsmFeaturePolygon(map, vers?.osmFeature)
	return (
		<>
			{isTransportsMode && (
				<DrawTransportMaps
					{...{
						map,
						transportsData,
						setTempStyle,
						safeStyleKey,
						searchParams,
						hasItinerary,
					}}
				/>
			)}
		</>
	)
}

export default MapComponents
