import SimulationVignetteOg from '@/components/SimulationVignetteOg'
import { getSituation } from '@/components/utils/simulationUtils'
import { ImageResponse } from 'next/og'
import Publicodes from 'publicodes'

export const runtime = 'edge'

const getRules = async (dottedName) => {
	if (isVoiture(dottedName)) return voitureRules

	const rulesRequest = await fetch(futurecoRules, { mode: 'cors' }),
		rules = await rulesRequest.json()
	return rules
}
export async function GET(request) {
	const { searchParams } = new URL(request.url)

	const params = Object.fromEntries(searchParams)
	const { dottedName, title, emojis, ...encodedSituation } = params

	const rules = await getRules(dottedName)
	const engine = new Publicodes(rules)

	const validatedSituation = getSituation(encodedSituation, rules)

	return new ImageResponse(
		(
			<SimulationVignetteOg
				{...{
					rules,
					engine,
					situation: validatedSituation,
					title,
					emojis,
					dottedName,
				}}
			/>
		),
		{
			width: 1200,
			height: 630,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'openmoji',
		}
	)
}
