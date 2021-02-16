import classnames from 'classnames'
import { ThemeColorsContext } from 'Components/utils/colors'
import React, { useCallback, useContext, useState } from 'react'
import { Explicable } from 'Components/conversation/Explicable'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { updateSituation } from 'Actions/actions'

export const weeklyDietQuestionText =
	'Choisissez les plats de vos midis et dîners pour une semaine type'

export const isApplicableQuestion = (dottedName) =>
	dottedName.includes('alimentation . plats') &&
	dottedName.includes(' . nombre')
// This is the number of possible answers in this very custom input component
const chipsTotal = 14

export default function SelectWeeklyDiet({
	name,
	setFormValue,
	selectedRules,
	value: currentValue,
	question,
}) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)

	const chipsCount = selectedRule.reduce(
		(
			memo,
			[
				_,
				{
					dottedName,
					rawNode: { 'par défaut': defaultValue },
				},
			]
		) =>
			memo +
			(situation[dottedName] != undefined
				? situation[dottedName]
				: defaultValue),
		0
	)

	const choiceElements = (
		<div>
			<ul
				css={`
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					p {
						text-align: center;
					}

					> li > div > img {
						margin-right: 0.4rem !important;
						font-size: 130% !important;
					}

					> li {
						width: 14rem;
						margin: 1rem;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						padding-bottom: 1rem;
					}

					> li h4 {
						margin: 0;
					}
					> li p {
						font-style: italic;
						font-size: 85%;
						line-height: 1.2rem;
					}
				`}
			>
				{selectedRules.map(
					([
						{
							name,
							title,
							rawNode: { description, icônes },
						},
						question,
					]) => {
						const situationValue = situation[question.dottedName],
							value =
								situationValue != null
									? situationValue
									: question.rawNode['par défaut']
						return (
							<li className="ui__ card" key={name}>
								<h4>{title}</h4>
								<div>{emoji(icônes)}</div>
								<p>{description.split('\n')[0]}</p>
								<div css={' span {margin: .8rem; font-size: 120%}'}>
									<button
										className={`ui__ button small plain ${
											!value ? 'disabled' : ''
										}`}
										onClick={() =>
											value > 0 &&
											// HACK
											// This is a custom piece of code to counter the fact that the validation button visibility is handled by conversation.tsx
											// if you hit - on 'viande 1', all the other inputs will be set, hence the validation button made visible since `currentQuestionIsAnswered` in conversation.tsx
											// TODO should be rewritter as this component gets generic, used by other variables
											// note : we don't need to write this dietRules.map in the (+) button, since you can't + a variable without - another one ;)
											dietRules.map(
												([
													_,
													{
														dottedName,
														rawNode: { 'par défaut': defaultValue },
													},
												]) =>
													dispatch(
														updateSituation(
															dottedName,
															question.dottedName === dottedName
																? value - 1
																: situation[dottedName] == null
																? defaultValue
																: situation[dottedName]
														)
													)
											)
										}
									>
										-
									</button>
									<span>{value}</span>
									<button
										className="ui__ button small plain"
										onClick={() =>
											dispatch(updateSituation(question.dottedName, value + 1))
										}
									>
										+
									</button>
								</div>
							</li>
						)
					}
				)}
			</ul>
			<div css="p {text-align: center}">
				{chipsCount > chipsTotal ? (
					<p css="text-decoration: underline; text-decoration-color: red;   text-decoration-thickness: 0.2rem;">
						Vous avez fait {chipsCount - chipsTotal} choix en trop !
					</p>
				) : chipsCount === chipsTotal ? (
					<p>{emoji('😋👍')}</p>
				) : (
					<p css="text-decoration: underline; text-decoration-color: yellow; text-decoration-thickness: 0.2rem;">
						Il vous reste {chipsTotal - chipsCount} choix à faire.
					</p>
				)}
			</div>
		</div>
	)

	return (
		<div css="margin-top: 0.6rem; display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end">
			{choiceElements}
		</div>
	)
}
