import Emoji from 'Components/Emoji'
import animate from 'Components/ui/animate'
import { Markdown } from 'Components/utils/ClientMarkdown'
import { ASTNode } from 'publicodes'
import { Rule } from 'publicodes/dist/types/rule'
import { useCallback, useEffect, useState } from 'react'
import InfoIcon from '../InfoIcon'
import { Card, LightButton } from '../UI'
import {
	BinaryItem,
	QuestionList,
	RadioLabelStyle,
	Variant,
	VariantLeaf,
} from './QuestionUI'
import { binaryQuestion, InputCommonProps, RuleInputProps } from './RuleInput'

/* Ceci est une saisie de type "radio" : l'utilisateur choisit une réponse dans
	une liste, ou une liste de listes. Les données @choices sont un arbre de type:
	- nom: motif CDD # La racine, unique, qui formera la Question. Ses enfants
	  sont les choix possibles enfants:
	  - nom: motif classique enfants:
	    - nom: motif saisonnier
	    - nom: motif remplacement
	  - nom: motif contrat aidé
	  - nom: motif complément de formation

	A chaque nom est associé une propriété 'données' contenant l'entité complète
	(et donc le titre, le texte d'aide etc.) : ce n'est pas à ce composant (une
	vue) d'aller les chercher.

*/

export type Choice = ASTNode & { nodeKind: 'rule' } & {
	canGiveUp?: boolean
	children: Array<Choice>
}

type QuestionProps = InputCommonProps & {
	choices: Choice | typeof binaryQuestion
}

export default function Question({
	choices,
	dottedName: questionDottedName,
	missing,
	onChange,
	value: currentValue,
}: QuestionProps) {
	const [currentSelection, setCurrentSelection] = useState(
		missing ? null : `'${currentValue}'`
	)
	const handleChange = useCallback(
		(value) => {
			setCurrentSelection(value)
		},
		[setCurrentSelection]
	)
	useEffect(() => {
		if (currentSelection != null) {
			const timeoutId = setTimeout(() => onChange(currentSelection), 300)
			return () => clearTimeout(timeoutId)
		}
	}, [currentSelection])

	const renderBinaryQuestion = (choices: typeof binaryQuestion) => {
		return choices.map(({ value, label }) => (
			<BinaryItem key={value}>
				<RadioLabel
					{...{
						value,
						label,
						currentSelection,
						name: questionDottedName,
						onChange: handleChange,
					}}
				/>
			</BinaryItem>
		))
	}
	const renderChildren = (choices: Choice) => {
		// seront stockées ainsi dans le state :
		// [parent object path]: dotted fieldName relative to parent
		const relativeDottedName = (radioDottedName: string) =>
			radioDottedName.split(questionDottedName + ' . ')[1]
		return (
			<>
				{choices.canGiveUp && (
					<VariantLeaf key="aucun" aucun>
						<RadioLabel
							{...{
								value: 'non',
								label: 'Aucun',
								currentSelection,
								name: questionDottedName,
								dottedName: null,
								onChange: handleChange,
							}}
						/>
					</VariantLeaf>
				)}
				{choices.children &&
					choices.children.map(
						({
							title,
							dottedName,
							rawNode: {
								description,
								icônes,
								références,
								'sous-titre': subtitle,
							},
							children,
						}) =>
							children ? (
								<Variant key={dottedName}>
									<div>{title}</div>
									<ul>{renderChildren({ children } as Choice)}</ul>
								</Variant>
							) : (
								<VariantLeaf key={dottedName}>
									<RadioLabel
										{...{
											value: `'${relativeDottedName(dottedName)}'`,
											label: title,
											dottedName,
											currentSelection,
											name: questionDottedName,
											icônes,
											description,
											subtitle,
											références,
											onChange: handleChange,
										}}
									/>
								</VariantLeaf>
							)
					)}
			</>
		)
	}

	const choiceElements = Array.isArray(choices)
		? renderBinaryQuestion(choices)
		: renderChildren(choices)

	return <QuestionList>{choiceElements}</QuestionList>
}

type RadioLabelProps = RadioLabelContentProps & {
	description?: string
	label?: string
	références?: Rule['références']
	subtitle?: string
}

export const RadioLabel = (props: RadioLabelProps) => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<div>
			<RadioLabelContent {...props} />
			{props.description && (
				<>
					<button
						onClick={() => setIsOpen(!isOpen)}
						css={`
							margin-left: 0.3rem !important;
							vertical-align: middle;
							font-size: 110% !important;
							img {
								width: 2rem;
								height: 2rem;
							}
						`}
						title="Obtenir plus d'infos"
					>
						<InfoIcon />
					</button>
					{isOpen && (
						<animate.appear>
							<Card>
								<h2>{props.label}</h2>
								<Markdown children={props.description} />
								<LightButton onClick={() => setIsOpen(false)}>
									Refermer
								</LightButton>
							</Card>
						</animate.appear>
					)}
				</>
			)}
			{props.subtitle && (
				<p style={{ margin: '.4rem 0 .6rem 0', width: '14rem' }}>
					{props.subtitle}
				</p>
			)}
		</div>
	)
}

type RadioLabelContentProps = {
	value: string
	label: string
	name: string
	currentSelection?: null | string
	icônes?: string
	onChange: RuleInputProps['onChange']
}

function RadioLabelContent({
	value,
	label,
	name,
	currentSelection,
	icônes,
	onChange,
}: RadioLabelContentProps) {
	const labelStyle = value === '_' ? ({ fontWeight: 'bold' } as const) : {}
	const selected = value === currentSelection

	return (
		<RadioLabelStyle
			key={value}
			onDoubleClick={() => {
				console.log(
					'double click submit deactivated for the switch to storing answers in the URL query instead of redux state'
				)
			}}
			style={labelStyle}
			$selected={selected}
		>
			<input
				type="radio"
				name={name}
				value={value}
				onChange={(evt) => onChange(evt.target.value)}
				checked={selected}
			/>
			<span>
				{icônes && <Emoji e={icônes} />}&nbsp;
				{label}
			</span>
		</RadioLabelStyle>
	)
}
