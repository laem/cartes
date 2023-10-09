'use client'

import Input from 'Components/conversation/Input'
import Question, { Choice } from 'Components/conversation/Question'
import ToggleSwitch from 'Components/ui/ToggleSwitch'
import { parentName } from 'Components/utils/publicodesUtils'
import dynamic from 'next/dynamic'
import { ASTNode, EvaluatedRule, reduceAST, utils } from 'publicodes'
import { Evaluation } from 'publicodes/dist/types/AST/types'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import {
	airportsQuestions,
	ferryQuestions,
	voyageQuestions,
} from './customQuestions/voyageInput'
import { isMosaic } from './mosaicQuestions'
import TravelTimeSpanInput from './TravelTimeSpanInput'

const VoyageInput = dynamic(
	() => import('Components/conversation/VoyageInput'),

	{
		loading: () => <p>Chargement des aéroports...</p>,
	}
)

type Value = any
export type RuleInputProps<Name extends string = DottedName> = {
	dottedName: Name
	onChange: (value: Value | null) => void
	useSwitch?: boolean
	isTarget?: boolean
	autoFocus?: boolean
	id?: string
	className?: string
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
	engine,
	noSuggestions = false,
	updateSituation,
}: RuleInputProps<Name>) {
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate(dottedName)
	const rules = engine.getParsedRules()

	const language = useTranslation().i18n.language
	const value = evaluation.nodeValue

	const commonProps: InputCommonProps<Name> = {
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
		updateSituation,
	}

	if (isMosaic(rule.dottedName)) {
		// This selects a precise set of questions to bypass their regular components and answer all of them in one big custom UI
		const question = isMosaic(rule.dottedName)
		const selectedRules = Object.entries(rules)
			.filter(([dottedName]) => question.isApplicable(dottedName))
			.map(([dottedName, questionRule]) => {
				const parentRule = parentName(dottedName)
				return [rules[parentRule], questionRule]
			})

		return (
			<question.component
				key={dottedName}
				{...{
					...commonProps,
					selectedRules,
					options: question.options || {},
				}}
			/>
		)
	}

	if (getVariant(engine.getRule(dottedName))) {
		return (
			<Question
				key={dottedName}
				{...commonProps}
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

	if (airportsQuestions.includes(rule.dottedName)) {
		return (
			<Suspense fallback={<div>Chargement des aéroports ...</div>}>
				<VoyageInput
					key={dottedName}
					{...{
						...commonProps,
						placeholder: 'Aéroport ou ville ',
						db: 'airports',
						rulesPath: 'transport . avion',
						fromIcon: '🛫',
						toIcon: '🛬',
						displayImage: 'plane',
						orthodromic: true,
					}}
				/>
			</Suspense>
		)
	}

	if (ferryQuestions.includes(rule.dottedName)) {
		return (
			<Suspense fallback={<div>Chargement du globe ...</div>}>
				<VoyageInput
					key={dottedName}
					{...{
						...commonProps,
						placeholder: 'Port ou ville',
						db: 'osm',
						rulesPath: 'transport . ferry',
						displayImage: 'boat',
						orthodromic: true,
					}}
				/>
			</Suspense>
		)
	}

	if (voyageQuestions.includes(rule.dottedName)) {
		return (
			<Suspense fallback={<div>Chargement du globe ...</div>}>
				<VoyageInput
					key={dottedName}
					{...{
						...commonProps,
						placeholder: 'Ville',
						db: 'osm',
						rulesPath: 'trajet voiture',
						displayImage: true,
					}}
				/>
			</Suspense>
		)
	}

	if (rule.dottedName === 'transport . ferry . durée du voyage')
		return (
			<TravelTimeSpanInput
				key={dottedName}
				{...commonProps}
				value={commonProps.value}
				onChange={commonProps.onChange}
				suggestions={commonProps.suggestions}
			/>
		)

	/*
		 * TODO deactivated for the nextjs migration
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
	*/

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
				key={dottedName}
				{...commonProps}
				choices={[
					{ value: 'oui', label: 'Oui' },
					{ value: 'non', label: 'Non' },
				]}
			/>
		)
	}

	/*
	 *
		 * TODO deactivated for the nextjs migration
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
	*/

	return (
		<Input
			key={dottedName}
			{...commonProps}
			unit={evaluation.unit}
			value={value as Evaluation<number>}
			noSuggestions={noSuggestions}
			inputEstimation={
				rule.rawNode.aide &&
				rules[
					utils.disambiguateReference(rules, rule.dottedName, rule.rawNode.aide)
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
					children: (
						variant.explanation as (ASTNode & {
							nodeKind: 'reference'
						})[]
					).map(({ dottedName }) =>
						buildVariantTree(engine, dottedName as Name)
					),
			  }
			: null
	) as Choice
}
