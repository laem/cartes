import { useEffect, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import Overlay from '../../components/Overlay'
import { inIframe } from '../../utils'

// We let iframe integrators ask the user if he wants to share its simulation data to the parent window
const shareDataPopupTimeout = 3500

export default ({ data }) => {
	var [isOpen, setIsOpen] = useState(false)
	//To delay the dialog show in to let the animation play
	const timeoutRef = useRef(null)
	const iframeOptions = useSelector((state) => state.iframeOptions)

	useEffect(() => {
		if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => {
			timeoutRef.current = null
			setIsOpen(true)
		}, shareDataPopupTimeout)
	}, [])
	function onReject() {
		window.parent.postMessage(
			{ error: 'The user refused to share his result.' },
			'*'
		)
		setIsOpen(false)
	}
	function onAccept() {
		window.parent.postMessage(data, '*')
		setIsOpen(false)
	}
	function onClose() {
		setIsOpen(false)
	}
	if (!inIframe() || !document.referrer || !iframeOptions?.iframeShareData)
		return null
	const parent = new URL(document.referrer).hostname
	const text = (
		<div>
			<p>
				En cliquant sur le bouton Accepter, vous nous autoriser à communiquer le
				résumé de votre test d'empreinte climat au site {parent}.
			</p>
			<p>
				Il s'agit donc de vos résultats sur les grandes catégories (transport,
				alimentation...), mais <em>pas</em> le détail question par question (vos
				km en voiture, les m² de votre logement...).
			</p>
			<p>Nosgestesclimat.fr n'est pas affilié à {parent}.</p>
		</div>
	)

	if (!isOpen) return null
	return (
		<Overlay onClose={onClose}>
			<div className="">
				<div className="">
					<h2>Partage de vos résultats à {parent} ?</h2>
					<p>{text}</p>
					<div
						css={`
							display: flex;
							justify-content: space-evenly;
							padding: 1rem;
						`}
					>
						<button onClick={onAccept} className="ui__ plain button">
							{emoji('👍')} Accepter
						</button>
						<button onClick={onReject} className="ui__ button ">
							{emoji('👎')} refuser
						</button>
					</div>
				</div>
			</div>
		</Overlay>
	)
}
