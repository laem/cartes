import rules from '@/app/voyage/data/rules'
import { ImageResponse } from '@vercel/og'
import Publicodes, { formatValue } from 'publicodes'

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
					padding: '30px',
					textAlign: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					background: 'white',
				}}
			>
				<img src="https://futur.eco/logo.svg" style={{ width: '8rem' }} />
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
			width: 1200,
			height: 750,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent', 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'openmoji',
		}
	)
}

export default handler
