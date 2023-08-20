import { Markdown } from 'Components/utils/markdown'
import { ASTNode } from 'publicodes'
import { Rule } from 'publicodes/dist/types/rule'
import { useCallback, useEffect, useState } from 'react'
import { Explicable } from './Explicable'
import { binaryQuestion, InputCommonProps, RuleInputProps } from './RuleInput'
import animate from 'Components/ui/animate'
import Emoji from 'Components/Emoji'
import { Button, Card } from '../UI'
import { BinaryItem, QuestionList, Variant, VariantLeaf } from './QuestionUI'

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
	onSubmit: (source: string) => void
	choices: Choice | typeof binaryQuestion
}

export default function Question({
	choices,
	onSubmit,
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
	const handleSubmit = useCallback(
		(src, value) => {
			setCurrentSelection(value)
			onChange(value)
			onSubmit(src)
		},
		[onSubmit, onChange, setCurrentSelection]
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
						onSubmit: handleSubmit,
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
			<QuestionList>
				{choices.canGiveUp && (
					<VariantLeaf key="aucun" aucun>
						<RadioLabel
							{...{
								value: 'non',
								label: 'Aucun',
								currentSelection,
								name: questionDottedName,
								onSubmit: handleSubmit,
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
							rawNode: { description, icônes, références },
							children,
						}) =>
							children ? (
								<Variant key={dottedName}>
									<div>{title}</div>
									{renderChildren({ children } as Choice)}
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
											onSubmit: handleSubmit,
											description,
											références,
											onChange: handleChange,
										}}
									/>
								</VariantLeaf>
							)
					)}
			</QuestionList>
		)
	}

	const choiceElements = Array.isArray(choices)
		? renderBinaryQuestion(choices)
		: renderChildren(choices)

	return <div>{choiceElements}</div>
}

type RadioLabelProps = RadioLabelContentProps & {
	description?: string
	label?: string
	références?: Rule['références']
}

export const RadioLabel = (props: RadioLabelProps) => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<div>
			<RadioLabelContent {...props} />
			{props.description && (
				<>
					<Button
						onClick={() => setIsOpen(!isOpen)}
						css={`
							margin-left: 0.3rem !important;
							vertical-align: middle;
							font-size: 110% !important;
						`}
					>
						<Emoji e={'ℹ️'} />
					</Button>
					{isOpen && (
						<animate.appear>
							<Card>
								<h2>{props.label}</h2>
								<Markdown children={props.description} />
							</Card>
						</animate.appear>
					)}
				</>
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
	onSubmit: (src: string, value: string) => void
}

function RadioLabelContent({
	value,
	label,
	name,
	currentSelection,
	icônes,
	onChange,
	onSubmit,
}: RadioLabelContentProps) {
	const labelStyle = value === '_' ? ({ fontWeight: 'bold' } as const) : {}
	const selected = value === currentSelection

	return (
		<label
			key={value}
			onDoubleClick={() => {
				onSubmit('dblClick', value)
			}}
			style={labelStyle}
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
		</label>
	)
}
