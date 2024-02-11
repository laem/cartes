import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Cartes',
		short_name: 'Cartes',
		description:
			'Une application de cartes pour découvrir les lieux autour de nous et voyager.',
		start_url: '/voyage',
		display: 'fullscreen',
		background_color: '#fff',
		theme_color: '#2988e6',
		icons: [
			{
				src: 'https://cartes.app/voyage.svg',
				sizes: '48x48 72x72 96x96 128x128 256x256',
				type: 'image/svg+xml',
				purpose: 'any',
			},
			{
				src: 'https://cartes.app/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
			},
		],
	}
}
