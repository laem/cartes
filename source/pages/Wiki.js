import byCategory from 'Components/categories'
import Search from 'Components/Search'
import { utils } from 'publicodes'
const { encodeRuleName } = utils
import { pick } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Worker from 'worker-loader!Components/WikiSearchWorker.js'
import Emoji from '../components/Emoji'
import { useEngine } from '../components/utils/EngineContext'
const worker = new Worker()
import TopBar from 'Components/TopBar'

export default function Suggestions() {
	const rules = useSelector((state) => state.rules)

	let exposedRules = Object.entries(rules)
		.map(([dottedName, v]) => ({ ...v, dottedName }))
		.filter((rule) => rule?.exposé)
	const withCustomSimulators = [
		...exposedRules,
		{
			titre: 'Prix à la pompe',
			description:
				'Décomposition du prix des carburants à la pompe (essence, gazole)',
		},
	]
	let [results, setResults] = useState(exposedRules)
	let [input, setInput] = useState(null)

	useEffect(() => {
		worker.postMessage({
			rules: Object.values(exposedRules).map(
				pick(['titre', 'description', , 'dottedName'])
			),
		})

		worker.onmessage = ({ data: results }) =>
			setResults(results.map((el) => el.item))
	}, [])

	return (
		<section className="ui__ container">
			<TopBar />
			<h1 css="font-size: 150%; line-height: 1.6rem; margin: 1rem">
				Découvre l'impact de chaque geste du quotidien !
			</h1>
			<Search
				setInput={(input) => {
					setInput(input)
					if (input.length > 2) worker.postMessage({ input })
				}}
			/>
			<section css="@media (min-width: 800px){margin-top: .6rem}">
				{input ? (
					results.length ? (
						<>
							<h2 css="font-size: 100%;">Résultats :</h2>

							<RuleList {...{ rules: results, exposedRules }} />
						</>
					) : (
						<p>
							Rien trouvé <Emoji e="😶" />
						</p>
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
					width: 7rem;
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
	<ul
		css={`
			display: flex;
			flex-wrap: wrap;
			justify-content: space-evenly;
			align-items: center;
		`}
	>
		{rules.map(({ dottedName }) => {
			const engine = useEngine(),
				rule = engine.getRule(dottedName),
				{
					title,
					rawNode: { icônes },
				} = rule

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
							className="ui__ card box interactive light-border"
							css={`
								width: 9rem;
								margin: 0.6rem 0.6rem 0.6rem 0rem !important;
								min-height: 7.5rem;
								display: flex;
								flex-direction: column;
								justify-content: center;
								img {
									font-size: 150%;
								}
								h3 {
									margin: 0;
									font-size: 110%;
								}
								padding: 0.6rem !important;
								@media (max-width: 600px) {
									padding: 0.6rem;
									width: 9rem;
									font-size: 110%;
								}
							`}
						>
							<Emoji e={icônes} />
							<h3>{title}</h3>
						</div>
					</Link>
				</li>
			)
		})}
	</ul>
)
