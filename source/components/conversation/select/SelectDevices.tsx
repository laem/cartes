import classnames from 'classnames'
import { ThemeColorsContext } from 'Components/utils/colors'
import React, { useCallback, useContext, useState } from 'react'
import { Explicable } from 'Components/conversation/Explicable'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { updateSituation } from 'Actions/actions'
import { Mosaic } from './UI'
import Checkbox from 'Components/ui/Checkbox'

export const questionText = 'Quels appareils numériques possédez-vous ?'
export const isApplicableQuestion = (dottedName) =>
	dottedName.includes('numérique') && dottedName.includes(' . présent')

export default function SelectWeeklyDiet({
	name,
	setFormValue,
	selectedRules,
	value: currentValue,
	question,
}) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	console.log({ selectedRules })

	const choiceElements = (
		<div>
			<Mosaic>
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
							<li
								className="ui__ card interactive"
								key={name}
								onMouseDown={() =>
									selectedRules.map(
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
														? value == 'oui'
															? 'non'
															: 'oui'
														: situation[dottedName] == null
														? defaultValue
														: situation[dottedName]
												)
											)
									)
								}
							>
								<h4>{title}</h4>
								{icônes && <div css="font-size: 150%">{emoji(icônes)}</div>}
								{false && description && <p>{description.split('\n')[0]}</p>}
								<div css={'font-size: 1.8rem'}>
									<Checkbox
										name={name}
										id={name}
										checked={value === 'oui'}
										readOnly
									/>
								</div>
							</li>
						)
					}
				)}
			</Mosaic>
		</div>
	)

	return (
		<div css="margin-top: 0.6rem; display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end">
			{choiceElements}
		</div>
	)
}
