import parseOpeningHours from 'opening_hours'
import { categoryIconUrl } from '../QuickFeatureSearch'
import { useEffect } from 'react'
import buildSvgImage from './buildSvgImage'
import useSetSearchParams from '@/components/useSetSearchParams'
import { encodePlace } from '../utils'
import { buildAllezPart } from '../SetDestination'
import { safeRemove } from './utils'
import { colors } from '@/components/utils/colors'

export default function useDrawQuickSearchFeatures(
	map,
	features,
	showOpenOnly,
	category,
	setOsmFeature = () => null,
	backgroundColor
) {
	const setSearchParams = useSetSearchParams()
	useEffect(() => {
		if (!map || !category) return
		if (!features) return

		const featuresWithOpen = features.map((f) => {
			if (!f.tags || !f.tags.opening_hours) {
				return { ...f, isOpen: null }
			}
			try {
				const oh = new parseOpeningHours(f.tags.opening_hours, {
					address: { country_code: 'fr' },
				})
				return { ...f, isOpen: oh.getState() }
			} catch (e) {
				return { ...f, isOpen: null }
			}
		})

		const shownFeatures = showOpenOnly
			? featuresWithOpen.filter((f) => f.isOpen)
			: featuresWithOpen

		const isOpenByDefault = category['open by default']
		const imageUrl = categoryIconUrl(category)
		const baseId = `features-${category.name}-`
		buildSvgImage(
			imageUrl,
			(img) => {
				console.log('useDrawQuickSearchFeatures build svg image', shownFeatures)
				const imageName = category.name + '-futureco'
				const mapImage = map.getImage(imageName)
				if (!mapImage) map.addImage(imageName, img)

				console.log('useDrawQuickSearchFeatures add source ', baseId + 'points')
				// Looks like buildSvgImage triggers multiple img.onload calls thus
				// multiple map.addSource, hence an error
				const pointsSource = map.getSource(baseId + 'points')
				const waysSource = map.getSource(baseId + 'ways')
				const pointsData = {
					type: 'FeatureCollection',
					features: shownFeatures.map((f) => {
						const geometry = {
							type: 'Point',
							coordinates: [f.lon, f.lat],
						}

						const tags = f.tags || {}
						const isOpenColor = {
							true: '#4ce0a5ff',
							false: '#e95748ff',
							null: isOpenByDefault ? false : 'beige',
						}[f.isOpen]

						return {
							type: 'Feature',
							geometry,
							properties: {
								id: f.id,
								tags,
								name: tags.name,
								featureType: f.type,
								isOpenColor: isOpenColor,
							},
						}
					}),
				}
				const waysData = {
					type: 'FeatureCollection',
					features: shownFeatures
						.filter((f) => f.polygon)
						.map((f) => {
							const tags = f.tags || {}
							return {
								type: 'Feature',
								geometry: f.polygon.geometry,
								properties: {
									id: f.id,
									tags,
									name: tags.name,
								},
							}
						}),
				}
				if (waysSource) {
					waysSource.setData(waysData)
					pointsSource.setData(pointsData)
					return
				}
				map.addSource(baseId + 'points', {
					type: 'geojson',
					data: pointsData,
				})

				map.addSource(baseId + 'ways', {
					type: 'geojson',
					data: waysData,
				})

				// Add a symbol layer
				map.addLayer({
					id: baseId + 'ways',
					type: 'fill',
					source: baseId + 'ways',
					layout: {},
					paint: {
						'fill-color': colors['lightestColor'],
						'fill-opacity': 0.6,
					},
				})
				map.addLayer({
					id: baseId + 'ways-outlines',
					type: 'line',
					source: baseId + 'ways',
					layout: {},
					paint: {
						'line-color': colors['color'],
						'line-width': 2,
					},
				})
				map.addLayer({
					id: baseId + 'points',
					type: 'symbol',
					source: baseId + 'points',
					layout: {
						'icon-image': category.name + '-futureco',
						'icon-size': 0.6,
						'text-field': ['get', 'name'],
						'text-offset': [0, 1.25],
						'text-anchor': 'top',
					},
					paint: {
						'text-color': '#503f38',
						'text-halo-blur': 0.5,
						'text-halo-color': 'white',
						'text-halo-width': 1,
					},
				})
				map.addLayer({
					id: baseId + 'points-is-open',
					type: 'circle',
					source: baseId + 'points',
					paint: {
						'circle-radius': 4,
						'circle-color': ['get', 'isOpenColor'],
						'circle-stroke-color': colors['color'],
						'circle-stroke-width': 1.5,
						'circle-translate': [12, -12],
					},
					filter: ['!=', 'isOpenColor', false],
				})

				map.on('click', baseId + 'points', async (e) => {
					const feature = e.features[0]
					const { lng: longitude, lat: latitude } = e.lngLat
					const properties = feature.properties,
						tagsRaw = properties.tags
					console.log('quickSearchOSMfeatureClick', feature)
					const tags =
						typeof tagsRaw === 'string' ? JSON.parse(tagsRaw) : tagsRaw

					setSearchParams({
						allez: buildAllezPart(
							tags?.name || 'sans nom',
							encodePlace(properties.featureType, properties.id),
							longitude,
							latitude
						),
					})

					const osmFeature = { ...properties, tags }
					console.log(
						'will set OSMfeature after quickSearch marker click, ',
						osmFeature
					)
					setOsmFeature(osmFeature)
				})
				map.on('mouseenter', 'features-points', () => {
					map.getCanvas().style.cursor = 'pointer'
				})
				// Change it back to a pointer when it leaves.
				map.on('mouseleave', 'features-points', () => {
					map.getCanvas().style.cursor = 'auto'
				})
			},
			backgroundColor
		)

		return () => {
			if (!features)
				safeRemove(map)(
					[
						baseId + 'points',
						baseId + 'points-is-open',
						baseId + 'ways-outlines',
						baseId + 'ways',
					],
					[baseId + 'points', baseId + 'ways']
				)
		}
	}, [features, map, showOpenOnly, category])
}
