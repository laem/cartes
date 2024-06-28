'use client'
export const dependencies = [
	{ img: '/openstreetmap.svg', text: 'OpenStreetMap' },
	{
		img: '/transport.data.gouv.fr.svg',
		text: 'Transport.data',
	},
	{
		img: '/panoramax.svg',
		text: 'Panoramax',
	},
	{ img: 'https://futur.eco/logo.svg', text: 'Futur.eco' },
	{ img: '/brouter.png', text: 'BRouter' },
	{ img: 'https://motis-project.de/assets/motis2.svg', text: 'Motis' },
	{ img: '/node-gtfs.svg', text: 'Node-GTFS' },
	{ img: '/valhalla.png', text: 'Valhalla' },
	{
		img: 'https://maptiler.fr/img/logos/maptiler-logo-icon.svg',
		text: 'MapTiler',
	},
	{ img: '/ign.png', text: 'IGN' },
	{
		img: 'https://commons.wikimedia.org/static/images/project-logos/commonswiki.png',
		text: 'Wiki Commons',
	},
	{
		img: '/wikipedia.svg',
		text: 'Wikipedia',
	},
	{ img: '/wikidata.svg', text: 'Wikidata' },
	{ img: '/meteo-france.svg', text: 'Météo France' },
	{ img: '/photon.png', text: 'Komoot Photon' },
	{ img: '/three-dots.svg', text: 'Le vôtre ?' },
]

export default function TechDependenciesGallery() {
	return (
		<ul
			css={`
				max-height: 90%;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				padding: 0 5%;
				list-style-type: none;
				gap: 1vw;
				max-width: 72vw;

				li {
					img {
						height: 5vh;
						width: auto;
						display: block;
						object-fit: cover;
					}
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
			`}
		>
			{dependencies.map(({ img: url, text }) => (
				<li key={url}>
					<img src={url} alt={text} />
					<span>{text}</span>
				</li>
			))}
		</ul>
	)
}
