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
				<p>Répondez simplement aux questions qui s'affichent.</p>
				<p>
					La couleur vous indique votre score. On commence tous en{' '}
					<span
						css={`
							background: ${colorScale[0]};
							padding: 0.1rem 0.2rem;
							margin: 0 0.1rem;
							color: black;
							border-radius: 0.3rem;
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
