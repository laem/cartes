import GeoJsonToGpx from '@dwayneparton/geojson-to-gpx'
import { useEffect } from 'react'
import { Wrapper } from './DownloadGPXWrapper'

const options = {
	metadata: {
		name: 'A grand adventure',
		author: {
			name: 'Dwayne Parton',
			link: {
				href: 'https://www.dwayneparton.com',
			},
		},
	},
}

const geojson = {
	type: 'Feature',
	properties: {
		name: 'Slow journey from null island',
	},
	geometry: {
		type: 'LineString',
		coordinates: [
			[0.0, 0.0],
			[0.0, 1.0],
			[0.0, 2.0],
			[0.0, 3.0],
		],
	},
}

export default function DownloadGPX({ reset, feature }) {
	// Will convert geojson into xml document
	const gpx = GeoJsonToGpx(feature, options)

	// convert document to string or post process it
	const gpxString = new XMLSerializer().serializeToString(gpx)
	useEffect(() => {
		// @see https://stackoverflow.com/questions/10654971/create-text-file-from-string-using-js-and-html5
		const link = document.createElement('a')
		link.download = 'geojson-to-gpx.gpx'
		const blob = new Blob([gpxString], { type: 'text/xml' })
		link.href = window.URL.createObjectURL(blob)
		link.click()
	}, [])

	return (
		<Wrapper>
			<div>
				Hop ! Bonne route !
				<small>Le téléchargement devrait déjà être terminé.</small>
			</div>
			<button onClick={() => reset()}>OK</button>
		</Wrapper>
	)
}
