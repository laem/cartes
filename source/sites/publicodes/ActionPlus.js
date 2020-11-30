import React from 'react'
import {Markdown} from 'Components/utils/markdown'
import {useParams} from 'react-router'
import {flatRulesSelector} from 'Selectors/analyseSelectors'
import {useSelector} from 'react-redux'
import {findRuleByDottedName} from 'Engine/rules'


export default () => {

	const {encodedName} = useParams()
	const rules = useSelector(flatRulesSelector)
	console.log(rules)
	const rule = findRuleByDottedName(rules, 'transport . éco-conduite')

	if (!rule) return <div>OUPS</div>


	return (

		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<h1>{rule.title}</h1>
			<div css="margin: 1.6rem 0">
				<Markdown source={rule.description} />
			</div>

		</div>
	)
}
