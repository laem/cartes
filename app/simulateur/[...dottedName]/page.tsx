import { getRules } from '@/providers/getRules'
import { utils } from 'publicodes'
import Simulateur from './Simulateur'

const Page = async ({ params: { dottedName } }) => {
	const rawObjective = dottedName.join('/'),
		decoded = utils.decodeRuleName(rawObjective)

	const ruleSet = rawObjective === 'bilan' ? 'NGC' : 'futureco'
	const rules = await getRules(ruleSet)

	return (
		<main>
			<Simulateur dottedName={decoded} rules={rules} />
		</main>
	)
}

export default Page
