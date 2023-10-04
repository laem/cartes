import rules from '@/app/voyage/data/rules'
import { ImageResponse } from '@vercel/og'
import Publicodes, { formatValue } from 'publicodes'
import convertRaw from '@/components/css/convertToJs'

const convert = (css) => convertRaw(`div {${css}}`).div

export const config = {
	runtime: 'edge',
}

const engine = new Publicodes(rules)
const target = 'trajet voiture . coût trajet par personne'
function handler(req) {
	const { searchParams } = new URL(req.url)
	const titre = searchParams.get('titre')
	const image = searchParams.get('image')
	const situation = JSON.parse('{}' || searchParams.get('situation'))

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
					src={'http://localhost:3000/voiture/' + image}
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
							`font-size: 20px; dispay: block; font-weight: bold; color: #185abd; background: white; padding: 0 .4rem`
						)}
					>
						futur.eco
					</span>
				</div>
				<h1
					style={{
						fontSize: 100,
						margin: '10px 0 0 0 ',
						padding: 0,
						lineHeight: '6rem',
						backgroundImage:
							'linear-gradient(90deg, #185abd, #2988e6, #57bff5)',

						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					{titre}
				</h1>
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

export default handler
