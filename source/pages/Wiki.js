import byCategory from 'Components/categories'
import Search from 'Components/Search'
import TopBar from 'Components/TopBar'
import { utils } from 'publicodes'
import { pick } from 'ramda'
import React, { useEffect, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Worker from 'worker-loader!Components/WikiSearchWorker.js'
import Emoji from '../components/Emoji'
import { useEngine } from '../components/utils/EngineContext'
const { encodeRuleName } = utils
const worker = new Worker()

import topElements from './topElements.yaml'

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
				Découvre les impacts de chaque geste du quotidien !
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

							<RuleList {...{ rules: results, exposedRules, input }} />
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
				> li > h2 {
					text-transform: uppercase;
					font-size: 85%;
					margin: 2rem auto 0.6rem;
					text-align: center;
					border-radius: 0.3rem;
					width: 8.3rem;
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
					> li > h2 {
						margin: 0.6rem auto 0.2rem;
					}
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
			<li>
				<h2
					css={`
						border-bottom: 6px solid orange;
						padding: 0.1rem;
					`}
				>
					<Emoji e="🔥" /> Actualités
				</h2>
				<RuleList
					{...{
						rules: topElements.map((dottedName) =>
							typeof dottedName === 'string' ? { dottedName } : dottedName
						),
					}}
				/>
			</li>
			{categories.map(([category, rules], i) => (
				<li>
					<h2>{category}</h2>
					<RuleList {...{ rules }} />
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
const RuleList = ({ rules, input }) => (
	<ul
		css={`
			display: flex;
			flex-wrap: wrap;
			justify-content: space-evenly;
			align-items: center;
		`}
	>
		{rules.map((ruleObject) => {
			const dottedName = ruleObject.dottedName
			const engine = useEngine(),
				rule = dottedName ? engine.getRule(dottedName) : ruleObject,
				title = rule.title || rule.titre,
				icônes = rule.icônes || rule.rawNode?.icônes

			return (
				<li css="list-style-type: none" key={dottedName}>
					<Link
						to={rule.url || '/simulateurs/' + encodeRuleName(dottedName)}
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
								height: 8rem;
								display: flex;
								flex-direction: column;
								justify-content: center;
								img {
									font-size: 150%;
								}
								h3 {
									margin: 0;
									font-size: 110%;
									line-height: 1.3rem;
								}
								padding: 0.6rem !important;
								@media (max-width: 600px) {
									padding: 0.6rem;
									width: 9rem;
									font-size: 110%;
								}
								.highlighted {
									background-image: linear-gradient(
										-100deg,
										var(--color),
										var(--lightColor) 95%,
										var(--color)
									);
									border-radius: 0.5em 0 0.6em 0;
									padding: 0 0.3rem;
								}
							`}
						>
							<Emoji e={icônes} />
							<h3>
								{input ? (
									<Highlighter
										searchWords={input.split(' ')}
										autoEscape={true}
										textToHighlight={title}
										highlightClassName="highlighted"
									/>
								) : (
									title
								)}
							</h3>
						</div>
					</Link>
				</li>
			)
		})}
	</ul>
)
