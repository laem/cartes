import { parseExpression } from 'publicodes'
import { utils } from 'publicodes'
import Link from 'next/link'
import { title as ruleTitle } from 'Components/utils/publicodesUtils'
import { VariableList } from './DocumentationStyle'

const findSimpleOperationToLink = (expression, rules, dottedName) => {
	const parsed = parseExpression(expression)
	console.log('P', parsed)
	const operation = parsed.variable
		? [null, [{ variable: parsed.variable }]] // artificially create the shape of an operation (e.g. *) with a single element
		: Object.entries(parsed).find(
				([k, v]) => Array.isArray(v) && v.some((el) => el.variable != null)
		  )
	if (!operation) return null
	const [key, value] = operation

	// HACK when parsed, publicode rules get the "private" attribute, mostly to "false".
	// But here, we're using disambiguateReference on unparsed rules. Hence we need to set all of them to private: false to avoid throwing errors
	const publicRules = Object.fromEntries(
		Object.entries(rules).map(([k, v]) => [k, { ...v, private: false }])
	)

	const references = value
		.filter((el) => el.variable != null)
		.map((el) =>
			utils.disambiguateReference(publicRules, dottedName, el.variable)
		)
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
