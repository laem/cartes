import { sortBy } from 'ramda'
import { capitalise0 } from '../utils'

export const parentName = (dottedName, outputSeparator = ' . ', shift = 0) =>
	splitName(dottedName).slice(shift, -1).join(outputSeparator)

export const splitName = (dottedName) => dottedName.split(' . ')

export const FullName = ({ dottedName }) => (
	<span>
		{splitName(dottedName).map((fragment, index) => (
			<span>
				{index > 0 && ' > '}
				{capitalise0(fragment)}
			</span>
		))}
	</span>
)

export const title = (rule) =>
	rule.titre ||
	capitalise0(splitName(rule.dottedName)[splitName(rule.dottedName).length - 1])
// Publicodes's % unit is strangely handlded
// the nodeValue is * 100 to account for the unit
// hence we divide it by 100 and drop the unit
export const correctValue = (evaluated) => {
	const { nodeValue, unit } = evaluated

	const result = unit?.numerators.includes('%') ? nodeValue / 100 : nodeValue
	return result
}

export const ruleFormula = (rule) =>
	rule?.explanation?.valeur?.explanation?.valeur

export const ruleSumNode = (rule) => {
	const formula = ruleFormula(rule)

	if (formula.nodeKind !== 'somme') return null
	return formula.explanation.map((node) => node.dottedName)
}

export const extractCategoriesNamespaces = (
	rules,
	engine,
	parentRule = 'bilan'
) => {
	const rule = engine.getRule(parentRule),
		sumNodes = ruleSumNode(rule)

	const categories = sumNodes.map((dottedName) => {
		const categoryName = splitName(dottedName)[0]
		const node = engine.getRule(categoryName)

		const { icônes, couleur } = rules[categoryName]
		return {
			...node,
			icons: icônes,
			color: couleur,
		}
	})

	return categories
}

export const extractCategories = (
	rules,
	engine,
	valuesFromURL,
	parentRule = 'bilan',
	sort = true
) => {
	const rule = engine.getRule(parentRule),
		sumNodes = ruleSumNode(rule)

	const categories = sumNodes.map((dottedName) => {
		const node = engine.evaluate(dottedName)
		const { icônes, couleur } = rules[dottedName]
		return {
			...node,
			icons: icônes,
			color: couleur,
			nodeValue: valuesFromURL ? valuesFromURL[dottedName[0]] : node.nodeValue,
		}
	})

	return sort ? sortCategories(categories) : categories
}

export const sortCategories = sortBy(({ nodeValue }) => -nodeValue)
