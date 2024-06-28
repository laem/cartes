import { ImageGrid } from '@/components/diapos/Wrapper'

export default function TechDependenciesGallery() {
	return (
		<ImageGrid
			wrap="wrap"
			images={[
				{ img: '/openstreetmap.svg', text: 'OpenStreetMap' },
				{
					img: '/transport.data.gouv.fr.svg',
					text: 'transport.data.gouv.fr',
				},
				{
					img: '/panoramax.svg',
					text: 'Panoramax',
				},
				{
					img: '/wikipedia.svg',
					text: 'Wikipedia',
				},
				{ img: '/wikidata.svg', text: 'Wikidata' },
				{ img: 'https://futur.eco/logo.svg', text: 'Futur.eco' },
				{ img: '/brouter.png', text: 'BRouter' },
				{ img: 'https://motis-project.de/assets/motis2.svg', text: 'Motis' },
				{ img: '/valhalla.png', text: 'Valhalla' },
				{ img: '', text: '' },
				{ img: '', text: '' },
				{ img: '', text: '' },
			]}
		/>
	)
}
