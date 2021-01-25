import Input from 'Components/conversation/Input'
import Question, { Choice } from 'Components/conversation/Question'
import CurrencyInput from 'Components/CurrencyInput/CurrencyInput'
import PercentageField from 'Components/PercentageField'
import ToggleSwitch from 'Components/ui/ToggleSwitch'
import { EngineContext } from 'Components/utils/EngineContext'
import {
	ASTNode,
	EvaluatedRule,
	formatValue,
	ParsedRules,
	reduceAST,
	utils,
} from 'publicodes'
import { Evaluation } from 'publicodes/dist/types/AST/types'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { DottedName } from 'modele-social'
import DateInput from './DateInput'
import ParagrapheInput from './ParagrapheInput'
import SelectWeeklyDiet from './select/SelectWeeklyDiet'
import TextInput from './TextInput'
import { useSelector } from 'react-redux'
import { parentName } from 'Components/publicodesUtils'
import { weeklyDietQuestion } from './select/SelectWeeklyDiet'

type Value = any
export type RuleInputProps<Name extends string = DottedName> = {
	dottedName: Name
	onChange: (value: Value | null) => void
	useSwitch?: boolean
	isTarget?: boolean
	autoFocus?: boolean
	id?: string
	className?: string
	onSubmit?: (source: string) => void
}

export type InputCommonProps<Name extends string = string> = Pick<
	RuleInputProps<Name>,
	'dottedName' | 'onChange' | 'autoFocus' | 'className'
> &
	Pick<EvaluatedRule<Name>, 'title' | 'question' | 'suggestions'> & {
		key: string
		id: string
		value: any //TODO EvaluatedRule['nodeValue']
		missing: boolean
		required: boolean
	}

export const binaryQuestion = [
	{ value: 'oui', label: 'Oui' },
	{ value: 'non', label: 'Non' },
] as const

// This function takes the unknown rule and finds which React component should
// be displayed to get a user input through successive if statements
// That's not great, but we won't invest more time until we have more diverse
// input components and a better type system.
export default function RuleInput<Name extends string = DottedName>({
	dottedName,
	onChange,
	useSwitch = false,
	id,
	isTarget = false,
	autoFocus = false,
	className,
	onSubmit = () => null,
}: RuleInputProps<Name>) {
	const engine = useContext(EngineContext)
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate(dottedName)
	const rules = engine.getParsedRules()

	const language = useTranslation().i18n.language
	const value = evaluation.nodeValue

	const commonProps: InputCommonProps<Name> = {
		key: dottedName,
		dottedName,
		value,
		missing: !!evaluation.missingVariables[dottedName],
		onChange,
		autoFocus,
		className,
		title: rule.title,
		id: id ?? dottedName,
		question: rule.rawNode.question,
		suggestions: rule.suggestions,
		required: true,
	}

	if (weeklyDietQuestion(rule.dottedName)) {
		// This selected a precise set of questions to bypass their regular components and answer all of them in one big custom UI
		const dietRules = Object.entries(rules)
			.filter(([dottedName]) => weeklyDietQuestion(dottedName))
			.map(([dottedName, questionRule]) => {
				const parentRule = parentName(dottedName)
				return [rules[parentRule], questionRule]
			})

		return (
			<SelectWeeklyDiet
				{...{
					...commonProps,
					dietRules,
				}}
			/>
		)
	}

	if (getVariant(engine.getRule(dottedName))) {
		return (
			<Question
				{...commonProps}
				onSubmit={onSubmit}
				choices={buildVariantTree(engine, dottedName)}
			/>
		)
	}
	/* These input are specific to mon-entreprise, but could be useful for us. Disactivated to prune dependencies
*
*
	if (rule.API && rule.API === 'commune')
		return <SelectCommune {...commonProps} />
	if (rule.API && rule.API === 'pays européen')
		return <SelectEuropeCountry {...commonProps} />
	if (rule.API) throw new Error("Les seules API implémentées sont 'commune'")

	if (rule.dottedName == 'contrat salarié . ATMP . taux collectif ATMP')

	return <SelectAtmp {...commonProps} onSubmit={onSubmit} />
*
*/

	if (rule.rawNode.type === 'date') {
		return (
			<DateInput
				{...commonProps}
				value={commonProps.value}
				onChange={commonProps.onChange}
				onSubmit={onSubmit}
				suggestions={commonProps.suggestions}
			/>
		)
	}

	if (
		evaluation.unit == null &&
		(rule.rawNode.type === 'booléen' || rule.rawNode.type == undefined) &&
		typeof evaluation.nodeValue !== 'number'
	) {
		return useSwitch ? (
			<ToggleSwitch
				defaultChecked={value === true}
				onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
					onChange(evt.target.checked ? 'oui' : 'non')
				}
			/>
		) : (
			<Question
				{...commonProps}
				choices={[
					{ value: 'oui', label: 'Oui' },
					{ value: 'non', label: 'Non' },
				]}
				onSubmit={onSubmit}
			/>
		)
	}

	if (evaluation.unit?.numerators.includes('€') && isTarget) {
		const unité = formatValue(
			{ nodeValue: value ?? 0, unit: evaluation.unit },
			{ language }
		)
			.replace(/[\d,.]/g, '')
			.trim()
		return (
			<>
				<CurrencyInput
					{...commonProps}
					language={language}
					debounce={750}
					value={value as string}
					name={dottedName}
					className="targetInput"
					onChange={(evt) => onChange({ valeur: evt.target.value, unité })}
				/>
			</>
		)
	}
	if (evaluation.unit?.numerators.includes('%') && isTarget) {
		return <PercentageField {...commonProps} debounce={600} />
	}
	if (rule.rawNode.type === 'texte') {
		return <TextInput {...commonProps} value={value as Evaluation<string>} />
	}
	if (rule.rawNode.type === 'paragraphe') {
		return (
			<ParagrapheInput {...commonProps} value={value as Evaluation<string>} />
		)
	}

	console.log(rule, evaluation)

	return (
		<Input
			{...commonProps}
			onSubmit={onSubmit}
			unit={evaluation.unit}
			value={value as Evaluation<number>}
			inputEstimation={
				rule.rawNode.aide &&
				rules[
					utils.disambiguateRuleReference(
						rules,
						rule.dottedName,
						rule.rawNode.aide
					)
				]
			}
		/>
	)
}

const getVariant = (node: RuleNode) =>
	reduceAST<false | (ASTNode & { nodeKind: 'une possibilité' })>(
		(_, node) => {
			if (node.nodeKind === 'une possibilité') {
				return node
			}
		},
		false,
		node
	)

export const buildVariantTree = <Name extends string>(
	engine: Engine<Name>,
	path: Name
): Choice => {
	const node = engine.getRule(path)
	if (!node) throw new Error(`La règle ${path} est introuvable`)
	const variant = getVariant(node)
	const canGiveUp =
		variant &&
		(!variant['choix obligatoire'] || variant['choix obligatoire'] === 'non')
	return Object.assign(
		node,
		variant
			? {
					canGiveUp,
					children: (variant.explanation as (ASTNode & {
						nodeKind: 'reference'
					})[]).map(({ dottedName }) =>
						buildVariantTree(engine, dottedName as Name)
					),
			  }
			: null
	) as Choice
}
