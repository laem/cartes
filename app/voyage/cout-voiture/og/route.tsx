import { getSituation } from '@/components/utils/simulationUtils'
import { ImageResponse } from 'next/server'
import Publicodes from 'publicodes'
import coutRules from '@/app/voyage/cout-voiture/data/rules'

const futurecoRules = 'https://futureco-data.netlify.app/co2.json'

export const runtime = 'edge'

export async function GET(request) {
	console.log('SALUT')
	const rulesRequest = await fetch(futurecoRules, { mode: 'cors' }),
		rules = await rulesRequest.json()

	const engine = new Publicodes(rules)
	const { searchParams } = new URL(request.url)

	const params = Object.fromEntries(searchParams)
	const { dottedName, title, emojis, ...encodedSituation } = params
	const validatedSituation = getSituation(encodedSituation, rules)
	console.log(title, emojis, validatedSituation)
	const value = engine
		.setSituation(validatedSituation)
		.evaluate(dottedName).nodeValue

	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					height: '100%',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
					fontSize: 60,
					letterSpacing: -2,
					fontWeight: 700,
					textAlign: 'center',
				}}
			>
				{value}
				<div
					style={{
						backgroundImage:
							'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					Develop
				</div>
				<div
					style={{
						backgroundImage:
							'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					Preview
				</div>
				<div
					style={{
						backgroundImage:
							'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					Ship
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'twemoji',
		}
	)
}
