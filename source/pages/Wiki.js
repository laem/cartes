import byCategory from 'Components/categories'
import Search from 'Components/Search'
import { utils } from 'publicodes'
import { pick } from 'ramda'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Worker from 'worker-loader!Components/WikiSearchWorker.js'
import Emoji from '../components/Emoji'
const worker = new Worker()
const { encodeRuleName } = utils

export default function Suggestions() {
	const rules = useSelector((state) => state.rules)
	let exposedRules = Object.entries(rules)
		.map(([dottedName, v]) => ({ ...v, dottedName }))
		.filter((rule) => rule?.exposé === 'oui')
	let [results, setResults] = useState(exposedRules)
	let [input, setInput] = useState(null)

	useEffect(() => {
		worker.postMessage({
			rules: Object.values(exposedRules).map(
				pick(['title', 'description', 'name', 'dottedName'])
			),
		})

		worker.onmessage = ({ data: results }) => setResults(results)
	}, [])

	return (
		<section>
			<h1 css="font-size: 150%">
				Découvre l'impact de chaque geste du quotidien !
			</h1>
			<Search
				setInput={(input) => {
					setInput(input)
					if (input.length > 2) worker.postMessage({ input })
				}}
			/>
			<section style={{ marginTop: '1.3rem' }}>
				{input ? (
					results.length ? (
						<>
							<h2 css="font-size: 100%;">Résultats :</h2>

							<RuleList {...{ rules: results, exposedRules }} />
						</>
					) : (
						<p>Rien trouvé {emoji('😶')}</p>
					)
				) : (
					<CategoryView exposedRules={exposedRules} />
				)}
			</section>
		</section>
	)
}

const CategoryView = ({ exposedRules }) => {
	const categories = byCategory(exposedRules)
	console.log(categories)
	return (
		<ul
			css={`
				padding-left: 0;
				list-style: none;
				li {
				}
				> li > h2 {
					text-transform: uppercase;
					font-size: 85%;
					width: auto;
					margin: 0 auto;
					text-align: center;
					border-radius: 0.3rem;
					width: 6.5rem;
					color: var(--textColor);
					background: var(--color);
				}
				li > ul > li {
					white-space: initial;
					display: inline-block;
				}
				li > ul {
					padding-left: 0;
				}

				@media (max-width: 600px) {
					li > ul {
						display: block;
						white-space: nowrap;
						overflow-x: auto;
					}
					li > ul > li {
						margin: 0 1rem;
					}
				}
			`}
		>
			{categories.map(([category, rules], i) => (
				<li>
					<h2>{category}</h2>
					<RuleList {...{ rules, exposedRules: rules }} />
					{false && i === 0 && (
						<div
							css={`
								display: none;
								height: 3em;
								margin: 1em auto;
								@media (max-width: 600px) {
									display: block;
								}
							`}
						>
							<Emoji extra="E105" alt="glisser horizontalement" />
						</div>
					)}
				</li>
			))}
		</ul>
	)
}
const RuleList = ({ rules }) => (
	<ul css="display: flex; flex-wrap: wrap; justify-content: space-evenly;     ">
		{rules.map(({ dottedName, icônes, titre }) => {
			return (
				<li css="list-style-type: none" key={dottedName}>
					<Link
						to={'/simulateur/' + encodeRuleName(dottedName)}
						css={`
							text-decoration: none !important;
							:hover {
								opacity: 1 !important;
							}
						`}
					>
						<div
							className="ui__ card box"
							css={`
								img {
									font-size: 150%;
								}
							`}
						>
							<Emoji e={icônes} />
							<h3>{titre}</h3>
						</div>
					</Link>
				</li>
			)
		})}
	</ul>
)
