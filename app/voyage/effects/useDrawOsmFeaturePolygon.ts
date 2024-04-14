import useDrawQuickSearchFeatures from './useDrawQuickSearchFeatures'

export default function useDrawOsmFeaturePolygon(map, osmFeature) {
	useDrawQuickSearchFeatures(map, osmFeature ? [osmFeature] : [], false, {
		name: 'vers',
		icon: 'search-result',
		'open by default': true,
	})
}
