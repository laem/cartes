import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import scenarios from './scenarios.yaml'
import { StoreContext } from './StoreContext'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import Emoji from 'Components/Emoji'
import TopBar from '../../components/TopBar'

export default () => {
	const dispatch = useDispatch()
	const scenario = useSelector((state) => state.scenario)
	return (
		<section id="scenarios" className="ui__ container">
			<TopBar />
			<h1>Le budget climat personnel</h1>
			<p>
				Le jeu est simple : plus on émet de gaz à effet de serre, plus on se
				dirige vers une catastrophe climatique. Ces émissions se mesurent en{' '}
				<Link to="/a-propos">kg équivalent CO₂</Link>, et le budget attribué aux
				humains pour limiter le réchauffement est en général défini à{' '}
				<Link to="/scenarios">2 tonnes</Link> par humain et par an.{' '}
			</p>
			<p>
				Ce qui nous fait une belle jambe, n'est-ce pas : que veut dire 2 tonnes
				par an <Emoji e="🤔" /> ?
			</p>
			<p>
				{' '}
				Pour mieux comprendre ce que ce budget nous permet au quotidien, nous
				convertissons ici le coût climat de notre quotidien
				<strong>
					en <Emoji e="⌚️" /> temps climat
				</strong>
				.
			</p>
			<p>
				Concrètement, avec notre budget annuel de 2 tonnes, nous disposons
				d'environ 5 kg par jour (2000 kg / 365 jours), donc un peu plus de 200g
				par heure (5 kg / 24 h).{' '}
			</p>
			<p>
				Illustrations <Emoji e="⬇️" />
			</p>
			<blockquote>
				<p>
					<Emoji e="📺️" /> Exemple avec un épisode de série en streaming qu'on
					regarde le soir chez nous : s'il émet 100 g de CO2e, alors cela
					représente deux fois moins que notre heure climat à 200g, donc une
					demi-heure.
				</p>
				<p>
					Ainsi, pour un épisode de 40 minutes posé dans mon canapé, j'ai
					consommé un crédit climat d'une demi-heure. C'est parfait, on est à
					l'équilibre !
				</p>
			</blockquote>
			<blockquote>
				<Emoji e="✈️" /> Autre exemple radicalement différent. Si mon voyage en
				avion émet 500 kg, alors ce vol consomme un quart de crédit annuel : en
				2 heures de vol, j'ai grillé un trimestre de mon crédit carbone ! Aïe.
			</blockquote>
		</section>
	)
}
