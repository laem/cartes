import { T } from 'Components'
import SearchBar from 'Components/SearchBar'
import React from 'react'
import { useSelector } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import './RulesList.css'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default function RulesList() {
	const flatRules = useSelector(flatRulesSelector)
	return (
		<div id="RulesList" className="ui__ container">
			<h1>Comprendre nos calculs et conseils</h1>
			<p>
				Notre modèle de calcul est entièrement transparent.
				<img
					src="https://imgur.com/XJqK2VT.png"
					css="width: 150px; margin: 1rem auto; display: block;"
				/>
			</p>
			<p>
				A tout moment pendant la simulation, cliquez sur "{emoji('🔬')}{' '}
				comprendre le calcul" et suivez les liens.{' '}
			</p>
			<p>
				Le code est non seulement transparent, mais aussi contributif : chancun
				peut l'explorer, donner son avis, l'améliorer.
			</p>
			<p>
				<Link to="/contribuer">Venez contribuer</Link> !
			</p>
			<h2>Approfondissez votre connaissance des actions</h2>
			<p>
				En plus des actions simplifiées proposées en fin de simulation, vous
				pouvez approfondir chacun des enjeux en parcourant les fiches complètes
				qui vous donneront : contexte général et contexte associé à chaque
				action, chiffres clés, sources pour établir ces actions, etc.
			</p>
			<p>
				<Link to="/actions/plus">Découvrez toutes les actions détaillées </Link>{' '}
				!
			</p>

			<h2>Explorez notre documentation</h2>

			<SearchBar showDefaultList={true} rules={flatRules} />
		</div>
	)
}
