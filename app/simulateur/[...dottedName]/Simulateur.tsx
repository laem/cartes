import { questionEcoDimensions } from 'Components/questionEcoDimensions'
import { parentName } from 'Components/utils/publicodesUtils'
import getQuestionsConfig from './configBuilder'
import SimulateurContent from './SimulateurContent'

const Simulateur = ({ dottedName, rules, searchParams }) => {
	if (!rules) return 'Les règles ne sont pas chargées'
	const decodedRule = rules[dottedName]

	if (!decodedRule) return 'Règle non trouvée'

	const objectives =
		decodedRule.exposé?.type === 'question éco'
			? questionEcoDimensions.map(
					(dimension) => parentName(dottedName) + ' . ' + dimension
			  )
			: [dottedName]

	const config = {
		objectifs: objectives,
		questions: getQuestionsConfig(dottedName),
	}

	return <SimulateurContent {...{ objectives, rules, config, searchParams }} />
}

export default Simulateur
