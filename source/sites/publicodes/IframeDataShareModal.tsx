import { useState, useRef, useEffect } from 'react'
import Overlay from '../../components/Overlay'
import Dialog from '../../components/ui/Dialog'
import { inIframe } from '../../utils'

// We let iframe integrators ask the user if he wants to share its simulation data to the parent window
const shareDataPopupTimeout = 3500

export default ({ data }) => {
	var [isOpen, setIsOpen] = useState(false)
	//To delay the dialog show in to let the animation play
	const timeoutRef = useRef(null)
	useEffect(() => {
		if (false && !inIframe()) return
		if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => {
			timeoutRef.current = null
			setIsOpen(true)
		}, shareDataPopupTimeout)
	}, [null])
	function onReject() {
		setIsOpen(false)
		window.parent.postMessage(
			{ error: 'The user refused to share his result.' },
			'*'
		)
	}
	function onAccept() {
		setIsOpen(false)
		window.parent.postMessage(data, '*')
	}
	const parent = document.referrer
	const title = 'Partage de vos résultats à ' + parent + '?',
		text =
			"En cliquant sur le bouton Accepter, vous acceptez d'envoyer les données de votre Bilan Carbone au site " +
			parent +
			". Nos Gestes Climat n'est en aucun cas affilié à " +
			parent

	if (!isOpen) return null
	return (
		<Overlay onClose={onReject}>
			<div className="ui__ dialog-wrapper">
				<div className="ui__ dialog">
					<h5 className="ui__ dialog-title">{title}</h5>
					<p className="ui__ dialog-text">{text}</p>
					<div
						css={`
							display: flex;
							justify-content: space-evenly;
							padding: 1rem;
						`}
					>
						<button onClick={onReject} className="ui__ plain button">
							Accepter
						</button>
						<button onClick={onAccept} className="ui__ button small">
							Refuser
						</button>
					</div>
				</div>
			</div>
		</Overlay>
	)
}
