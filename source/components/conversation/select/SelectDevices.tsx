import classnames from 'classnames'
import { ThemeColorsContext } from 'Components/utils/colors'
import React, { useCallback, useContext, useState } from 'react'
import { Explicable } from 'Components/conversation/Explicable'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { updateSituation } from 'Actions/actions'

export const questionText = 'Vos appareils ! '
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
								{icônes && <div>{emoji(icônes)}</div>}
								{description && <p>{description.split('\n')[0]}</p>}
								<div css={' span {margin: .8rem; font-size: 120%}'}>
									<input
										type="checkbox"
										id="scales"
										name="scales"
										checked={situationValue}
									/>
									<label for="scales">{name}</label>
								</div>
							</li>
						)
					}
				)}
			</ul>
		</div>
	)

	return (
		<div css="margin-top: 0.6rem; display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end">
			{choiceElements}
		</div>
	)
}
