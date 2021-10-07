import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
import Overlay from '../../components/Overlay'
import { PersonaGrid } from './Personas'
import IllustratedMessage from '../../components/ui/IllustratedMessage'
import { useHistory } from 'react-router'

export default ({}) => {
	const history = useHistory()
	return (
		<Overlay onClose={() => history.push('/profil')}>
			<div>
				<h1>Simulation manquante</h1>
				<IllustratedMessage
					inline
					emoji="⏳️"
					message={
						<p>
							Vous n'avez pas encore fait le test. Le parcours de passage à
							l'action ne sera pas du tout personnalisé.
						</p>
					}
				/>
				<div css="margin: 1rem auto; text-align: center">
					<Link to="/simulateur/bilan" className="ui__ plain button">
						Faire le test
					</Link>
				</div>
				<p>
					{emoji('💡 ')}
					Vous pouvez aussi voir le parcours action comme si vous étiez l'un de
					ces personas :
				</p>
				<PersonaGrid additionnalOnClick={() => null} />
			</div>
		</Overlay>
	)
}
