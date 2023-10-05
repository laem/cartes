import rules from '@/app/voyage/data/rules'
import { ImageResponse } from '@vercel/og'
import Publicodes, { formatValue } from 'publicodes'
import convert from '@/components/css/convertToJs'
import pubs from '@/app/voyage/pubs.yaml'

export const config = {
	runtime: 'edge',
}

const engine = new Publicodes(rules)
const target = 'trajet voiture . coût trajet par personne'

async function handler(req) {
	const { searchParams } = new URL(req.url)
	const titre = searchParams.get('titre')
	const image = searchParams.get('image')
	const situation = JSON.parse(
		decodeURIComponent(searchParams.get('situation'))
	)

	/* error fetch
	const imagesArray = await Promise.all(
			pubs.map(
				({ image }) =>
					new Promise((resolve) => {
						const url = new URL(
							'../../public/voiture/' + image,
							import.meta.url
						)
						console.log('URL', url)
						fetch(url).then((res) => resolve([image, res.arrayBuffer()]))
					})
			)
		),
		images = Object.fromEntries(imagesArray)
		*/

	console.log('SITUATION', situation)

	const newSituation = {
		...situation,
		'trajet voiture . distance': 'voiture . distance totale',
	}
	const newEngine = engine.setSituation(newSituation),
		total = formatValue(newEngine.evaluate(target), {
			precision: 0,
			displayedUnit: '€',
		}),
		lifeTime = newEngine.evaluate('voiture . durée de vie').nodeValue
	const distance = newEngine.evaluate('trajet voiture . distance').nodeValue
	const perKm = formatValue(
		newEngine
			.setSituation({
				...newSituation,
				'trajet voiture . distance': 1,
			})
			.evaluate(target),
		{ precision: 2, displayedUnit: '€ / km' }
	)
	const isElec = situation['voiture . motorisation']?.includes('électrique')

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 100,
					color: 'black',
					width: '100%',
					height: '100%',
					textAlign: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					background: 'white',
				}}
			>
				<img
					src={
						(process.env.NEXT_PUBLIC_NODE_ENV === 'development'
							? 'http://localhost:3000'
							: 'https://' + process.env.VERCEL_URL) +
						'/voiture/' +
						image
					}
					width="1024"
					height="683"
					style={{ position: 'absolute', top: 0, left: 0 }}
				/>

				<div
					style={convert(`
						position: absolute;
						right: .6rem;
						bottom: .4rem;
						display: flex;
						width: 6rem;
						flexDirection: column;
						align-items: center

`)}
				>
					<img src="https://futur.eco/logo.svg" />

					<span
						style={convert(
							`font-size: 20px; font-weight: bold; color: white; background: #185abd; padding: 0 .2rem 0 .4rem; text-align: center; `
						)}
					>
						futur.eco
					</span>
				</div>
				<h1
					style={convert(`
						font-size: 100;
						top: 0; right: 2rem;
						margin: 0;
						position: absolute;
						${gradientText}
`)}
				>
					{titre}
				</h1>
				<p
					style={convert(`
						font-size: 30;
						top: 6rem; right: 2rem;
						position: absolute;
						${gradientText}
`)}
				>
					Accessible dès
				</p>
				<p
					style={convert(`
						font-size: 80;
						top: 14rem; right: 2rem;
						margin: 0;
						position: absolute;
						${gradientText}
`)}
				>
					{total}
				</p>
				<p
					style={convert(`
						font-size: 30;
						top: 20rem; right: 2rem;
						margin: 0;
						position: absolute;
						${gradientText}
`)}
				>
					sur {lifeTime} ans
				</p>
				<div
					style={convert(`

	background: #ffffff90;
						display: flex;
						font-size: 45;
						top: 24rem; right: 2rem;
						margin: 0;
						padding: 0.1rem .6rem;
						position: absolute;
						border: 2px solid #185abd
						`)}
				>
					<span
						style={convert(`
						${gradientText}
`)}
					>
						Soit {perKm}
					</span>
				</div>

				<div
					style={convert(`
						background: #ffffff90;
						display: flex;
						font-size: 30;
						top: 31rem; right: 1rem;
						margin: 0;
						padding: 0.1rem .6rem;
						position: absolute;
						font-size: 13;
						width: 26rem;
						text-align: right
						`)}
				>
					{isElec ? 'Électricité' : 'Carburant'}, péages, achat, parking,
					assurance, entretien, lavage, équipements, accidents, infractions,
					carte grise
					{isElec ? ', et bonus écologique inclus.' : '.'}
				</div>

				{false && <div style={{ fontSize: 250 }}>{emojis}</div>}
			</div>
		),
		{
			width: 1024,
			height: 683,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent', 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'openmoji',
		}
	)
}

const gradientText = `
		background-image:linear-gradient(90deg, #185abd, #2988e6, #57bff5);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent

`

export default handler
