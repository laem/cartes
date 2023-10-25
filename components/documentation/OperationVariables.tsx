import { parseExpression } from 'publicodes'
import { utils } from 'publicodes'
import Link from 'next/link'
import { title as ruleTitle } from 'Components/utils/publicodesUtils'
import { VariableList } from './DocumentationStyle'

const binaryOps = ['+', '-', '*', '/', '>', '<', '>=', '<=', '=', '!=']

const findVariables = (parsed) => {
	if (parsed.variable) return [parsed.variable]
	const isBinaryOp = binaryOps.find((op) => parsed[op])
	if (isBinaryOp)
		return Object.entries(parsed[isBinaryOp]).map(([k, v]) => findVariables(v))
}
const findSimpleOperationToLink = (expression, rules, dottedName) => {
	const parsed = parseExpression(expression)
	console.log('P', JSON.stringify(parsed))

	const variables = findVariables(parsed)
	if (!variables || !Array.isArray(variables)) return null
	// HACK when parsed, publicode rules get the "private" attribute, mostly to "false".
	// But here, we're using disambiguateReference on unparsed rules. Hence we need to set all of them to private: false to avoid throwing errors
	const publicRules = Object.fromEntries(
		Object.entries(rules).map(([k, v]) => [k, { ...v, private: false }])
	)

	console.log('VAR', variables.flat(Infinity))
	const references = variables
		.flat(Infinity)
		.filter((el) => el != null)
		.map((el) => utils.disambiguateReference(publicRules, dottedName, el))
	return references
}

export default function OperationVariables({
	rule,
	rules,
	dottedName,
	pathPrefix,
	searchParams,
}) {
	const isExpression = isExpressionRule(rule)
	if (!isExpression) return null

	const references = findSimpleOperationToLink(isExpression, rules, dottedName)

	if (references == null) return null
	return (
		<VariableList>
			{references.map((el) => (
				<li key={el}>
					<Link
						href={{
							pathname:
								pathPrefix + `/documentation/` + utils.encodeRuleName(el),
							query: searchParams,
						}}
					>
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
