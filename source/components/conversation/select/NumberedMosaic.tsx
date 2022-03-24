import { updateSituation } from 'Actions/actions'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { useEngine } from '../../utils/EngineContext'
import { Mosaic } from './UI'

export default function NumberedMosaic({
	name,
	setFormValue,
	selectedRules,
	value: currentValue,
	question,
	options: { chipsTotal },
}) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	const engine = useEngine()

	const chipsCount = selectedRules.reduce((memo, [_, { dottedName }]) => {
		const evaluated = engine.evaluate(dottedName)
		return memo + evaluated.nodeValue
	}, 0)

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
							evaluation = engine.evaluate(question.dottedName),
							nodeValue = evaluation.nodeValue,
							value =
								situationValue != null
									? situationValue
									: Math.round(Math.random() * 10) |
									  question.rawNode['par défaut']
						return (
							<li className="ui__ card interactive" key={name}>
								<h4>{title}</h4>
								<div
									css={`
										${!description ? 'font-size: 200%' : ''}
									`}
								>
									{icônes && emoji(icônes)}
								</div>
								<p>{description && description.split('\n')[0]}</p>
								<div css={' span {margin: .8rem; font-size: 120%}'}>
									<button
										className={`ui__ button small plain ${
											!value ? 'disabled' : ''
										}`}
										onClick={() =>
											nodeValue > 0 &&
											dispatch(
												updateSituation(question.dottedName, nodeValue - 1)
											)
										}
									>
										-
									</button>
									<input
										type="number"
										css={`
											width: 1.5rem;
											padding: 0; /* Necessary for iPhone Safari 7-12 at least */
											height: 1.5rem;
											font-size: 100%;
											color: var(--darkColor);
											margin: 0 0.6rem;
											text-align: center;
											border: none;
											border-bottom: 2px dotted var(--color);
										`}
										value={
											situation[question.dottedName] == null
												? undefined
												: nodeValue
										}
										placeholder={nodeValue}
										onChange={(e) =>
											dispatch(
												updateSituation(question.dottedName, +e.target.value)
											)
										}
									></input>
									<button
										className="ui__ button small plain"
										onClick={() =>
											dispatch(
												updateSituation(question.dottedName, nodeValue + 1)
											)
										}
									>
										+
									</button>
								</div>
							</li>
						)
					}
				)}
			</Mosaic>
			{/* If "chipsTotal" is specified, show to the user the exact number of
			choices that must be filled */}
			{chipsTotal && (
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
			)}
		</div>
	)

	return (
		<div css="margin-top: 0.6rem; display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end">
			{choiceElements}
		</div>
	)
}
