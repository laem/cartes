import { T } from 'Components'
import SearchBar from 'Components/SearchBar'
import React from 'react'
import { useSelector } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import './RulesList.css'
import emoji from 'react-easy-emoji'
import {Link} from 'react-router-dom'

export default function RulesList() {
	const flatRules = useSelector(flatRulesSelector)
	return (
		<div id="RulesList" className="ui__ container">
			<h1>
				<T>Comprendre nos calculs</T>
			</h1>
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
			<h2>Explorez notre documentation</h2>

			<SearchBar showDefaultList={true} rules={flatRules} />
		</div>
	)
}
