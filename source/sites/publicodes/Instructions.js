import { Link } from 'react-router-dom'
import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { colorScale } from './Simulateur'
import { GameDialog, LoudButton } from './UI'

export default () => {
	return (
		<GameDialog>
			<>
				<h1>Mode d'emploi</h1>
				<p>Répond simplement aux questions qui s'affichent.</p>
				<p>
					La couleur t'indique ton score. On commence tous en{' '}
					<span
						css={`
							background: ${colorScale[0]};
							padding: 0rem 0.3rem;
							margin: 0 0.1rem;
							color: black;
						`}
					>
						vert
					</span>
					.
				</p>
				<p></p>
				<LoudButton to="/simulateur/bilan">C'est parti !</LoudButton>
			</>
		</GameDialog>
	)
}
