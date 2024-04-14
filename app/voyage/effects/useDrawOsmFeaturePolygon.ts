import { useMemo } from 'react'
import useDrawQuickSearchFeatures from './useDrawQuickSearchFeatures'

export default function useDrawOsmFeaturePolygon(map, osmFeature) {
	const features = useMemo(() => (osmFeature ? [osmFeature] : []), [osmFeature])
	console.log('darkblue features', features)
	useDrawQuickSearchFeatures(map, features, false, {
		name: 'vers',
		icon: 'search-result',
		'open by default': true,
	})
}
