import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import { Switch, Link, Route } from 'react-router-dom'
import {
	deletePreviousSimulation,
	resetSimulation,
} from '../../actions/actions'
import Emoji from '../../components/Emoji'
import ShareButton from '../../components/ShareButton'
import { useNextQuestions } from '../../components/utils/useNextQuestion'
import FuturecoMonochrome from '../../images/FuturecoMonochrome'
import { answeredQuestionsSelector } from '../../selectors/simulationSelectors'
import { colorScale } from './Simulateur'
import { GameDialog, LoudButton } from './UI'

const Eraser = ({}) => {
	const dispatch = useDispatch()
	const [erased, setErased] = useState(false)

	if (erased) return <Redirect to="/simulateur/bilan" />
	return (
		<div
			onClick={() => {
				dispatch(resetSimulation())
				dispatch(deletePreviousSimulation())
				setErased(true)
			}}
		>
			<Emoji e="💥" /> Effacer
		</div>
	)
}

const Dialog = ({ children }) => (
	<GameDialog>
		{children}

		<div css="display: flex; justify-content: center">
			<Link to="/">
				<FuturecoMonochrome color={colorScale.slice(-1)[0]} />
			</Link>
		</div>
		<Eraser />
	</GameDialog>
)
export default () => {
	return (
		<Switch>
			<Route exact path="/fin" component={Perdu} />
			<Route exact path="/fin/perdu" component={Perdu} />
			<Route exact path="/fin/définition" component={Définition} />
			<Route exact path="/fin/changer" component={Changer} />
			<Route exact path="/fin/chemin" component={Chemin} />
			<Route exact path="/fin/sources" component={Sources} />
			<Route exact path="/fin/action" component={Action} />
			<Route exact path="/fin/quand" component={Quand} />
			<Route exact path="/fin/pourquoi-trois" component={PourquoiTrois} />
			<Route exact path="/fin/claque" component={Claque} />
			<Route exact path="/fin/trajectoire" component={Trajectoire} />
			<Route exact path="/fin/ensemble" component={Ensemble} />
		</Switch>
	)
}

const Perdu = () => {
	const answeredQuestions = useSelector(answeredQuestionsSelector),
		answerCount = answeredQuestions.length,
		nextSteps = useNextQuestions(),
		nextStepsCount = nextSteps.length

	return (
		<Dialog>
			<h1>Perdu {emoji('🙁')}</h1>
			<p>
				<strong>Tu n'es pas écolo.</strong>
			</p>
			<p>Ton train de vie nous emène vers une planète anormalement chaude.</p>
			<p>
				Il a suffi de <strong>{answerCount}</strong> réponses au test sur{' '}
				<strong>{nextStepsCount}</strong> questions pour le savoir.
			</p>
			<LoudButton to="/fin/définition">
				Comment ça <br /> <em>pas écolo </em> ?
			</LoudButton>
		</Dialog>
	)
}

const Définition = () => (
	<Dialog>
		<h1>Être écolo, définition !</h1>
		<p>
			On ne peut pas être écolo si on défonce le climat. Une empreinte climat
			personnelle de <Emoji e="➖" /> de <strong>3 </strong> tonnes est une{' '}
			<strong>condition nécessaire</strong>.
		</p>

		<p>
			{' '}
			À l'inverse, peut-on respecter le climat sans être écolo ? Peut-être, mais
			vu l'énorme effort que ça représente, c'est <strong>
				peu probable
			</strong>.{' '}
		</p>
		<LoudButton to="/fin/claque">OK...</LoudButton>
	</Dialog>
)

const Chemin = () => (
	<Dialog>
		<h1>Comment prendre le bon chemin ?</h1>
		<p>
			La règle est simple : <br />
			<strong>- 10% d'empreinte par an.</strong>
		</p>
		<p>
			C'est simple : le français <Emoji e="🇫🇷" /> moyen a 10 tonnes d'empreinte.
		</p>

		<p>Expérience intéractive qui propose des pistes de changement</p>
		<LoudButton to="/fin/ensemble">Et ça suffit ?</LoudButton>
	</Dialog>
)
const Claque = () => (
	<Dialog>
		<h1>La claque</h1>
		<p>
			On ne t'avait jamais dit que c'était si compliqué ? Que ce test était{' '}
			<strong>très&nbsp;dur</strong> à passer ?{' '}
		</p>
		<p>
			Pipi sous la douche, ampoules basse conso, zéro déchet, électricité
			"écolo", voiture électrique... les petits gestes nous allègent la
			conscience et la technologie nous rassure.
		</p>
		<p>
			Mais le compte n'y est pas <strong>du tout</strong>.
		</p>

		<LoudButton to="/fin/trajectoire">Il est où alors ?</LoudButton>
	</Dialog>
)
const Trajectoire = () => (
	<Dialog>
		<h1>La trajectoire</h1>
		<p>
			Elle est limpide. Décroitre à 3 tonnes d'empreinte climat par personne.
		</p>
		<p>
			<strong>Diviser par 3</strong> notre empreinte moyenne.
		</p>
		<div
			css={`
				margin: 1rem 0;
				width: 100%;
				height: 25vh;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				> div {
					height: 2.5rem;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: flex-start;
					padding: 0.6rem;
				}
				> div:first-child {
					background: ${colorScale[4]};
					width: 100%;
				}
				> div:last-child {
					background: ${colorScale[0]};
					width: 30%;
				}
			`}
		>
			<div>Le 🇫🇷 👤 moyen</div>
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<marker
						id="arrow"
						fill="white"
						viewBox="0 0 10 10"
						refX="5"
						refY="5"
						markerWidth="5"
						markerHeight="5"
						orient="auto-start-reverse"
					>
						<path d="M 0 0 L 10 5 L 0 10 z" />
					</marker>
				</defs>

				<polyline
					points="10,90 180,10"
					fill="none"
					stroke="white"
					strokeWidth="3px"
					marker-start="url(#arrow)"
				/>
			</svg>
			<div>L'écolo</div>
		</div>

		<LoudButton to="/fin/quand">À partir de quand ?</LoudButton>
	</Dialog>
)
const Quand = () => (
	<Dialog>
		<h1>C'est urgent</h1>
		<p>
			Oubliez les échéances en 2030, les trajectoires à 2050. C'est la plus
			belle <strong>procrastination</strong> de l'histoire humaine.
		</p>
		<p>
			Chaque année passée au-dessus de <strong>3 tonnes</strong> nous met tous
			en danger.
		</p>
		<p>
			Lequel ? Perdre un environnement où peuvent vivre 7 milliards d'êtres
			humains et un billion de fois plus de vie.
		</p>
		<LoudButton to="/fin/pourquoi-trois">Pourquoi 3 tonnes ?</LoudButton>
	</Dialog>
)

const PourquoiTrois = () => (
	<Dialog>
		<h1>Les maths</h1>
		<p>
			Normalement, l'objectif personnel d'équilibre est de{' '}
			<strong>moins de 2 tonnes</strong>. Sauf que c'est inatteignable tout
			seul.
		</p>

		<p>
			En <Emoji e="🇫🇷" />, nos services publics représentent ~1 tonne, et on
			espère qu'elle tendera vers 0.
		</p>
		<p>
			2 <Emoji e="➕" /> 1 = 3
		</p>
		<LoudButton to="/fin/sources">Pourquoi vous croire ?</LoudButton>
	</Dialog>
)

const Sources = () => (
	<Dialog>
		<h1>Pourquoi nous croire ?</h1>
		<p>
			Le calcul utilisé ici est{' '}
			<a href="https://github.com/datagir/nosgestesclimat">
				<strong>complètement ouvert</strong>
			</a>
			, développé par l'ADEME, sans cesse amélioré...
		</p>
		<p>
			Et si on se trompait, que l'empreinte de la <Emoji e="🚗" /> était de 1 et
			pas de 1,234 ?
		</p>
		<p>
			<Emoji e="🎯" /> Peu importe à ce stade, on explose tous tellement les
			objectifs que l'
			<a href="https://www.assistancescolaire.com/eleve/6e/maths/reviser-une-notion/donner-un-ordre-de-grandeur-6mcp13">
				orde de grandeur
			</a>{' '}
			suffit.
		</p>

		<LoudButton to="/fin/action">Comment faire ?</LoudButton>
	</Dialog>
)

const Action = () => (
	<Dialog>
		<h1>Il est où le GPS&nbsp;?</h1>
		<p>
			Ne t'inquiète pas, tu sera guidé : tu pourras continuer le questionnaire,
			puis découvrir plein de façons de réduire ton empreinte.
		</p>
		<p>Mais une chose avant tout ! </p>
		<LoudButton to="/fin/ensemble">Quoi encore ?</LoudButton>
	</Dialog>
)

const Ensemble = () => (
	<Dialog>
		<h1>En parler</h1>
		<p>
			Tout seul, on se recroqueville et on ne va pas loin. Ensemble, on va
			changer ce monde. Il s'agit de notre planète, notre paix, notre bonheur,
			notre futur bordel !
		</p>
		<p>
			Tu as des amis, de la famille, l'internet ?{' '}
			<strong>On est tous dans la même merde.</strong>
		</p>
		<p>Partage-leur ce test ⬇️</p>
		<ShareButton
			text="Es-tu écolo ? Fais le test."
			url={'https://futur.eco'}
			title={'Es-tu écolo ? Le test.'}
			color={'white'}
		/>
	</Dialog>
)

const Changer = () => (
	<Dialog>
		<h1>Changer, maintenant</h1>
		<p>
			On n'a qu'une planète, pas de bouton{' '}
			<em>
				<Emoji e="♻️" />
				recommencer
			</em>
			, mais tout n'est pas cuit !
		</p>
		<p>
			Demain tu pourra ne pas prendre ta voiture <Emoji e="🚗" />.
		</p>
		<p>
			Dans deux semaines acheter un vélo <Emoji e="🚲" />.
		</p>

		<p>L'été prochain choisir d'autres destinations de vacances en train. </p>

		<p>L'année prochaine déménager, changer de boulot.</p>
		<LoudButton to="/fin/chemin">On s'y met ?</LoudButton>
	</Dialog>
)
