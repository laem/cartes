import { updateSituation } from '@/actions'
import Checkbox from 'Components/ui/Checkbox'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import Emoji from '../../Emoji'
import { Mosaic } from './UI'

export default function SelectDevices({
	name,
	setFormValue,
	selectedRules,
	value: currentValue,
	question,
	options: { defaultsToFalse },
}) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)

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
									: // unlike the NumberedMosaic, we don't preselect cards choices here
									// user tests showed us it is now well received
									defaultsToFalse
									? 'non'
									: question.rawNode['par défaut']

						return (
							<li
								css="padding: 2rem"
								className={`ui__ card interactive light-border ${
									value === 'oui' ? `selected` : ''
								}`}
								key={name}
								onMouseDown={() =>
									dispatch(
										updateSituation(
											question.dottedName,
											value == 'oui' ? 'non' : 'oui'
										)
									)
								}
							>
								{icônes && (
									<div css="font-size: 150%">
										<Emoji e={icônes} />
									</div>
								)}
								<h4>{title}</h4>
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
