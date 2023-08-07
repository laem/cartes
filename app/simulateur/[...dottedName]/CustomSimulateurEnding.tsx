import { Markdown } from 'Components/utils/markdown'
import AvionExplanation from 'Components/AvionExplanation'
import { capitalise0 } from 'publicodes'

const ADEMELogoURL =
	'https://www.ademe.fr/wp-content/uploads/2021/12/logo-ademe.svg'

export default ({ dottedName, rule }) => {
	const ref = rule.références,
		baseCarbone = ref?.find((el) => el.includes('bilans-ges.ademe.fr'))
	return (
		<div css="margin: 1rem 0">
			{baseCarbone && (
				<div css="img {vertical-align: middle}">
					Une donnée{' '}
					<img css="height: 2rem; margin-right: .2rem" src={ADEMELogoURL} />
					<a href="https://bilans-ges.ademe.fr"> base carbone ADEME</a>
				</div>
			)}
			<Markdown>{capitalise0(rule.description)}</Markdown>
			{dottedName === 'transport . avion . impact' && <AvionExplanation />}
		</div>
	)
}
