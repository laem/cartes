import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router'
import { Switch, Link, Route } from 'react-router-dom'
import {
	deletePreviousSimulation,
	resetSimulation,
} from '../../actions/actions'
import FuturecoMonochrome from '../../images/FuturecoMonochrome'
import { colorScale } from './Simulateur'
import { GameDialog, LoudButton } from './UI'

const Eraser = ({}) => {
	const dispatch = useDispatch()
	const [erased, setErased] = useState(false)

	if (erased) return <Redirect to="/simulateur/bilan" />
	return (
		<button
			onClick={() => {
				dispatch(resetSimulation())
				dispatch(deletePreviousSimulation())
				setErased(true)
			}}
		>
			Effacer
		</button>
	)
}

const Dialog = ({ children }) => (
	<GameDialog>
		{children}

		<div css="display: flex; justify-content: center">
			<FuturecoMonochrome color={colorScale.slice(-1)[0]} />
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

const Perdu = () => (
	<Dialog>
		<h1>Perdu {emoji('🙁')}</h1>
		<p>
			<strong>Vous n'êtes pas écolo.</strong>
		</p>
		<p>
			Vos x premières réponses au test sont formelles : votre train de vie nous
			emène déjà vers une planète anormalement réchauffée. [caler l'avancemement
			visuel ici]
		</p>
		<p>
			On ne vous avait jamais dit que c'était si compliqué ? Eh oui, face à la
			falaise on enfile les œillères des petits gestes qui nous allègent la
			conscience et de la technologie qui nous rassure.
		</p>
		<LoudButton to="/fin/définition">Comment ça, "pas écolo" ?</LoudButton>
	</Dialog>
)

const Définition = () => (
	<Dialog>
		<h1>Être écolo, définition !</h1>
		<p>
			On ne peut pas être écolo si on défonce le climat. Avoir une empreinte
			climat de moins de 3 tonnes est une <em>condition nécessaire </em>.
		</p>

		<p>Graphique, explication visuelle.</p>

		<p>
			Ce n'est pas parce qu'on respecte le climat qu'on est écolo, mais en
			pratique, vu l'effort de sobriété que cela demande, c'est déjà une super
			étape.
		</p>
		<LoudButton to="/fin/changer">Que faire ?</LoudButton>
	</Dialog>
)

const Chemin = () => (
	<Dialog>
		<h1>Comment prendre le bon chemin ?</h1>
		<p>La règle est simple : -10% d'empreinte par an.</p>
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
			On n'a qu'une planète, pas de bouton "recommencer", mais tout n'est pas
			cuit !
		</p>
		<p>Demain vous pourrez ne pas prendre votre voiture.</p>
		<p>Dans deux semaines acheter un vélo. </p>
		<p>L'été prochain choisir d'autres destinations de vacances en train. </p>

		<p>L'année prochaine déménager, changer de boulot.</p>
		<LoudButton to="/fin/chemin">On s'y met ?</LoudButton>
	</Dialog>
)
