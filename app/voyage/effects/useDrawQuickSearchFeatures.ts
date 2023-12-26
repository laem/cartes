import { computeCssVariable } from '@/components/utils/colors'
import { fromHTML } from '@/components/utils/htmlUtils'
import parseOpeningHours from 'opening_hours'
import { categoryIconUrl } from '../QuickFeatureSearch'
import { useEffect } from 'react'

export default function useDrawQuickSearchFeatures(
	map,
	features,
	showOpenOnly,
	category
) {
	useEffect(() => {
		if (!map || features.length < 1 || !category) return

		const shownFeatures = !showOpenOnly
			? features
			: features.filter((f) => {
					if (!f.tags || f.tags.opening_hours) return false
					try {
						const oh = new parseOpeningHours(f.tags.opening_hours, {
							address: { country_code: 'fr' },
						})
						return oh.getState()
					} catch (e) {
						return false
					}
			  })

		const asyncLoadImage = async () => {
			const imageUrl = categoryIconUrl(category)

			const imageRequest = await fetch(imageUrl)
			const imageText = await imageRequest.text()

			// If both the image and svg are found, replace the image with the svg.
			const img = new Image(40, 40)

			const svg = fromHTML(imageText)
			const svgSize = svg.getAttribute('width'), // Icons must be square !
				xyr = svgSize / 2
			const backgroundDisk = `<circle
     style="fill:${encodeURIComponent(
				computeCssVariable('--color')
			)};fill-rule:evenodd"
     cx="${xyr}"
     cy="${xyr}"
     r="${xyr}" />`
			const newInner = `${backgroundDisk}<g style="fill:white;" transform="scale(.7)" transform-origin="center" transform-box="fill-box">${svg.innerHTML}</g>`
			svg.innerHTML = newInner
			console.log('svg', newInner)
			console.log(svg.outerHTML)

			img.src = 'data:image/svg+xml;charset=utf-8,' + svg.outerHTML

			img.onload = () => {
				const imageName = category.name + '-futureco'
				const mapImage = map.getImage(imageName)
				if (!mapImage) map.addImage(imageName, img)
				console.log('OYOYO', category.name, img)

				console.log('features', shownFeatures, features)
				map.addSource('features-points', {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: shownFeatures.map((f) => {
							const geometry = {
								type: 'Point',
								coordinates: [f.lon, f.lat],
							}

							const tags = f.tags || {}
							return {
								type: 'Feature',
								geometry,
								properties: {
									id: f.id,
									tags,
									name: tags.name,
									featureType: f.type,
								},
							}
						}),
					},
				})
				map.addSource('features-ways', {
					type: 'geojson',
					data: {
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
					},
				})

				// Add a symbol layer
				map.addLayer({
					id: 'features-ways',
					type: 'fill',
					source: 'features-ways',
					layout: {},
					paint: {
						'fill-color': computeCssVariable('--lightestColor'),
						'fill-opacity': 0.6,
					},
				})
				map.addLayer({
					id: 'features-ways-outlines',
					type: 'line',
					source: 'features-ways',
					layout: {},
					paint: {
						'line-color': computeCssVariable('--color'),
						'line-width': 2,
					},
				})
				map.addLayer({
					id: 'features-points',
					type: 'symbol',
					source: 'features-points',
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
			}
		}

		asyncLoadImage()

		return () => {
			try {
				map.removeLayer('features-points')
				map.removeSource('features-points')
				map.removeLayer('features-ways')
				map.removeLayer('features-ways-outlines')
				map.removeSource('features-ways')
			} catch (e) {
				console.warn(e)
			}
		}
	}, [features, map, showOpenOnly, category])
}
