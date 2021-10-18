import { explainVariable } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import React, { useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import usePortal from 'react-useportal'
import { DottedName } from 'Rules'
import { TrackerContext } from '../utils/withTracker'
import './Explicable.css'

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
				font-size: 110% !important;
			`}
		>
			{emoji('ℹ️')}
		</button>
	)
}

export function Explicable({ children }: { children: React.ReactNode }) {
	const { Portal } = usePortal()
	const [isOpen, setIsOpen] = useState(false)
	return (
		<>
			{isOpen && (
				<Portal>
					<Overlay onClose={() => setIsOpen(false)}>{children}</Overlay>
				</Portal>
			)}
			<button
				className="ui__ link-button"
				onClick={() => setIsOpen(true)}
				css={`
					margin-left: 0.3rem !important;
					vertical-align: middle;
					font-size: 110% !important;
				`}
			>
				{emoji('ℹ️')}
			</button>
		</>
	)
}
