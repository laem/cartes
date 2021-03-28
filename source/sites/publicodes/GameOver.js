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
				<strong>Vous n'êtes pas écolo.</strong>
			</p>
			<p>
				Votre train de vie nous emène vers une planète anormalement réchauffée.
			</p>
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
			personnelle de moins de <strong>3 </strong> tonnes est une{' '}
			<strong>condition nécessaire</strong>.
		</p>

		<p> A l'inverse, on peut respecter le climat mais ne pas être écolo.</p>
		<p>
			Mais vu l'énorme effort que ça représente, c'est déjà une{' '}
			<strong>super étape</strong>.{' '}
		</p>
		<LoudButton to="/fin/chemin">Que faire ?</LoudButton>
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
const Ensemble = () => (
	<Dialog>
		<h1>En parler, partout, tout le temps</h1>
		<p>
			Quand on comprendre l'ampleur de la catastrophe et de l'effort à faire, on
			a de quoi désespérer.
		</p>
		<p>
			Quand on est tout seul, on déprime. Quand on est beaucoup, on change le
			monde. C'est de notre planète, notre futur, notre paix, notre bonheur
			qu'il s'agit, bordel !{' '}
		</p>
		<p>
			Vous avez des amis, de la famille, l'internet ? Partagez-leur ce test ⬇️,
			on est tous dans la <strong>même merde</strong>.
		</p>
		<p>Gros bouton partager</p>
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
			Demain vous pouvez ne pas prendre votre voiture <Emoji e="🚗" />.
		</p>
		<p>
			Dans deux semaines acheter un vélo <Emoji e="🚲" />.
		</p>

		<p>L'été prochain choisir d'autres destinations de vacances en train. </p>

		<p>L'année prochaine déménager, changer de boulot.</p>
		<LoudButton to="/fin/chemin">On s'y met ?</LoudButton>
	</Dialog>
)
