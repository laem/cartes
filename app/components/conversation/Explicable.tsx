import React, { useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { DottedName } from 'Rules'
import './Explicable.css'

const explainVariable = (variableName: DottedName | null = null) =>
	({
		type: 'EXPLAIN_VARIABLE',
		variableName,
	} as const)
export function ExplicableRule({ dottedName }: { dottedName: DottedName }) {
	const tracker = useContext(TrackerContext)
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const dispatch = useDispatch()

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) return null

	return (
		<button
			className="ui__ link-button"
			onClick={(e) => {
				tracker.push(['trackEvent', 'help', dottedName])
				if (explained === dottedName) {
					return dispatch(explainVariable(null))
				}
				dispatch(explainVariable(dottedName))
				e.preventDefault()
				e.stopPropagation()
			}}
			css={`
				margin-left: 0.3rem !important;
				vertical-align: middle;
				img {
					width: 2.3rem;
					margin-left: 0.4rem;
					vertical-align: bottom;
				}
			`}
		>
			<img src={'/images/yellow-info.svg'} />
		</button>
	)
}
