import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import { Dialog } from './GameOver'
import { LoudButton } from './UI'

export const NotBad = ({ answeredRatio }) => {
	const dispatch = useDispatch()
	return (
		<Dialog noEraser>
			<h1>Pas mal ! {emoji('🧐')}</h1>
			<p>
				Tu as répondu à {Math.round(answeredRatio * 100)}% des questions du
				test.
			</p>
			<p>
				Beaucoup de gens sont <strong>déjà hors-jeu.</strong>
			</p>
			<p>
				Mais garde les pieds sur terre, il te reste encore l'essentiel à faire.
			</p>
			<div
				onClick={() =>
					dispatch({ type: 'SET_MESSAGE_READ', message: 'notBad' })
				}
			>
				<LoudButton>Au boulot !</LoudButton>
			</div>
		</Dialog>
	)
}
