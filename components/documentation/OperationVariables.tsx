import { parseExpression } from 'publicodes'
import { utils } from 'publicodes'
import Link from 'next/link'
import { title as ruleTitle } from 'Components/utils/publicodesUtils'
import { VariableList } from './DocumentationStyle'

const findSimpleOperationToLink = (expression, rules, dottedName) => {
	const parsed = parseExpression(expression)
	console.log('P', parsed)
	const operation = Object.entries(parsed).find(
		([k, v]) => v.length === 2 && v.some((el) => el.variable != null)
	)
	if (!operation) return null
	const [key, value] = operation

	const references = value
		.filter((el) => el.variable != null)
		.map((el) => utils.disambiguateReference(rules, dottedName, el.variable))
	return references
}
export default function OperationVariables({ rule, rules, dottedName }) {
	const isExpression = isExpressionRule(rule)
	if (!isExpression) return null

	const references = findSimpleOperationToLink(isExpression, rules, dottedName)

	if (references == null) return null
	return (
		<VariableList>
			{references.map((el) => (
				<li key={el}>
					<Link href={`/documentation/` + utils.encodeRuleName(el)}>
						{ruleTitle({ dottedName: el, ...rules[el] })}
					</Link>
				</li>
			))}
		</VariableList>
	)
}

export const isExpressionRule = (rule) => {
	if (typeof rule === 'string') return rule
	if (typeof rule.formule === 'string') return rule.formule
	return null
}
