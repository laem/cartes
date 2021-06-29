import { useState, useRef, useEffect } from 'react'
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

	return (
		<Dialog
			title={title}
			text={text}
			isOpen={isOpen}
			onReject={onReject}
			onAccept={onAccept}
		/>
	)
}
