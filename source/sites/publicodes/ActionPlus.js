import React from 'react'
import { Markdown } from 'Components/utils/markdown'
import { useParams } from 'react-router'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { useSelector } from 'react-redux'
import { findRuleByDottedName, decodeRuleName } from 'Engine/rules'
import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'

export default () => {
	const { encodedName } = useParams()
	const rules = useSelector(flatRulesSelector)
	const dottedName = decodeRuleName(encodedName)
	const rule = findRuleByDottedName(rules, dottedName)

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<Link to={'/actions/' + encodedName}>
				<button className="ui__ button simple small ">
					{emoji('◀')} Retour à la fiche
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
