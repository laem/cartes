import { Markdown } from 'Components/utils/ClientMarkdown'
import AvionExplanation from './AvionExplanation'

const ADEMELogoURL =
	'https://www.ademe.fr/wp-content/uploads/2021/12/logo-ademe.svg'

const CustomSimulateurEnding = ({ dottedName, rule, engine }) => {
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
			<Markdown children={rule.description}></Markdown>
			{dottedName === 'transport . avion . impact' && (
				<AvionExplanation engine={engine} />
			)}
			{dottedName === 'voyage . trajet voiture . coût trajet par personne' && (
				<div>Salut</div>
			)}
		</div>
	)
}

export default CustomSimulateurEnding
