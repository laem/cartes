import emoji from 'react-easy-emoji'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import IllustratedMessage from '../../components/ui/IllustratedMessage'
import { PersonaGrid } from './Personas'

export default ({}) => {
	const history = useHistory()
	return (
		<div>
			<h1>Simulation manquante</h1>
			<IllustratedMessage
				inline
				emoji="⏳️"
				message={
					<p>
						Vous n'avez pas encore fait le test. Pour débloquer ce parcours,
						vous devez nous en dire un peu plus sur votre mode de vie.
					</p>
				}
			/>
			<div css="margin: 2rem auto 4rem; text-align: center">
				<Link to="/simulateur/bilan" className="ui__ plain button">
					Faire le test
				</Link>
			</div>
			<p css="text-align: center; max-width: 26rem; margin: 0 auto;">
				{emoji('💡 ')}
				Vous pouvez aussi voir le parcours action comme si vous étiez l'un de
				ces profils types.
			</p>
			<PersonaGrid additionnalOnClick={() => null} />
		</div>
	)
}
