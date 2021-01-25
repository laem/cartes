import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

export default () => {
	const { encodedName } = useParams()
	const rules = useSelector((state) => state.rules)
	const dottedName = utils.decodeRuleName(encodedName)
	const rule = rules[dottedName]

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<ScrollToTop />
			<div>
				<Link to={'/actions/' + encodedName}>
					<button className="ui__ button simple small ">
						{emoji('◀')} Retour à la liste des fiches
					</button>
				</Link>
			</div>
			<Link to={'/actions/' + encodedName}>
				<button className="ui__ button simple small ">
					{emoji('🧮')} Voir le geste climat correspondant
				</button>
			</Link>
			<div css="margin: 1.6rem 0">
				<Markdown
					source={rule.plus || "Cette fiche détaillée n'existe pas encore"}
				/>
			</div>
		</div>
	)
}
