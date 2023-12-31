import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Futureco Voyage',
		short_name: 'Voyage',
		description:
			'Une application de cartes pour découvrir les lieux autour de toi et voyager.',
		start_url: '/voyage',
		display: 'fullscreen',
		background_color: '#fff',
		theme_color: '#2988e6',
		icons: [
			{
				src: 'https://futur.eco/icon.svg',
				sizes: 'any',
				type: 'image/svg+xml',
			},
		],
	}
}
