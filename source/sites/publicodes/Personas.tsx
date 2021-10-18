import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
import { title } from '../../components/publicodesUtils'
import { CardGrid } from './ListeActionPlus'
import personas from './personas.yaml'
import { utils } from 'publicodes'
import { ScrollToTop } from '../../components/utils/Scroll'
import { useDispatch, useSelector } from 'react-redux'
import { setDifferentSituation } from '../../actions/actions'
import CarbonImpact from './CarbonImpact'
import { useEngine } from '../../components/utils/EngineContext'
import SessionBar from '../../components/SessionBar'
import personaSteps from './personaSteps.yaml'

export default ({}) => {
	const configSet = useSelector((state) => state.simulation?.config)

	return (
		<div>
			<ScrollToTop />
			<h1>Personas</h1>
			<p>
				<em>Cliquez pour charger un dans le simulateur.</em>
			</p>
			<PersonaGrid />
			<p>
				Les personas nous permettront de prendre le parti d'une diversité
				d'utilisateurs quand ils voient notamment notre écran "passer à
				l'action".
			</p>
			<h2>Comment créer un persona ?</h2>
			<p>
				C'est dans le fichier{' '}
				<a href="https://github.com/datagir/nosgestesclimat-site/blob/master/source/sites/publicodes/personas.yaml">
					personas.yaml
				</a>{' '}
				que ça se passe. On peut soit copier coller les données d'un autre
				persona et les modifier, soit en créer un de zéro depuis la simulation.
				Une fois la simulation satisfaisante, cliquer sur "Modifier mes
				réponses" puis taper Ctrl-C, ouvrir la console du navigateur (F12),
				vérifiez bien que vous êtes dans l'onglet "Console", allez tout en bas
				de la console (elle est un peu chargée...), puis copier le JSON affiché,
				le coller dans <a href="https://www.json2yaml.com">cet outil</a> pour
				générer un YAML, puis l'insérer dans personas.yaml.
			</p>

			<p>
				Pour les prénoms, on peut utiliser{' '}
				<a href="https://lorraine-hipseau.me">ce générateur</a>.
			</p>
		</div>
	)
}

export const PersonaGrid = ({ additionnalOnClick }) => {
	const dispatch = useDispatch(),
		objectif = 'bilan'
	const persona = useSelector((state) => state.simulation?.persona)
	console.log(persona, personas)

	return (
		<CardGrid css="padding: 0; justify-content: center">
			{personas.map(({ nom, icônes, data, description }) => (
				<li key={nom}>
					<div
						className="ui__ card interactive light-border"
						css={`
							width: 11rem !important;
							height: 15rem !important;
							${nom === persona
								? `border: 2px solid var(--color) !important`
								: ``}
						`}
					>
						<Link
							to={'#'}
							onClick={() => {
								dispatch(
									setDifferentSituation({
										config: { objectifs: [objectif] },
										url: '/simulateur/bilan',
										// the schema of peronas is not fixed yet
										situation: data.situation || data,
										persona: nom,
										foldedSteps: data.foldedSteps || personaSteps, // If not specified, act as if all questions were answered : all that is not in the situation object is a validated default value
									})
								)
								additionnalOnClick && additionnalOnClick()
							}}
						>
							<div>{emoji(icônes || '👥')}</div>
							<div>{nom}</div>
						</Link>
						<p css=" overflow-x: scroll">
							<small>{description}</small>
						</p>
					</div>
				</li>
			))}
		</CardGrid>
	)
}
