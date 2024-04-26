import { useMemo } from 'react'
import useDrawQuickSearchFeatures from './useDrawQuickSearchFeatures'

export default function useDrawOsmFeaturePolygon(map, osmFeature) {
	const code = osmFeature?.id
	const features = useMemo(() => (osmFeature ? [osmFeature] : []), [code])
	const category = useMemo(
		() => ({
			name: 'vers-' + code,
			icon: 'search-result',
			'open by default': true,
		}),
		[code]
	)
	useDrawQuickSearchFeatures(map, features, false, category)
}
