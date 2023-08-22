'use client'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DottedName } from 'Rules'
import './Explicable.css'

const explainVariable = (variableName: DottedName | null = null) =>
	({
		type: 'EXPLAIN_VARIABLE',
		variableName,
	} as const)
export function ExplicableRule({ dottedName }: { dottedName: DottedName }) {
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const dispatch = useDispatch()

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) return null

	return (
		<button
			onClick={(e) => {
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
				height: auto;
				img {
					width: 2.3rem;
					height: auto;
					margin-left: 0.4rem;
					vertical-align: bottom;
				}
			`}
		>
			<img src={'/yellow-info.svg'} height="10px" width="10px" />
		</button>
	)
}
