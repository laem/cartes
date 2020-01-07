import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export const suggestions = [
	["J'ai petit-déjeuné", '🥐☕', 0.5],
	['Je me suis déplacé', '💼🚶🏿‍♀️', 0.8, true],
	["J'ai déjeuné à midi", '🍽️', 0.8]
]
export const Search = ({ click, items }) => (
	<>
		<h1>Qu'as-tu fait aujourd'hui ? </h1>
		<ul css="li { margin: 1rem 2rem; list-style-type: none;} button { width: 80%}; img {font-size: 150%} ">
			{suggestions
				.filter(
					([t, , , repeats]) => repeats || !items.find(([it]) => t === it)
				)
				.map(item => {
					let [text, icons] = item
					return (
						<li key={text}>
							<Link to="/thermomètre">
								<button className="ui__ card" onClick={() => click(item)}>
									{emoji(icons)} {text}
								</button>
							</Link>
						</li>
					)
				})}
		</ul>
	</>
)
